using Intel.MyDeals.Entities;
using Intel.Opaque;
using System;
using System.Collections.Generic;

namespace Intel.MyDeals.IBusinessLogic
{
    public interface ISecurityAttributesLib
    {
        ////DEV_REBUILD_REMOVALS
        //bool DeleteAdminApplication(int id);

        bool DeleteAdminDealType(int id);

        ////DEV_REBUILD_REMOVALS
        //bool DeleteAdminRoleType(int id);

        //bool DeleteSecurityAction(int id);

        //List<AdminApplications> GetAdminApplications();

        List<AdminDealType> GetAdminDealTypes();

        ////DEV_REBUILD_REMOVALS
        //List<AdminRoleType> GetAdminRoleTypes();

        //List<SecurityActions> GetSecurityActions();

        SecurityWrapper GetSecurityMasks();
        SecurityItems GetMySecurityMasks();

        List<SecurityAttributesDropDown> GetSecurityAttributesDropDownData();

		Dictionary<string, Dictionary<string, Dictionary<string, List<string>>>> GetObjAtrbs();

        ////DEV_REBUILD_REMOVALS
        //AdminApplications ManageAdminApplication(AdminApplications app, CrudModes state);

        AdminDealType ManageAdminDealType(AdminDealType dealType, CrudModes state);

        ////DEV_REBUILD_REMOVALS
        //AdminRoleType ManageAdminRoleType(AdminRoleType roleType, CrudModes state);

        //SecurityActions ManageSecurityAction(SecurityActions action, CrudModes state);

        bool SaveSecurityMappings(List<SecurityMapSave> saveMappings);

	}
}