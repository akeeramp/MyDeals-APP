using System.Web.Mvc;
using Intel.MyDeals.App;

namespace Intel.MyDeals.Controllers
{
    public class CostTestController : BaseController
	{
		// GET: Cost Test
		public ActionResult Index()
		{
			return View(AppLib.AVM);
		}
	}
}