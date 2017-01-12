using System.Collections.Generic;
using System.Linq;
using Intel.MyDeals.DataLibrary;
using Intel.MyDeals.Entities;
using Intel.Opaque.Data;

namespace Intel.MyDeals.BusinessLogic.DataCollectors
{
    public static class OpDataCollectorFlattenedListExtensions
    {
        public static MyDealsData ToMyDealsData(this OpDataCollectorFlattenedList data)
        {
            OpDataElementType opDataElementType = OpDataElementType.Deals;
            string idCode = "DEAL_NBR";

            List<int> dealIds = data.Select(items => int.Parse(items[idCode].ToString())).ToList();

            return new DataCollectorDataLib()
                .GetByIDs(OpDataElementType.Deals, dealIds)
                .Merge(opDataElementType, data)
                .FillInHolesFromTemplate();
        }
    }
}
