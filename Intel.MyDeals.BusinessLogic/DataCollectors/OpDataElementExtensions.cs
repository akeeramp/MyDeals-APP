using System.Collections.Generic;
using System.Linq;
using Intel.MyDeals.Entities;
using Intel.Opaque.Data;

namespace Intel.MyDeals.BusinessLogic
{
    public static class OpDataElementExtensions
    {
        private static string LegacyKey = "5000:1/5001:1/5002:1/5003:0/5004:0/5005:0/5006:0/5007:0";

        public static OpDataCollectorFlattenedItem Flattened(this List<OpDataElement> dataElements)
        {
            OpDataCollectorFlattenedItem dealItem = new OpDataCollectorFlattenedItem();
            foreach (OpDataElement de in dataElements)
            {
                string dimKey = de.DimKeyString;
                if (dimKey == LegacyKey) dimKey = "";

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

        public static string DisplayDealId(this OpDataElement de)
        {
            return DealHelperFunctions.DisplayDealId(de.DcParentSID, de.DcID); // TODO Revisit this
        }

    }
}