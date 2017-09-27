using System.Collections.Generic;
using Intel.MyDeals.Entities;

namespace Intel.MyDeals.IBusinessLogic
{
    public interface ICostTestLib
    {
        List<CostTestDetailItem> GetCostTestDetails(int prcTblId);
    }
}
