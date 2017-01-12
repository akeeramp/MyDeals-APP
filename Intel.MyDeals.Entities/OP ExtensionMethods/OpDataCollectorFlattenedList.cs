using System.Collections.Generic;

namespace Intel.MyDeals.Entities
{
    public class OpDataCollectorFlattenedList : List<OpDataCollectorFlattenedItem>
    {
        public OpDataCollectorFlattenedList()
        {
        }

        public override string ToString()
        {
            return $"items={Count}";
        }

    }
}