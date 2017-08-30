using System.Collections.Generic;
using Intel.MyDeals.Entities;
using Intel.MyDeals.IBusinessLogic;
using Intel.MyDeals.IDataLibrary;
using System;

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
        public List<MeetComp> GetMeetCompData()
        {
            // TODO :Later need to decide caching will be apply or not
            return _meetCompCollectorLib.GetMeetCompData();
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

    }
}
