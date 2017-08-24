using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Intel.MyDeals.Entities;
using System;

namespace Intel.MyDeals.IBusinessLogic
{
    public interface IMeetCompLib
    {
        List<MeetComp> GetMeetCompData();

        List<MeetComp> ActivateDeactivateMeetComp(int MEET_COMP_SID, bool ACTV_IND, DateTime CHG_DTM);
    }
}
