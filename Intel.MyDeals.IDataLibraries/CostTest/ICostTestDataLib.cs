using System.Collections.Generic;
using Intel.MyDeals.Entities;

namespace Intel.MyDeals.IDataLibrary
{
    public interface ICostTestDataLib
    {
        List<CostTestDetailItem> GetCostTestDetails(int prcTblId);
    }
}