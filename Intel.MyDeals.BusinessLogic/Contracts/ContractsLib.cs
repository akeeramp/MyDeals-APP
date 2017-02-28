using System.Collections.Generic;
using System.Linq;
using Intel.MyDeals.DataLibrary;
using Intel.MyDeals.Entities;
using Intel.MyDeals.IBusinessLogic;
using Intel.Opaque.Data;

namespace Intel.MyDeals.BusinessLogic
{
    public class ContractsLib : IContractsLib
    {
        private readonly IDataCollectorLib _dataCollectorLib;

        public ContractsLib(IDataCollectorLib dataCollectorLib)
        {
            _dataCollectorLib = dataCollectorLib;
        }

        public MyDealsData GetContract(int id, bool inclusive = false)
        {
            List<OpDataElementType> opDataElementTypes = inclusive
                ? new List<OpDataElementType>
                {
                    OpDataElementType.Contract,
                    OpDataElementType.PricingStrategy,
                    OpDataElementType.PricingTable,
                    OpDataElementType.PricingTableRow,
                    OpDataElementType.WipDeals
                }
                : new List<OpDataElementType>
                {
                    OpDataElementType.Contract
                };

            return GetContract(id, opDataElementTypes);
        }

        public MyDealsData GetContract(int id, List<OpDataElementType> opDataElementTypes)
        {
            return new DataCollectorDataLib()
                .GetByIDs(OpDataElementType.Contract, new List<int> { id }, opDataElementTypes)
                .FillInHolesFromTemplate();
        }

        public MyDealsData SaveContract(OpDataCollectorFlattenedList data, int custId)
        {
            // Save Data Cycle: Point 1
            return _dataCollectorLib.SavePackets(new OpDataCollectorFlattenedDictList
            {
                [OpDataElementType.Contract] = data
            }, custId);
        }

        public MyDealsData SaveContract(
            OpDataCollectorFlattenedList contracts,
            OpDataCollectorFlattenedList pricingStrategies,
            OpDataCollectorFlattenedList pricingTables,
            OpDataCollectorFlattenedList pricingTableRows,
            OpDataCollectorFlattenedList wipDeals,
            int custId)
        {
            OpDataCollectorFlattenedDictList data = new OpDataCollectorFlattenedDictList();

            if (contracts != null && contracts.Any()) data[OpDataElementType.Contract] = contracts;
            if (pricingStrategies != null && pricingStrategies.Any()) data[OpDataElementType.PricingStrategy] = pricingStrategies;
            if (pricingTables != null && pricingTables.Any()) data[OpDataElementType.PricingTable] = pricingTables;
            if (pricingTableRows != null && pricingTableRows.Any()) data[OpDataElementType.PricingTableRow] = pricingTableRows;
            if (wipDeals != null && wipDeals.Any()) data[OpDataElementType.WipDeals] = wipDeals;

            return _dataCollectorLib.SavePackets(data, custId);
        }
    }
}
