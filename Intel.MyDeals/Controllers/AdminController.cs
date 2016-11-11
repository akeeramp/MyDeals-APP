using System.Web.Mvc;
using Intel.MyDeals.App;
using Intel.MyDeals.BusinessLogic;
using Intel.Opaque;

namespace Intel.MyDeals.Controllers
{
    public class AdminController : Controller
    {
        // GET: Admin
        OpCore op = OpAppConfig.Init();
        // GET: Dashboard
        public ActionResult Index()
        {
            OpUserToken user = AppLib.InitAVM(op);
            ViewBag.UserToken = user;
            ViewBag.AppToken = op.AppToken;

            // Redirect user to error page if he is not a developer, we could add more checks or move this logic to
            if (!user.IsDeveloper()) return RedirectToAction("Security", "Error");

            return View();
        }
    }
}