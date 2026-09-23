import unittest
import importlib.util
from pathlib import Path
import sys

MODULE_PATH = Path(__file__).resolve().parents[1] / "tools" / "extract-tf2c-binary-signatures.py"
SPEC = importlib.util.spec_from_file_location("tf2c_extractor", MODULE_PATH)
EXTRACTOR = importlib.util.module_from_spec(SPEC)
sys.modules[SPEC.name] = EXTRACTOR
SPEC.loader.exec_module(EXTRACTOR)
parse_gamedata_text = EXTRACTOR.parse_gamedata_text
symbol_signature = EXTRACTOR.symbol_signature
build_demangled_index = EXTRACTOR.build_demangled_index
resolve_demangled_function = EXTRACTOR.resolve_demangled_function
resolve_function = EXTRACTOR.resolve_function


class GameDataParserTests(unittest.TestCase):
    def test_parses_classified_linux64_symbols_without_treating_comments_as_signatures(self):
        text = '''"Games"
{
    "tf2classified"
    {
        "Signatures"
        {
            "CBaseCombatWeapon::FinishReload()"
            {
                "library"  "server"
                // linux64: 0xA594F0
                "linux64"  "@_ZN17CBaseCombatWeapon12FinishReloadEv"
            }
        }
    }
}'''

        [entry] = parse_gamedata_text(text)

        self.assertEqual(entry.name, "CBaseCombatWeapon::FinishReload()")
        self.assertEqual(entry.library, "server")
        self.assertEqual(entry.symbol, "_ZN17CBaseCombatWeapon12FinishReloadEv")
        self.assertEqual(entry.source_line, 7)

    def test_parses_tab_indented_gameconfig_and_escaped_names(self):
        text = '''"Games"
{
\t"tf2classified"
\t{
\t\t"Signatures"
\t\t{
\t\t\t"Quoted \\\"name\\\"()"
\t\t\t{
\t\t\t\t"library"\t"engine"
\t\t\t\t"linux64"\t"@_Z9QuotedNamev"
\t\t\t}
\t\t}
\t}
}'''

        [entry] = parse_gamedata_text(text)

        self.assertEqual(entry.name, 'Quoted "name"()')
        self.assertEqual(entry.library, "engine")
        self.assertEqual(entry.symbol, "_Z9QuotedNamev")

    def test_rejects_malformed_utf8_text_markers_and_missing_linux64_symbol(self):
        with self.assertRaises(ValueError):
            parse_gamedata_text("\ufeff\"Games\"")

        text = '''            "NoSignature()"
            {
                "library" "server"
            }'''
        self.assertEqual(parse_gamedata_text(text), [])

    def test_rejects_a_byte_pattern_in_the_symbol_only_classified_extractor(self):
        text = '''            "BytePattern()"
            {
                "library" "server"
                "linux64" "\\x55\\x48\\x89"
            }'''

        with self.assertRaisesRegex(ValueError, "expected an ELF symbol"):
            parse_gamedata_text(text, "fixture.txt")


class SignatureSelectionTests(unittest.TestCase):
    def test_treats_unsupported_local_name_manglings_as_unavailable(self):
        self.assertIsNone(EXTRACTOR.demangle_symbol("_ZZ3foovENK3$_0clEv"))

    def test_keeps_local_elf_function_as_a_symbol_instead_of_substituting_bytes(self):
        entry = EXTRACTOR.GameDataEntry("Example::Run()", "server", "_ZN7Example3RunEv", "fixture.txt", 1)
        function = EXTRACTOR.Function(entry.symbol, 0x1234, 32, 0x1000, False)

        self.assertEqual(symbol_signature(function), "@_ZN7Example3RunEv")

    def test_does_not_invent_a_signature_when_the_named_function_is_missing(self):
        self.assertIsNone(symbol_signature(None))

    def test_resolves_a_unique_identical_demangled_elf_function_to_its_actual_symbol(self):
        entry = EXTRACTOR.GameDataEntry("foo()", "server", "_ZL3foov", "fixture.txt", 1)
        function = EXTRACTOR.Function("_Z3foov", 0x1234, 32, 0x1000, True)
        functions = {function.name: [function]}

        resolved, method = resolve_function(entry, functions, build_demangled_index(functions))

        self.assertEqual(resolved, function)
        self.assertEqual(method, "demangled-symbol")

    def test_does_not_resolve_a_same_name_function_with_a_different_prototype(self):
        entry = EXTRACTOR.GameDataEntry("Example::Run(int)", "server", "_ZN7Example3RunEi", "fixture.txt", 1)
        function = EXTRACTOR.Function("_ZN7Example3RunEv", 0x1234, 32, 0x1000, True)
        functions = {function.name: [function]}

        resolved, method = resolve_function(entry, functions, build_demangled_index(functions))

        self.assertIsNone(resolved)
        self.assertEqual(method, "no-unique-full-signature-match")

    def test_demangled_resolution_rejects_multiple_distinct_function_addresses(self):
        functions = {
            "_Z3foov": [EXTRACTOR.Function("_Z3foov", 0x1234, 32, 0x1000, True)],
            "_ZL3foov": [EXTRACTOR.Function("_ZL3foov", 0x5678, 32, 0x2000, False)],
        }

        self.assertIsNone(resolve_demangled_function("foo()", build_demangled_index(functions)))

    def test_exact_elf_symbol_is_rejected_when_it_names_distinct_addresses(self):
        entry = EXTRACTOR.GameDataEntry("foo()", "server", "_Z3foov", "fixture.txt", 1)
        functions = {
            "_Z3foov": [
                EXTRACTOR.Function("_Z3foov", 0x1234, 32, 0x1000, True),
                EXTRACTOR.Function("_Z3foov", 0x5678, 32, 0x2000, True),
            ],
        }

        resolved, method = resolve_function(entry, functions, build_demangled_index(functions))

        self.assertIsNone(resolved)
        self.assertEqual(method, "ambiguous-symbol")


if __name__ == "__main__":
    unittest.main()
