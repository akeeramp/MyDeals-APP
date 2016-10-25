using System.Web.Mvc;
using Intel.MyDeals.App;
using Intel.Opaque;

namespace Intel.MyDeals.Controllers
{
    public class DocsController : Controller
    {
        OpCore op = OpAppConfig.Init();

        // GET: Docs
        public ActionResult Index()
        {
            return RedirectToAction("Flows", "Docs");
        }

        public ActionResult Flows()
        {
            OpUserToken user = AppLib.InitAVM(op);
            ViewBag.UserToken = user;
            ViewBag.AppToken = op.AppToken;
            return View();
        }

        public ActionResult Formulas()
        {
            OpUserToken user = AppLib.InitAVM(op);
            ViewBag.UserToken = user;
            ViewBag.AppToken = op.AppToken;
            return View();
        }

    }
}