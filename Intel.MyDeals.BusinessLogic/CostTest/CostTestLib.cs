using System.Collections.Generic;
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
            _costTestDataLib.RunPct(objTypeId, objSetTypeIds);
            return new OpMsg
            {
                Message = "Cost Test and Meet Comp Executed Successfully",
                MsgType = OpMsg.MessageType.Info
            };
        }
    }
}
