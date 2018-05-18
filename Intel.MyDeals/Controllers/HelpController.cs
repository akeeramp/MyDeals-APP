using System.Web.Mvc;
using Intel.MyDeals.App;
using Intel.MyDeals.Entities;
using Intel.Opaque;

namespace Intel.MyDeals.Controllers
{
    public class HelpController : BaseController
    {
        public ActionResult Index()
        {
            AppLib.InitAvm(OpAppConfig.Init(), AvmforceMode.User);
            return RedirectToAction("Index", "Home");

            //return View(AppLib.AVM);
        }
	}
}