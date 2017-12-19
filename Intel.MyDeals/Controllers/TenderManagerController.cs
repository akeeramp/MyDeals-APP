using System.Web.Mvc;
using Intel.MyDeals.App;

namespace Intel.MyDeals.Controllers
{
    public class TenderManagerController : BaseController
	{
		public ActionResult Index()
		{
			return View(AppLib.AVM);
		}

    }
}