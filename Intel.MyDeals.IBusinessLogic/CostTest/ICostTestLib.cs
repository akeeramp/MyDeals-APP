using System.Collections.Generic;
using Intel.MyDeals.Entities;
using Intel.Opaque;

namespace Intel.MyDeals.IBusinessLogic
{
    public interface ICostTestLib
    {
        CostTestDetail GetCostTestDetails(int prcTblId);
        PctOverrideReason SetPctOverrideReason(PctOverrideReason data);
        OpMsg RunPctContract(int id);
        OpMsg RunPctPricingStrategy(int id);
        OpMsg RunPctPricingTable(int id);
        OpMsg RunPctDeals(List<int> ids);

    }
}
