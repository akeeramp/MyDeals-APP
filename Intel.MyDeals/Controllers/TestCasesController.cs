using System.Web.Mvc;
using Intel.MyDeals.App;
using Intel.Opaque;

namespace Intel.MyDeals.Controllers
{
    public class TestCasesController : Controller
    {
        OpCore op = OpAppConfig.Init();

        public ActionResult Index()
        {
            OpUserToken user = AppLib.InitAVM(op);
            ViewBag.UserToken = user;
            ViewBag.AppToken = op.AppToken;
            return View(AppLib.AVM);
        }

    }
}