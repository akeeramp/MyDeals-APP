using Intel.MyDeals.App;
using Intel.Opaque;
using System.Web.Mvc;

namespace Intel.MyDeals.Controllers
{
	public class SecurityAttributesController : Controller
	{
		OpCore op = OpAppConfig.Init();
        // GET: SecurityAttributes
        public ActionResult Index()
		{
			OpUserToken user = AppLib.InitAVM(op);
			ViewBag.UserToken = user;
			ViewBag.AppToken = op.AppToken;

			return View();
        }
    }
}