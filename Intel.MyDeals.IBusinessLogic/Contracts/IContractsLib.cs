using System.Collections.Generic;
using Intel.MyDeals.Entities;
using Intel.Opaque.Data;

namespace Intel.MyDeals.IBusinessLogic
{
    public interface IContractsLib
    {
        MyDealsData GetContract(int id, List<OpDataElementType> opDataElementTypes);
        MyDealsData GetContract(int id, bool inclusive = false);
        MyDealsData SaveContract(OpDataCollectorFlattenedList data, int custId);
        MyDealsData SaveContract(OpDataCollectorFlattenedList contracts, OpDataCollectorFlattenedList pricingStrategies, OpDataCollectorFlattenedList pricingTables, OpDataCollectorFlattenedList pricingTableRows, OpDataCollectorFlattenedList wipDeals, int custId);
    }
}