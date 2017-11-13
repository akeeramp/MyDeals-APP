using System.Collections.Generic;
using Intel.MyDeals.Entities;

namespace Intel.MyDeals.IBusinessLogic
{
    public interface IMeetCompLib
    {
        List<MeetComp> GetMeetCompData();

        List<MeetComp> ActivateDeactivateMeetComp(int MEET_COMP_SID, bool ACTV_IND);

        List<MeetCompResult> GetMeetCompProductDetails(int CNTRCT_OBJ_SID, string MODE);

        List<MeetCompResult> UpdateMeetCompProductDetails(int CNTRCT_OBJ_SID, List<MeetCompUpdate> mcu);
    }
}
