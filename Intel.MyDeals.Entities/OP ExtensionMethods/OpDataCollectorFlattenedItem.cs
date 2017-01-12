using System.Collections.Generic;

namespace Intel.MyDeals.Entities
{
    public class OpDataCollectorFlattenedItem : Dictionary<string, object>
    {
        public OpDataCollectorFlattenedItem()
        {
        }

        public override string ToString()
        {
            return $"[{Keys.Count}]: {string.Join(",", Keys)}";
        }
    }
}