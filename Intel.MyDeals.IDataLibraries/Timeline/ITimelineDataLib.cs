using System.Collections.Generic;
using Intel.MyDeals.Entities;

namespace Intel.MyDeals.IDataLibrary
{
    public interface ITimelineDataLib
    {
        List<TimelineItem> GetObjTimelineDetails(TimelinePacket timelinePacket);
    }
}
