using System;
using System.Web.Mvc;
using Intel.MyDeals.App;

namespace Intel.MyDeals.Controllers
{
    public class DashboardController : BaseController
	{
        // GET: Dashboard
        public ActionResult Index()
        {
            if (Request.UrlReferrer == null &&  DateTime.Now > DateTime.Parse("12/15/2017") && DateTime.Now < DateTime.Parse("1/10/2018"))
            {
                return RedirectToAction("Snow", "Dashboard");
            }
            return View(AppLib.AVM);
        }

        public ActionResult Snow()
        {
            return View(AppLib.AVM);
        }
    }
}