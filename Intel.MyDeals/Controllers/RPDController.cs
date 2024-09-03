using Intel.MyDeals.App;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Intel.MyDeals.Controllers
{
    public class RPDController : BaseController
    {
        // GET: SDM
        public ActionResult Index()
        {
            return View(AppLib.AVM);
        }
    }
}