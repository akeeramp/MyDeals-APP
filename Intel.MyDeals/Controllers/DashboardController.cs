using System.Web.Mvc;

namespace Intel.MyDeals.Controllers
{
    public class DashboardController : BaseController
	{
		// GET: Dashboard
		public ActionResult Index()
		{
			return View();
		}
	}
}