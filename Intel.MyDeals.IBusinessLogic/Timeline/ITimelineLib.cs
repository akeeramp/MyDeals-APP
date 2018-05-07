using Intel.MyDeals.Entities;
using System.Collections.Generic;

namespace Intel.MyDeals.IBusinessLogic
{
    public interface ITimelineLib
    {
        List<TimelineItem> GetObjTimelineDetails(TimelinePacket timelinePacket);

    }
}
