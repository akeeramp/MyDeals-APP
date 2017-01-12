using System.Collections.Generic;

namespace Intel.MyDeals.Entities
{
    public class UiTemplates
    {
        // objsets
        // initial questions
        public Dictionary<string, Dictionary<string, UiModelTemplate>> ModelTemplates { get; set; }

        public Dictionary<string, Dictionary<string, UiObjectTemplate>> ObjectTemplates { get; set; }

    }
}