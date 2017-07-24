using System.Web.Http;
using Intel.MyDeals.Entities;
using Intel.MyDeals.IBusinessLogic;
using Intel.Opaque;
using System.Net.Http.Formatting;
using System.Net;
using System.Net.Http;
using System.Collections.Generic;
using System.Data;

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

        [Route("GetTimelineDetails/{id}/{OBJ_TYPE}")]                 
        public List<Timeline> GetTimelineDetails(int ID, int OBJ_TYPE)
        {
            return SafeExecutor(() => _timelineLib.GetTimelineDetails(ID, OBJ_TYPE)
                , $"Unable to get Contract Timeline {ID}"
            );            
        }
    }
}