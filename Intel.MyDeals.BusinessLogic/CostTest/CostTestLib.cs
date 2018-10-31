using System.Collections.Generic;
using System.Linq;
using Intel.MyDeals.DataLibrary;
using Intel.MyDeals.Entities;
using Intel.MyDeals.IBusinessLogic;
using Intel.MyDeals.IDataLibrary;
using Intel.Opaque;

namespace Intel.MyDeals.BusinessLogic
{
    class CostTestLib: ICostTestLib
    {
        private readonly ICostTestDataLib _costTestDataLib;

        public CostTestLib(ICostTestDataLib geoDataLib)
        {
            _costTestDataLib = geoDataLib;
        }

        /// <summary>
        /// TODO: This parameterless constructor is left as a reminder,
        /// once we fix our unit tests to use Moq remove this constructor, also remove direct reference to "Intel.MyDeals.DataLibrary"
        /// </summary>
        public CostTestLib()
        {
            _costTestDataLib = new CostTestDataLib();
        }

        public CostTestDetail GetCostTestDetails(int prcTblId)
        {
            return _costTestDataLib.GetCostTestDetails(prcTblId);
        }

        public PctOverrideReason SetPctOverrideReason(PctOverrideReason data)
        {
            return _costTestDataLib.SetPctOverrideReason(data);
        }

        public OpMsg RunPctContract(int id)
        {
            return RunPct(OpDataElementType.CNTRCT.ToId(), new List<int> { id });
        }

        public OpMsg RunPctPricingStrategy(int id)
        {
            return RunPct(OpDataElementType.PRC_ST.ToId(), new List<int> { id });
        }

        public OpMsg RunPctBulkPricingStrategy(List<int> psIds)
        {
            return RunPct(OpDataElementType.PRC_ST.ToId(), psIds);
        }

        public OpMsg RunPctPricingTable(int id)
        {
            return RunPct(OpDataElementType.PRC_TBL.ToId(), new List<int> { id });
        }

        public OpMsg RunPctDeals(List<int> ids)
        {
            return RunPct(OpDataElementType.WIP_DEAL.ToId(), ids);
        }

        private OpMsg RunPct(int objTypeId, List<int> objSetTypeIds)
        {
            bool passMct, passPct;
            bool testResults = ExecutePctMct(objTypeId, objSetTypeIds, out passMct, out passPct); // Broke this out for readability, next statement is notted.
            if (!testResults)
            {
                return new OpMsg
                {
                    Message = "Cost Test and/or Meet Comp Didn't Pass",
                    MsgType = OpMsg.MessageType.Warning
                };
            }

            return new OpMsg
            {
                Message = "Cost Test and Meet Comp Executed Successfully",
                MsgType = OpMsg.MessageType.Info
            };

        }

        public bool ExecutePctMct(int objTypeId, List<int> objSetTypeIds, out bool passMct, out bool passPct)
        {
            List<PctMctResult> results = _costTestDataLib.RunPct(objTypeId, objSetTypeIds);
            List<string> failures = new List<string> { "Fail", "InComplete", "NOT RUN YET", "" };
            passMct = !results.Any(r => failures.Contains(r.MEETCOMP_TEST_RESULT));
            passPct = !results.Any(r => failures.Contains(r.COST_TEST_RESULT));

            return passMct && passPct;
        }
    }
}
