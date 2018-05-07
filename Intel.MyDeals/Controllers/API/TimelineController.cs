using System.Web.Http;
using Intel.MyDeals.Entities;
using Intel.MyDeals.IBusinessLogic;
using System.Collections.Generic;

namespace Intel.MyDeals.Controllers.API
{
    [RoutePrefix("api/Timeline")]
    public class TimelineController : BaseApiController
    {
        // GET: Timeline
        private readonly ITimelineLib _timelineLib;

        public TimelineController(ITimelineLib _timelineLib)
        {
            this._timelineLib = _timelineLib;
        }


        [HttpPost]
        [Route("GetObjTimelineDetails")]
        public List<TimelineItem> GetObjTimelineDetails(TimelinePacket timelinePacket)
        {
            return SafeExecutor(() => _timelineLib.GetObjTimelineDetails(timelinePacket)
                , $"Unable to get Timeline"
            );
        }
    }
}