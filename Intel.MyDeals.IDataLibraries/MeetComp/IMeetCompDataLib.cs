using Intel.MyDeals.Entities;
using System.Collections.Generic;
using System;

namespace Intel.MyDeals.IDataLibrary
{
    public interface IMeetCompDataLib
    {
        List<MeetComp> GetMeetCompData(int CUST_MBR_SID, string PRD_CAT_NM, string BRND_NM, string HIER_VAL_NM);


        List<MEET_COMP_DIM> GetMeetCompDIMData(int CUST_MBR_SID, string MODE);
        

        List<MeetComp> ActivateDeactivateMeetComp(int MEET_COMP_SID, bool ACTV_IND);

        List<MeetCompResult> GetMeetCompProductDetails(int CNTRCT_OBJ_SID, string MODE, int OBJ_TYPE_ID);

        List<MeetCompResult> UpdateMeetCompProductDetails(int CNTRCT_OBJ_SID, int OBJ_TYPE_ID, List<MeetCompUpdate> mcu);

        List<DealDeatils> GetDealDetails(int DEAL_OBJ_SID, int GRP_PRD_SID, string DEAL_PRD_TYPE);
    }
}
