namespace Intel.MyDeals.Entities.Helpers
{
    public static class FixesHelpers
    {
        public static string FixStructure(string json)
        {
            // Temporary fix because of previously created deals when HAS_L1/L2 was a bool
            json = json.Replace("\"HAS_L1\":false", "\"HAS_L1\":0").Replace("\"HAS_L1\":true", "\"HAS_L1\":1");
            json = json.Replace("\"HAS_L2\":false", "\"HAS_L2\":0").Replace("\"HAS_L2\":true", "\"HAS_L2\":1");

            return json;
        }

    }
}