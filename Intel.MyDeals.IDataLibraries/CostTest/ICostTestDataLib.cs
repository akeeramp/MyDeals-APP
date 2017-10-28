using System.Collections.Generic;
using Intel.MyDeals.Entities;

namespace Intel.MyDeals.IDataLibrary
{
    public interface ICostTestDataLib
    {
        CostTestDetail GetCostTestDetails(int prcTblId);

        PctOverrideReason SetPctOverrideReason(PctOverrideReason data);

        List<PctMctResult> RunPct(int objTypeId, List<int> objSetTypeIds);

        void RollupResults(List<int> contractLst);
    }
}