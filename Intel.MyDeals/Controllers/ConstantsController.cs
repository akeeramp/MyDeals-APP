using Intel.MyDeals.App;
using Intel.Opaque;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Intel.MyDeals.Controllers
{
    public class ConstantsController : Controller
    {
        OpCore op = OpAppConfig.Init();

        // GET: Constants
        public ActionResult Index()
        {
            OpUserToken user = AppLib.InitAVM(op);
            ViewBag.UserToken = user;
            ViewBag.AppToken = op.AppToken;
            return View();
        }
    }
}