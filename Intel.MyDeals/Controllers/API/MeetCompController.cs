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
using Intel.MyDeals.Helpers;

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
        [Route("GetMeetCompData/{cid}/{PRD_CAT_NM}/{BRND_NM}/{HIER_VAL_NM}")]
        public IEnumerable<MeetComp> GetMeetCompData(int cid, string PRD_CAT_NM, string BRND_NM, string HIER_VAL_NM = "") 
        {
            return SafeExecutor(() => _meetCompLib.GetMeetCompData(cid, PRD_CAT_NM, BRND_NM, HIER_VAL_NM)
                , $"Unable to get {"Meet Comp data"}"
            );
        }

        /// <summary>
        /// Get all Met Comp Data
        /// </summary>
        /// <returns>Meet Comp Data</returns>
        [Authorize]
        [Route("GetMeetCompDIMData/{cid}/{MODE}")]
        public IEnumerable<MEET_COMP_DIM> GetMeetCompDIMData(int cid, string MODE)
        {
            return SafeExecutor(() => _meetCompLib.GetMeetCompDIMData(cid, MODE)
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
        [AntiForgeryValidate]
        public List<MeetComp> ActivateDeactivateMeetComp(int MEET_COMP_SID, bool ACTV_IND)
        {
            return SafeExecutor(() => _meetCompLib.ActivateDeactivateMeetComp(MEET_COMP_SID, ACTV_IND)
                , $"Unable to {"Activate Deactivate Meet Comp"}"
            );
        }

        /// <summary>
        /// Manage Meet Comp TAB
        /// </summary>
        /// <param name="CNTRCT_OBJ_SID"></param>
        /// <returns></returns>
        [Authorize]
        [Route("GetMeetCompProductDetails/{CNTRCT_OBJ_SID}/{MODE}")]
        public List<MeetCompResult> GetMeetCompProductDetails(int CNTRCT_OBJ_SID, string MODE)
        {
            return SafeExecutor(() => _meetCompLib.GetMeetCompProductDetails(CNTRCT_OBJ_SID, MODE)
                , $"Unable to {"get Meet Comp"}"
            );
        }

        /// <summary>
        /// Manage Meet Comp TAB
        /// </summary>
        /// <param name="CNTRCT_OBJ_SID"></param>
        /// <returns></returns>
        [Authorize]
        [Route("UpdateMeetCompProductDetails/{CNTRCT_OBJ_SID}")]
        [HttpPost]
        [AntiForgeryValidate]
        public List<MeetCompResult> UpdateMeetCompProductDetails(int CNTRCT_OBJ_SID, List<MeetCompUpdate> mcu)
        {
            return SafeExecutor(() => _meetCompLib.UpdateMeetCompProductDetails(CNTRCT_OBJ_SID, mcu)
                , $"Unable to {"update Meet Comp"}"
            );
        }

        [Authorize]
        [Route("GetDealDetails/{DEAL_OBJ_SID}/{GRP_PRD_SID}/{DEAL_PRD_TYPE}")]
        [HttpPost]
        [AntiForgeryValidate]
        public List<DealDeatils> GetDealDetails(int DEAL_OBJ_SID, int GRP_PRD_SID, string DEAL_PRD_TYPE)
        {
            return SafeExecutor(() => _meetCompLib.GetDealDetails(DEAL_OBJ_SID, GRP_PRD_SID, DEAL_PRD_TYPE)
                , $"Unable to {"update Meet Comp"}"
            );
        }



    }
}
