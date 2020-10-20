using System.Web.Mvc;
using Intel.MyDeals.App;
using Intel.Opaque;

namespace Intel.MyDeals.Controllers
{
    public class CodingPracticesController : BaseController
    {
        // GET: CodingPractices
        public ActionResult Index()
        {
            return View(AppLib.AVM);
        }

        #region Top Level

        public ActionResult BusinessDesign()
        {
            return View(AppLib.AVM);
        }

        public ActionResult Project()
        {
            return View(AppLib.AVM);
        }

        public ActionResult Flows()
        {
            return View(AppLib.AVM);
        }

        public ActionResult Formulas()
        {
            return View(AppLib.AVM);
        }

        public ActionResult CodingTools()
        {
            return View(AppLib.AVM);
        }

        public ActionResult CodeQuality()
        {
            return View(AppLib.AVM);
        }

        public ActionResult CiCdPipeline()
        {
            return View(AppLib.AVM);
        }

        #endregion


        #region Data Access

        public ActionResult DataAccess()
        {
            return View(AppLib.AVM);
        }

        public ActionResult DataAccessStoredProcedure()
        {
            return View(AppLib.AVM);
        }

        #endregion

        #region Entities

        public ActionResult Entities()
        {
            return View(AppLib.AVM);
        }

        public ActionResult SharedClasses()
        {
            return View(AppLib.AVM);
        }

        public ActionResult ClassFromProcedure()
        {
            return View(AppLib.AVM);
        }

        #endregion

        #region DataLibrary
        public ActionResult DataLibrary()
        {
            return View(AppLib.AVM);
        }

        public ActionResult CallProcedure()
        {
            return View(AppLib.AVM);
        }

        public ActionResult Cache()
        {
            return View(AppLib.AVM);
        }

        public ActionResult CacheManager()
        {
            return View(AppLib.AVM);
        }

        #endregion

        #region Business Logic

        public ActionResult BusinessLogic()
        {
            return View(AppLib.AVM);
        }

        public ActionResult BusinessLogicLayout()
        {
            return View(AppLib.AVM);
        }

        public ActionResult BusinessLogicScope()
        {
            return View(AppLib.AVM);
        }

        public ActionResult BusinessLogicFunction()
        {
            return View(AppLib.AVM);
        }

        public ActionResult BusinessLogicCallProcedure()
        {
            return View(AppLib.AVM);
        }

        public ActionResult BusinessLogicCallCache()
        {
            return View(AppLib.AVM);
        }

        #endregion



        public ActionResult BusinessRules()
        {
            return View(AppLib.AVM);
        }

        public ActionResult Application()
        {
            return View(AppLib.AVM);
        }

        #region MyDeal Presentation

        public ActionResult Presentation()
        {
            return View(AppLib.AVM);
        }

        public ActionResult PresentationWebApi()
        {
            return View(AppLib.AVM);
        }

        public ActionResult PresentationMvcController()
        {
            return View(AppLib.AVM);
        }

        public ActionResult PresentationCallWebApi()
        {
            return View(AppLib.AVM);
        }

        public ActionResult PresentationAngularViews()
        {
            return View(AppLib.AVM);
        }

        #endregion

        #region Examples

        public ActionResult Examples()
        {
            return View(AppLib.AVM);
        }

        public ActionResult DataFromProcWithCache()
        {
            return View(AppLib.AVM);
        }

        public ActionResult DataFromApiWithCache()
        {
            return View(AppLib.AVM);
        }

        #endregion

        #region Coding Tools

        public ActionResult Logging()
        {
            return View(AppLib.AVM);
        }

        public ActionResult ErrorHandling()
        {
            return View(AppLib.AVM);
        }

        public ActionResult UnitTesting()
        {
            OpUserToken user = AppLib.InitAvm(op);
            ViewBag.UserToken = user;
            ViewBag.AppToken = op.AppToken;
            return View(AppLib.AVM);
        }

		public ActionResult CodeReviews ()
		{
			return View(AppLib.AVM);
		}
		
		#endregion

	}
}