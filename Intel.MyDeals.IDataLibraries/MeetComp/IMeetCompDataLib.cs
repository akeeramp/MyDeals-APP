using Intel.MyDeals.Entities;
using System.Collections.Generic;
using System;

namespace Intel.MyDeals.IDataLibrary
{
    public interface IMeetCompDataLib
    {
        List<MeetComp> GetMeetCompData();

        List<MeetComp> ActivateDeactivateMeetComp(int MEET_COMP_SID, bool ACTV_IND);

        List<MeetCompResult> GetMeetCompProductDetails(int CNTRCT_OBJ_SID);
    }
}
