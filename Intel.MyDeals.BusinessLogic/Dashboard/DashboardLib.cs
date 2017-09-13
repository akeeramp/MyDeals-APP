using System;
using System.Collections.Generic;
using Intel.MyDeals.DataLibrary;
using Intel.MyDeals.Entities;
using Intel.MyDeals.IBusinessLogic;
using Intel.MyDeals.IDataLibrary;
using Intel.Opaque.Data;

namespace Intel.MyDeals.BusinessLogic
{
    public class DashboardLib : IDashboardLib
    {
        private readonly IDashboardDataLib _dashboardDataLib;
        private readonly IPricingTablesLib _pricingTablesLib;

        public DashboardLib(IDashboardDataLib dashboardDataLib, IPricingTablesLib pricingTablesLib)
        {
            _dashboardDataLib = dashboardDataLib;
            _pricingTablesLib = pricingTablesLib;
        }

        public List<DashboardContractSummary> GetDashboardContractSummary(List<int> custIds, DateTime startDate, DateTime endDate)
        {
            return new DashboardDataLib().GetDashboardContractSummary(custIds, startDate, endDate);
        }

        public OpDataCollectorFlattenedDictList GetWipSummary(int ptId)
        {
            List<OpDataElementType> opDataElementTypes = new List<OpDataElementType>
            {
                OpDataElementType.WIP_DEAL
            };

            List<int> atrbs = new List<int>
            {
                Attributes.WF_STG_CD.ATRB_SID,
                Attributes.OBJ_SET_TYPE_CD.ATRB_SID,
                Attributes.PASSED_VALIDATION.ATRB_SID,
                Attributes.START_DT.ATRB_SID,
                Attributes.END_DT.ATRB_SID,
                Attributes.NOTES.ATRB_SID,
                Attributes.TRKR_NBR.ATRB_SID,
                Attributes.COST_TEST_RESULT.ATRB_SID,
                Attributes.MEETCOMP_TEST_RESULT.ATRB_SID,
                Attributes.TITLE.ATRB_SID
            };

            OpDataCollectorFlattenedDictList opDcFlatDictList = OpDataElementType.PRC_TBL.GetByIDs(new List<int> { ptId }, opDataElementTypes, atrbs).AddParentPS(ptId).ToOpDataCollectorFlattenedDictList(ObjSetPivotMode.Pivoted);

            var prntActions = opDcFlatDictList[OpDataElementType.PRC_ST][0]["_actions"];

            OpDataCollectorFlattenedList data = opDcFlatDictList[OpDataElementType.WIP_DEAL];

            var childParent = new Dictionary<int, int>();
            foreach (OpDataCollectorFlattenedItem item in data)
            {
                int dcPrntId = int.Parse(item["DC_PARENT_ID"].ToString());
                if (!item.ContainsKey("isLinked")) item["isLinked"] = false;
                if (!childParent.ContainsKey(dcPrntId)) childParent[dcPrntId] = 0;
                childParent[dcPrntId]++;
                item["_actionsPS"] = prntActions;
            }

            // now set total values
            foreach (OpDataCollectorFlattenedItem item in data)
            {
                int dcPrntId = int.Parse(item["DC_PARENT_ID"].ToString());
                item["_parentCnt"] = childParent[dcPrntId];
            }


            return opDcFlatDictList;
        }
    }
}
