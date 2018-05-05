using Intel.MyDeals.Entities;
using System.Collections.Generic;

namespace Intel.MyDeals.IBusinessLogic
{
    public interface ITimelineLib
    {
        List<Timeline> GetTimelineDetails(int ID, int OBJ_TYPE);
        List<TimelineItem> GetObjTimelineDetails(TimelinePacket timelinePacket);

    }
}
