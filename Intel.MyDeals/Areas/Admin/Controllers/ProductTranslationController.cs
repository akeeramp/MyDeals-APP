using System.Web.Mvc;
using Intel.MyDeals.App;
using Intel.MyDeals.BusinesssLogic;
using Intel.MyDeals.Entities;
using Intel.Opaque;
using Kendo.Mvc.Extensions;
using Kendo.Mvc.UI;

namespace Intel.MyDeals.Areas.Admin.Controllers
{
    public class ProductTranslationController : Controller
    {
        ////OpCore op = OpAppConfig.Init();

        ////// GET: Admin/ProductTranslation
        ////public ActionResult Index()
        ////{
        ////    OpUserToken user = AppLib.InitAVM(op);
        ////    if (!user.IsDeveloper()) return RedirectToAction("Security", "Error");

        ////    ViewBag.UserToken = user;
        ////    ViewBag.AppToken = op.AppToken;

        ////    return View(AppLib.AVM);
        ////}

        ////#region Admin User Defined Product Matching CRUD Operations

        ////[AcceptVerbs(HttpVerbs.Post)]
        ////public ActionResult Create([DataSourceRequest] DataSourceRequest request, AdminProdUserTranslation prodUserTranslation)
        ////{
        ////    if (prodUserTranslation == null || !ModelState.IsValid)
        ////        return Json(new[] { prodUserTranslation }.ToDataSourceResult(request, ModelState));

        ////    new ProductsLib().AdminProdUserTranslationCreate(prodUserTranslation);

        ////    return Json(new[] { prodUserTranslation }.ToDataSourceResult(request, ModelState));
        ////}

        ////public ActionResult Read([DataSourceRequest] DataSourceRequest request)
        ////{
        ////    return Json(new ProductsLib().AdminProdUserTranslationRead().ToDataSourceResult(request), JsonRequestBehavior.AllowGet);
        ////}

        ////[AcceptVerbs(HttpVerbs.Post)]
        ////public ActionResult Update([DataSourceRequest] DataSourceRequest request, AdminProdUserTranslation prodUserTranslation)
        ////{
        ////    if (prodUserTranslation == null || !ModelState.IsValid)
        ////        return Json(new[] { prodUserTranslation }.ToDataSourceResult(request, ModelState));

        ////    new ProductsLib().AdminProdUserTranslationUpdate(prodUserTranslation);

        ////    return Json(new[] { prodUserTranslation }.ToDataSourceResult(request, ModelState));
        ////}

        ////[AcceptVerbs(HttpVerbs.Post)]
        ////public ActionResult Delete([DataSourceRequest] DataSourceRequest request, AdminProdUserTranslation prodUserTranslation)
        ////{
        ////    if (prodUserTranslation == null || !ModelState.IsValid)
        ////        return Json(new[] { prodUserTranslation }.ToDataSourceResult(request, ModelState));

        ////    new ProductsLib().AdminProdUserTranslationDelete(prodUserTranslation);

        ////    return Json(new[] { prodUserTranslation }.ToDataSourceResult(request, ModelState));
        ////}
        //////[AcceptVerbs(HttpVerbs.Post)]
        //////public ActionResult Update([DataSourceRequest] DataSourceRequest request, WorkFlow workFlow)
        //////{
        //////    if (workFlow != null && ModelState.IsValid)
        //////    {
        //////        new WorkflowsLib().Update(workFlow);
        //////    }

        //////    return Json(new[] { workFlow }.ToDataSourceResult(request, ModelState));
        //////}

        //////[AcceptVerbs(HttpVerbs.Post)]
        //////public ActionResult Destroy([DataSourceRequest] DataSourceRequest request, WorkFlow workFlow)
        //////{
        //////    if (workFlow != null)
        //////    {
        //////        new WorkflowsLib().Destroy(workFlow);
        //////    }

        //////    return Json(new[] { workFlow }.ToDataSourceResult(request, ModelState));
        //////}

        ////#endregion	

    }
}