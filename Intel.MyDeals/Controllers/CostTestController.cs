using Intel.MyDeals.App;
using Intel.Opaque;
using System.Web.Mvc;

namespace Intel.MyDeals.Controllers
{
	public class CostTestController : Controller
	{
		OpCore op = OpAppConfig.Init();
		// GET: Cost Test
		public ActionResult Index()
		{
			OpUserToken user = AppLib.InitAVM(op);
			ViewBag.UserToken = user;
			ViewBag.AppToken = op.AppToken;
			return View();
		}
	}
}