using System.Web.Mvc;
using Intel.MyDeals.App;
using Intel.MyDeals.BusinessLogic;
using Intel.Opaque;

namespace Intel.MyDeals.Areas.Admin.Controllers
{
    public class CacheController : Controller
    {
        OpCore op = OpAppConfig.Init();

        public ActionResult Index()
        {
            OpUserToken user = AppLib.InitAVM(op);
            if (!user.IsDeveloper()) return RedirectToAction("Security", "Error");

            ViewBag.UserToken = user;
            ViewBag.AppToken = op.AppToken;

            return View(AppLib.AVM);
        }
    }
}