using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Intel.MyDeals.Controllers
{
    public class PocController : Controller
    {
        // GET: Poc
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult SPA()
        {
            return View();
        }
    }
}