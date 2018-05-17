using System.Web.Mvc;
using Intel.MyDeals.DataLibrary;

namespace Intel.MyDeals.Controllers
{
    public class PingController : Controller
    {
        // GET: Ping
        public ActionResult Index()
        {
            return View();
        }
        public ActionResult Db()
        {
            ViewBag.PingResults = new DevTestDataLib().PingDbDetails();
            return new RedirectResult(Url.Action("Index"));
        }
    }
}