using System.Collections.Generic;
using System.Linq;
using Intel.MyDeals.DataLibrary;
using Intel.MyDeals.Entities;
using Intel.MyDeals.IBusinessLogic;
using Intel.Opaque.Data;

namespace Intel.MyDeals.BusinessLogic
{
    public class PricingTablesLib : IPricingTablesLib
    {
        private readonly IDataCollectorLib _dataCollectorLib;

        public PricingTablesLib(IDataCollectorLib dataCollectorLib)
        {
            _dataCollectorLib = dataCollectorLib;
        }

        public MyDealsData GetPricingTable(int id, bool inclusive = false)
        {
            List<OpDataElementType> opDataElementTypes = inclusive
                ? new List<OpDataElementType>
                {
                    OpDataElementType.PricingTable,
                    OpDataElementType.WipDeals
                }
                : new List<OpDataElementType>
                {
                    OpDataElementType.PricingTable
                };


            // TODO replace with DB call
            return PricingTableData.GetData(id);


            return new DataCollectorDataLib()
                .GetByIDs(OpDataElementType.PricingTable, new List<int> { id }, opDataElementTypes)
                .FillInHolesFromTemplate();
        }

        public MyDealsData SavePricingTable(OpDataCollectorFlattenedList data)
        {
            return _dataCollectorLib.SavePackets(new OpDataCollectorFlattenedDictList
            {
                [OpDataElementType.PricingTable] = data
            });
        }

        public MyDealsData SavePricingTable(
            OpDataCollectorFlattenedList pricingTables,
            OpDataCollectorFlattenedList wipDeals)
        {
            OpDataCollectorFlattenedDictList data = new OpDataCollectorFlattenedDictList();

            if (pricingTables != null && pricingTables.Any()) data[OpDataElementType.PricingTable] = pricingTables;
            if (wipDeals != null && wipDeals.Any()) data[OpDataElementType.WipDeals] = wipDeals;

            return _dataCollectorLib.SavePackets(data);
        }

    }
}