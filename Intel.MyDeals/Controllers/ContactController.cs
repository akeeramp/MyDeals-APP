using System.Web.Mvc;
using Intel.MyDeals.App;

namespace Intel.MyDeals.Controllers
{
    public class ContractController : BaseController
	{
		// GET: Contract
		public ActionResult Index()
		{
			return View(AppLib.AVM);
		}
	}
}