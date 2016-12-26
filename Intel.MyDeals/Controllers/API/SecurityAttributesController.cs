using System.Web.Http;
using Intel.MyDeals.Entities;
using System.Collections.Generic;
using Intel.MyDeals.BusinesssLogic;

namespace Intel.MyDeals.Controllers.API
{
    [RoutePrefix("api/SecurityAttributes")]
    public class SecurityAttributesAPIController : BaseApiController
    {
		#region SecurityActions
		[HttpGet]
		[Route("GetSecurityActions")]
		public IEnumerable<SecurityActions> GetSecurityActions()
		{
			return new SecurityAttributesLib().GetSecurityActions();
		}

		[HttpPost]
		[Route("InsertAction")]
		public SecurityActions InsertAction(SecurityActions action)
		{
			return new SecurityAttributesLib().ManageSecurityAction(action, CrudModes.Insert);
		}

		[HttpPost]
		[Route("UpdateAction")]
		public SecurityActions UpdateAction(SecurityActions action)
		{
			return new SecurityAttributesLib().ManageSecurityAction(action, CrudModes.Update);
		}

		[Route("DeleteAction")]
		public bool DeleteAction(int id)
		{
			return new SecurityAttributesLib().DeleteSecurityAction(id);
		}
		#endregion

		#region Admin Application
		[HttpGet]
		[Route("GetAdminApplications")]
		public IEnumerable<AdminApplications> GetAdminApplications()
		{
			return new SecurityAttributesLib().GetAdminApplications();
		}

		[HttpPost]
		[Route("InsertAdminApplication")]
		public AdminApplications InsertApplication(AdminApplications app)
		{
			return new SecurityAttributesLib().ManageAdminApplication(app, CrudModes.Insert);
		}

		[HttpPost]
		[Route("UpdateAdminApplication")]
		public AdminApplications UpdateAdminApplication(AdminApplications app)
		{
			return new SecurityAttributesLib().ManageAdminApplication(app, CrudModes.Update);
		}

		[Route("DeleteAdminApplication")]
		public bool DeleteAdminApplication(int id)
		{
			return new SecurityAttributesLib().DeleteAdminApplication(id);
		}
		#endregion

		#region Admin DealTypes
		[HttpGet]
		[Route("GetAdminDealTypes")]
		public IEnumerable<AdminDealType> GetAdminDealTypes()
		{
			return new SecurityAttributesLib().GetAdminDealTypes();
		}

		[HttpPost]
		[Route("InsertAdminDealType")]
		public AdminDealType InsertAdminDealType(AdminDealType dealType)
		{
			return new SecurityAttributesLib().ManageAdminDealType(dealType, CrudModes.Insert);
		}

		[HttpPost]
		[Route("UpdateAdminDealType")]
		public AdminDealType UpdateDealType(AdminDealType dealType)
		{
			return new SecurityAttributesLib().ManageAdminDealType(dealType, CrudModes.Update);
		}

		[Route("DeleteAdminDealType")]
		public bool DeleteAdminDealType(int id)
		{
			return new SecurityAttributesLib().DeleteAdminDealType(id);
		}
		#endregion

		#region Admin RoleTypes
		[HttpGet]
		[Route("GetAdminRoleTypes")]
		public IEnumerable<AdminRoleType> GetAdminRoleTypes()
		{
			return new SecurityAttributesLib().GetAdminRoleTypes();
		}

		[HttpPost]
		[Route("InsertAdminRoleType")]
		public AdminRoleType InsertAdminRoleType(AdminRoleType RoleType)
		{
			return new SecurityAttributesLib().ManageAdminRoleType(RoleType, CrudModes.Insert);
		}

		[HttpPost]
		[Route("UpdateAdminRoleType")]
		public AdminRoleType UpdateAdminRoleType(AdminRoleType RoleType)
		{
			return new SecurityAttributesLib().ManageAdminRoleType(RoleType, CrudModes.Update);
		}

		[Route("DeleteAdminRoleType")]
		public bool DeleteAdminRoleType(int id)
		{
			return new SecurityAttributesLib().DeleteAdminRoleType(id);
		}
		#endregion
	}
}