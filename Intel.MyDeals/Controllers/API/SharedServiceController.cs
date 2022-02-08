using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Intel.Opaque;
using System.Net.Http;
using Intel.MyDeals.App;
using System.Web.Http;
using Intel.MyDeals.Entities;
using System.Collections.ObjectModel;

namespace Intel.MyDeals.Controllers.API
{
    [RoutePrefix("api/SharedService")]
    public class SharedServiceController : BaseApiController
    {
        public OpCore op;
        public SharedServiceController()
        {
            op = OpAppConfig.Init();
        }

        [Authorize]
        [Route("getAvm")]
        [HttpGet]
        public avmData  getAvm()
        {
            avmData avmData = new avmData();
            OpUserToken user = AppLib.InitAvm(op);
            avmData.UserToken = user;
            avmData.AppToken = op.AppToken.ToString();
            avmData.AppVer = AppLib.AVM.AppVer;
            avmData.AppEnv = AppLib.AVM.AppEnv;
            avmData.IsDeveloper = user.IsDeveloper();
            avmData.IsSuper = user.IsSuper();
            avmData.IsTester = user.IsTester();
            avmData.IsReportingUser = user.IsReportingUser();
            avmData.IsRealSA = user.IsRealSA();
            var idsid = user.Usr.Idsid.ToUpper();
            avmData.UserVarticals = AppLib.UserSettings[idsid].VerticalSecurity; 
            avmData.AppAFToken = string.Format("csrfRequestVerificationToken={0}", GetTokenHeaderValue());

            return avmData;
        }


        [Authorize]
        [Route("getFooter")]
        [HttpGet]
        public footerData Footer()
        {
            footerData FData = new footerData();
            OpUserToken user = AppLib.InitAvm(op);
            FData.AppEnv = AppLib.AVM.AppEnv;
            FData.AppVer = AppLib.AVM.AppVer;
            return FData;
        }

        private static string GetTokenHeaderValue()
        {
            string cookieToken, formToken;
            System.Web.Helpers.AntiForgery.GetTokens(null, out cookieToken, out formToken);
            return cookieToken + ":" + formToken;
        }

        public class avmData
        {

            public OpUserToken UserToken { get; set; }
            public string AppAFToken { get; set; }
            public string AppToken { get; set; }
            public string AppVer { get; set; }
            public string AppEnv { get; set; }
            public bool IsDeveloper { get; set; }
            public bool IsSuper { get; set; }
            public bool IsTester { get; set; }
            public bool IsReportingUser { get; set; }
            public bool IsRealSA { get; set; }
            public ObservableCollection<VerticalSecurityItem> UserVarticals { get; set; }

        }
        public class footerData
        {
            public string AppVer { get; set; }
            public string AppEnv { get; set; }
        }
    }
}