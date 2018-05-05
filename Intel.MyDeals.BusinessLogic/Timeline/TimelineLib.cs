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

        public List<Timeline> GetTimelineDetails(int ID, int OBJ_TYPE)
        {
            //TODO: OBJ_TYPE set type will determine the which DB proc to call. ie: 1 for Contact, 2 for Pricing table etc
            return _iTimelineDataLib.GetTimelineDetails(ID);
        }

        public List<TimelineItem> GetObjTimelineDetails(TimelinePacket timelinePacket)
        {
            return _iTimelineDataLib.GetObjTimelineDetails(timelinePacket);
        }
    }
}
