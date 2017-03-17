using System.Linq;
using Intel.MyDeals.BusinessLogic.DataCollectors;
using Intel.MyDeals.Entities;

namespace Intel.MyDeals.BusinessLogic
{
    public static class OpDataCollectorFlattenedListExtensions
    {
        public static OpDataCollectorFlattenedList TranslateToWip(this OpDataCollectorFlattenedList opFlatList)
        {
            OpDataCollectorFlattenedList retFlatList = new OpDataCollectorFlattenedList();
            foreach (OpDataCollectorFlattenedItem item in opFlatList)
            {
                retFlatList.AddRange(item.TranslateToWip());
            }
            return retFlatList;
        }
        
        public static OpDataCollectorFlattenedList TranslateToPrcTbl(this OpDataCollectorFlattenedList opFlatList)
        {
            OpDataCollectorFlattenedList retFlatList = new OpDataCollectorFlattenedList();
            foreach (OpDataCollectorFlattenedItem item in opFlatList)
            {
                retFlatList.AddRange(item.TranslateToWip());
            }
            return retFlatList;
        }
    }
}
