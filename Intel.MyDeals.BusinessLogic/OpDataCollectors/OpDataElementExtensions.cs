using System.Collections.Generic;
using System.Linq;
using Intel.MyDeals.Entities;
using Intel.Opaque.Data;

namespace Intel.MyDeals.BusinessLogic
{
    public static class OpDataElementExtensions
    {
        public static OpDataCollectorFlattenedItem Flattened(this List<OpDataElement> dataElements)
        {
            OpDataCollectorFlattenedItem dealItem = new OpDataCollectorFlattenedItem();
            foreach (OpDataElement de in dataElements)
            {
                string dimKey = de.DimKeyString;

                if (string.IsNullOrEmpty(dimKey))
                {
                    dealItem[de.AtrbCd] = de.AtrbValue.ToString();
                }
                else
                {
                    if (dealItem.ContainsKey(de.AtrbCd)) continue;

                    OpDataCollectorFlattenedItem dictDes = new OpDataCollectorFlattenedItem();
                    foreach (IOpDataElement item in dataElements.Where(d => d.AtrbCd == de.AtrbCd))
                    {
                        dictDes[item.DimKeyString] = item.AtrbValue.ToString();
                    }
                    dealItem[de.AtrbCd] = dictDes;
                }
            }

            return dealItem;
        }

    }
}