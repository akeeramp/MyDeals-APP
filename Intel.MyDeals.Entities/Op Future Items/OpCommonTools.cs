using System.Web;

namespace Intel.MyDeals.Entities
{
    public static class OpCommonTools
    {

        public static string CSharpIfyName(string input)
        {
            if (string.IsNullOrEmpty(input)) { return input; }

            const string ESCAPE_CHARS = @" =<>-+!@#$%^&*()/\?,.:;""'{}[]|~`";

            foreach (char c in ESCAPE_CHARS)
            {
                input = input.Replace(c, '_');
            }

            input = input
                .Replace("\n", "_")
                .Replace("\r", "_")
                .Replace("\t", "_");

            return input;
        }

        public static string HtmlSafeString(string input)
        {
            //string blah = HttpUtility.HtmlEncode(input);
            return HttpUtility.HtmlEncode(input);
        }

    }
}
