using System.Web.Mvc;
using Intel.MyDeals.App;

namespace Intel.MyDeals.Controllers
{
    public class ConstantsController : BaseController
    {
        // GET: Constants
        public ActionResult Index()
        {
            return View(AppLib.AVM);
        }
    }
}