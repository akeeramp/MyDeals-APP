using System.Text.RegularExpressions;

namespace Intel.MyDeals.Entities
{
    public class FuzzySearch
    {
        private static Regex _compiledUnicodeRegex = new Regex(@"[^\u0000-\u007F]", RegexOptions.Compiled);

        public static string StripUnicodeCharactersFromString(string inputValue)
        {
            return _compiledUnicodeRegex.Replace(inputValue, "");
        }
    }
}