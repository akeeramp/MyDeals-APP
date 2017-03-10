using Intel.MyDeals.Entities;
using Intel.Opaque;
using System;
using System.Collections.Generic;

namespace Intel.MyDeals.IBusinessLogic
{
    public interface ISecurityAttributesLib
    {
        bool DeleteAdminApplication(int id);

        bool DeleteAdminDealType(int id);

        bool DeleteAdminRoleType(int id);

        bool DeleteSecurityAction(int id);

        List<AdminApplications> GetAdminApplications();

        List<AdminDealType> GetAdminDealTypes();

        List<AdminRoleType> GetAdminRoleTypes();

        List<AppRoleTier> GetAppRoleTiers();

        List<OpRoleType> GetOpRoleTypes();

        List<SecurityActions> GetSecurityActions();

        SecurityWrapper GetSecurityMasks();

		Dictionary<string, Dictionary<string, List<string>>> GetObjAtrbs();

        AdminApplications ManageAdminApplication(AdminApplications app, CrudModes state);

        AdminDealType ManageAdminDealType(AdminDealType dealType, CrudModes state);

        AdminRoleType ManageAdminRoleType(AdminRoleType roleType, CrudModes state);

        SecurityActions ManageSecurityAction(SecurityActions action, CrudModes state);

		bool SaveSecurityMappings(List<SecurityMapSave> saveMappings);

	}
}