using Intel.MyDeals.Entities;
using Intel.MyDeals.IBusinessLogic;
using System.Collections.Generic;
using System.Web.Http;

namespace Intel.MyDeals.Controllers.API
{
    [RoutePrefix("api/SecurityAttributes")]
    public class SecurityAttributesController : BaseApiController
    {
        private readonly ISecurityAttributesLib _securityAttributesLib;

        public SecurityAttributesController(ISecurityAttributesLib _securityAttributesLib)
        {
            this._securityAttributesLib = _securityAttributesLib;
        }

        #region SecurityActions

        [HttpGet]
        [Route("GetSecurityActions")]
        public IEnumerable<SecurityActions> GetSecurityActions()
        {
            return _securityAttributesLib.GetSecurityActions();
        }

        [HttpPost]
        [Route("InsertAction")]
        public SecurityActions InsertAction(SecurityActions action)
        {
            return _securityAttributesLib.ManageSecurityAction(action, CrudModes.Insert);
        }

        [HttpPost]
        [Route("UpdateAction")]
        public SecurityActions UpdateAction(SecurityActions action)
        {
            return _securityAttributesLib.ManageSecurityAction(action, CrudModes.Update);
        }

        [Route("DeleteAction")]
        public bool DeleteAction(int id)
        {
            return _securityAttributesLib.DeleteSecurityAction(id);
        }

        #endregion SecurityActions

        #region Admin Application

        [HttpGet]
        [Route("GetAdminApplications")]
        public IEnumerable<AdminApplications> GetAdminApplications()
        {
            return _securityAttributesLib.GetAdminApplications();
        }

        [HttpPost]
        [Route("InsertAdminApplication")]
        public AdminApplications InsertApplication(AdminApplications app)
        {
            return _securityAttributesLib.ManageAdminApplication(app, CrudModes.Insert);
        }

        [HttpPost]
        [Route("UpdateAdminApplication")]
        public AdminApplications UpdateAdminApplication(AdminApplications app)
        {
            return _securityAttributesLib.ManageAdminApplication(app, CrudModes.Update);
        }

        [Route("DeleteAdminApplication")]
        public bool DeleteAdminApplication(int id)
        {
            return _securityAttributesLib.DeleteAdminApplication(id);
        }

        #endregion Admin Application

        #region Admin DealTypes

        [HttpGet]
        [Route("GetAdminDealTypes")]
        public IEnumerable<AdminDealType> GetAdminDealTypes()
        {
            return _securityAttributesLib.GetAdminDealTypes();
        }

        [HttpPost]
        [Route("InsertAdminDealType")]
        public AdminDealType InsertAdminDealType(AdminDealType dealType)
        {
            return _securityAttributesLib.ManageAdminDealType(dealType, CrudModes.Insert);
        }

        [HttpPost]
        [Route("UpdateAdminDealType")]
        public AdminDealType UpdateDealType(AdminDealType dealType)
        {
            return _securityAttributesLib.ManageAdminDealType(dealType, CrudModes.Update);
        }

        [Route("DeleteAdminDealType")]
        public bool DeleteAdminDealType(int id)
        {
            return _securityAttributesLib.DeleteAdminDealType(id);
        }

        #endregion Admin DealTypes

        #region Admin RoleTypes

        [HttpGet]
        [Route("GetAdminRoleTypes")]
        public IEnumerable<AdminRoleType> GetAdminRoleTypes()
        {
            return _securityAttributesLib.GetAdminRoleTypes();
        }

        [HttpPost]
        [Route("InsertAdminRoleType")]
        public AdminRoleType InsertAdminRoleType(AdminRoleType RoleType)
        {
            return _securityAttributesLib.ManageAdminRoleType(RoleType, CrudModes.Insert);
        }

        [HttpPost]
        [Route("UpdateAdminRoleType")]
        public AdminRoleType UpdateAdminRoleType(AdminRoleType RoleType)
        {
            return _securityAttributesLib.ManageAdminRoleType(RoleType, CrudModes.Update);
        }

        [Route("DeleteAdminRoleType")]
        public bool DeleteAdminRoleType(int id)
        {
            return _securityAttributesLib.DeleteAdminRoleType(id);
        }

        #endregion Admin RoleTypes
    }
}