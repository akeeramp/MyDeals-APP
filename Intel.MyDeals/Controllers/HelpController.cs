using System.Web.Mvc;
using Intel.MyDeals.App;
using Intel.Opaque;

namespace Intel.MyDeals.Controllers
{
    public class HelpController : BaseController
    {
        public ActionResult Index()
        {
            return View("index", new ApplicationViewModel
            {
                AppName = "aaa",
                AppDescShort = "bbb",
                AppDesc = "ccc",
                AppCopy = "ddd",
                AppCopyShort = "eee"                
            });
        }
	}
}