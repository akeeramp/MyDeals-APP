using System.Collections.Generic;
using Intel.MyDeals.Entities;
using Intel.MyDeals.IBusinessLogic;
using Intel.MyDeals.IDataLibrary;

namespace Intel.MyDeals.BusinessLogic
{
    public class TimelineLib : ITimelineLib
    {
        private readonly ITimelineDataLib _iTimelineDataLib;

        public TimelineLib(ITimelineDataLib iTimelineDataLib)
        {
            _iTimelineDataLib = iTimelineDataLib;
        }

        public List<TimelineItem> GetObjTimelineDetails(TimelinePacket timelinePacket)
        {
            return _iTimelineDataLib.GetObjTimelineDetails(timelinePacket);
        }
    }
}
