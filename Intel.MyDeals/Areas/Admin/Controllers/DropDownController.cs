using System.Web.Mvc;

namespace Intel.MyDeals.Areas.Admin.Controllers
{
    public class DropDownController : Controller
    {
        ////OpCore op = OpAppConfig.Init();

        ////// GET: Admin/DropDown
        ////public ActionResult Index()
        ////{
        ////    OpUserToken user = AppLib.InitAVM(op);
        ////    if (!user.IsDeveloper()) return RedirectToAction("Security", "Error");

        ////    ViewBag.UserToken = user;
        ////    ViewBag.AppToken = op.AppToken;

        ////    ViewBag.DropdownList = new AdminsLib().GetAdminBasicDropdowns()
        ////        .GroupBy(s => s.atrb_col_nm)
        ////        .Select(s => s.First())
        ////        .Select(a => new SimpleKeyValue { KEY = a.layer1_sid.ToString(), VALUE = a.atrb_col_nm })
        ////        .ToList().Distinct().ToList();

        ////    return View(AppLib.AVM);
        ////}



        ////#region CRUD Operations

        ////[AcceptVerbs(HttpVerbs.Post)]
        ////public ActionResult Create([DataSourceRequest] DataSourceRequest request, AdminBasicDropdowns data)
        ////{
        ////    if (data != null && ModelState.IsValid)
        ////    {
        ////        data = new AdminsLib().SetAdminBasicDropdowns("Insert", data);
        ////        //data = DataServices.Create(data);
        ////    }

        ////    return Json(new[] { data }.ToDataSourceResult(request, ModelState));
        ////}

        ////public ActionResult Read([DataSourceRequest] DataSourceRequest request)
        ////{
        ////    return Json(new AdminsLib().GetAdminBasicDropdowns().ToDataSourceResult(request), JsonRequestBehavior.AllowGet);
        ////}

        ////[AcceptVerbs(HttpVerbs.Post)]
        ////public ActionResult Update([DataSourceRequest] DataSourceRequest request, AdminBasicDropdowns data)
        ////{
        ////    if (data != null && ModelState.IsValid)
        ////    {
        ////        data = new AdminsLib().SetAdminBasicDropdowns("Update", data);
        ////    }

        ////    return Json(new[] { data }.ToDataSourceResult(request, ModelState));
        ////}

        ////[AcceptVerbs(HttpVerbs.Post)]
        ////public ActionResult Destroy([DataSourceRequest] DataSourceRequest request, AdminBasicDropdowns data)
        ////{
        ////    if (data != null)
        ////    {
        ////        new AdminsLib().SetAdminBasicDropdowns("Delete", data);
        ////    }

        ////    return Json(new[] { data }.ToDataSourceResult(request, ModelState));
        ////}

        ////#endregion

    }
}