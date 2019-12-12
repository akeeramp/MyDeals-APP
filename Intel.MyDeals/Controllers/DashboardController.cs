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

            if (Request.UrlReferrer == null &&  DateTime.Now > DateTime.Parse("2019/12/15") && DateTime.Now < DateTime.Parse("2020/01/10")) 
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