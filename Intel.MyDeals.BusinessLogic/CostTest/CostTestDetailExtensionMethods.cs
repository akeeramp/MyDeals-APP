using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;
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
