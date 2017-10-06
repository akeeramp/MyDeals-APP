using System.Collections.Generic;
using System.Reflection;
using Intel.MyDeals.Entities;

namespace Intel.MyDeals.BusinessLogic
{
    public static class CostTestDetailExtensionMethods
    {
        public static OpDataCollectorFlattenedList ToOpDataCollectorFlattenedList(this List<CostTestDetailItem> items)
        {
            OpDataCollectorFlattenedList rtnData = new OpDataCollectorFlattenedList();

            PropertyInfo[] fieldNames = typeof(CostTestDetailItem).GetProperties(BindingFlags.Instance |
                       BindingFlags.Static |
                       BindingFlags.NonPublic |
                       BindingFlags.Public);

            foreach (CostTestDetailItem item in items)
            {
                OpDataCollectorFlattenedItem newItem = new OpDataCollectorFlattenedItem();
                foreach (PropertyInfo propertyInfo in fieldNames)
                {
                    newItem[propertyInfo.Name] = propertyInfo.GetValue(item);
                }
                rtnData.Add(newItem);
            }

            return rtnData;
        }

    }
}
