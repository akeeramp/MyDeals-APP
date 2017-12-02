using System;
using System.Collections.Generic;

namespace Intel.MyDeals.Entities
{
    [Serializable]
    public class OpDataCollectorFlattenedDictList : Dictionary<OpDataElementType, OpDataCollectorFlattenedList>
    {
        public OpDataCollectorFlattenedDictList()
        {
        }

        public override string ToString()
        {
            return $"items={Keys.Count}: {string.Join(",", Keys)}";
        }

    }
}