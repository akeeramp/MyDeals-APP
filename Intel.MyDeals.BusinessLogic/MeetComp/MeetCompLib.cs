using System.Collections.Generic;
using Intel.MyDeals.Entities;
using Intel.MyDeals.IBusinessLogic;
using Intel.MyDeals.IDataLibrary;
using System;
using System.Linq;
using Intel.MyDeals.BusinessRules;

namespace Intel.MyDeals.BusinessLogic
{
    public class MeetCompLib : IMeetCompLib
    {
        private readonly IMeetCompDataLib _meetCompCollectorLib;

        public MeetCompLib(IMeetCompDataLib meetCompCollectorLib)
        {
            _meetCompCollectorLib = meetCompCollectorLib;
        }

        /// <summary>
        /// Get All Meet Comp Data
        /// </summary>
        /// <returns>List of all Meet Comp data</returns>
        public List<MeetComp> GetMeetCompData(int CUST_MBR_SID, string PRD_CAT_NM, string BRND_NM, string HIER_VAL_NM)
        {
            // TODO :Later need to decide caching will be apply or not
            return _meetCompCollectorLib.GetMeetCompData(CUST_MBR_SID, PRD_CAT_NM, BRND_NM, HIER_VAL_NM);
        }

        public List<MEET_COMP_DIM> GetMeetCompDIMData(int CUST_MBR_SID, string MODE)
        {
            // TODO :Later need to decide caching will be apply or not
            return _meetCompCollectorLib.GetMeetCompDIMData(CUST_MBR_SID, MODE);
        }

        /// <summary>
        /// Activate/Deactivate Meet Comp Records.
        /// </summary>
        /// <param name="MEET_COMP_SID"></param>
        /// <param name="ACTV_IND"></param>
        /// <returns></returns>
        public List<MeetComp> ActivateDeactivateMeetComp(int MEET_COMP_SID, bool ACTV_IND)
        {
            // TODO :Later need to decide caching will be apply or not
            return _meetCompCollectorLib.ActivateDeactivateMeetComp(MEET_COMP_SID, ACTV_IND);
        }

        /// <summary>
        /// Manage Meet Comp TAB
        /// </summary>
        /// <param name="CNTRCT_OBJ_SID"></param>
        /// <returns></returns>
        public List<MeetCompResult> GetMeetCompProductDetails(int CNTRCT_OBJ_SID, string MODE, int OBJ_TYPE_ID)
        {
            // TODO :Later need to decide caching will be apply or not
            List<MeetCompResult> data = _meetCompCollectorLib.GetMeetCompProductDetails(CNTRCT_OBJ_SID, MODE, OBJ_TYPE_ID);
            dynamic[] dynData = data.Cast<dynamic>().ToArray();
            MyRulesConfiguration.ApplyRules(dynData, MyRulesTrigger.OnLoadMeetComp);
            List<MeetCompResult> retData = dynData.Cast<MeetCompResult>().ToList();
            return retData;
        }

        /// <summary>
        /// Manage Meet Comp TAB
        /// </summary>
        /// <param name="CNTRCT_OBJ_SID"></param>
        /// <returns></returns>
        public List<MeetCompResult> UpdateMeetCompProductDetails(int CNTRCT_OBJ_SID, int OBJ_TYPE_ID, List<MeetCompUpdate> mcu)
        {
            var data = _meetCompCollectorLib.UpdateMeetCompProductDetails(CNTRCT_OBJ_SID, OBJ_TYPE_ID, mcu);

            // Update also does a get operation, thus apply rules here
            dynamic[] dynData = data.Cast<dynamic>().ToArray();
            MyRulesConfiguration.ApplyRules(dynData, MyRulesTrigger.OnLoadMeetComp);
            List<MeetCompResult> retData = dynData.Cast<MeetCompResult>().ToList();
            return retData;
        }

        public List<DealDeatils> GetDealDetails(int DEAL_OBJ_SID, int GRP_PRD_SID, string DEAL_PRD_TYPE)
        {
            return _meetCompCollectorLib.GetDealDetails(DEAL_OBJ_SID, GRP_PRD_SID, DEAL_PRD_TYPE);
        }
    }
}