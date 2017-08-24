using System.Collections.Generic;
using System.Web.Http;
using Intel.MyDeals.BusinessLogic;
using Intel.MyDeals.BusinessLogic.DataCollectors;
using Intel.MyDeals.Entities;
using Intel.MyDeals.IBusinessLogic;
using Intel.Opaque;
using Intel.Opaque.Data;
using System.Net;
using System.Text;
using System;

namespace Intel.MyDeals.Controllers.API
{
    [RoutePrefix("api/MeetComp")]
    public class MeetCompController : BaseApiController
    {
        private readonly IMeetCompLib _meetCompLib;
        public MeetCompController(IMeetCompLib meetCompLib)
        {
            _meetCompLib = meetCompLib;
        }

        /// <summary>
        /// Get all Met Comp Data
        /// </summary>
        /// <returns>Meet Comp Data</returns>
        [Authorize]
        [Route("GetMeetCompData")]
        public IEnumerable<MeetComp> GetMeetCompData()
        {
            return SafeExecutor(() => _meetCompLib.GetMeetCompData()
                , $"Unable to get {"Meet Comp data"}"
            );            
        }

        /// <summary>
        /// Activate/Deactivate Meet Comp Record
        /// </summary>
        /// <param name="MEET_COMP_SID"></param>
        /// <param name="ACTV_IND"></param>
        /// <returns>Activate/Deactivate Meet Comp Record</returns>
        [Authorize]
        [Route("ActivateDeactivateMeetComp/{MEET_COMP_SID}/{ACTV_IND:bool?}")]
        [HttpPost]
        public List<MeetComp> ActivateDeactivateMeetComp(int MEET_COMP_SID, bool ACTV_IND)
        {
            return SafeExecutor(() => _meetCompLib.ActivateDeactivateMeetComp(MEET_COMP_SID, ACTV_IND, DateTime.Now.Date)
                , $"Unable to {"Activate Deactivate Meet Comp"}"
            );
        }
        
    }
}
