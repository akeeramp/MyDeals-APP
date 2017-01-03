using Intel.MyDeals.Entities;
using System.Collections.Generic;

namespace Intel.MyDeals.IDataLibrary
{
    public interface ISecurityAttributesDataLib
    {
        List<SecurityActions> CallManageActionSP(SecurityActions action, CrudModes state);

        List<AdminApplications> CallManageAdminApplicationSP(AdminApplications app, CrudModes state);

        List<AdminDealType> CallManageAdminDealTypeSP(AdminDealType dealType, CrudModes state);

        List<AdminRoleType> CallManageAdminRoleTypeSP(AdminRoleType dealType, CrudModes state);

        bool DeleteAdminApplication(int id);

        bool DeleteAdminDealType(int id);

        bool DeleteAdminRoleType(int id);

        bool DeleteSecurityAction(int id);

        List<AdminApplications> GetAdminApplications();

        List<AdminDealType> GetAdminDealTypes();

        List<AdminRoleType> GetAdminRoleTypes();

        List<SecurityActions> GetSecurityActions();

        AdminApplications ManageAdminApplication(AdminApplications app, CrudModes state);

        AdminDealType ManageAdminDealType(AdminDealType dealType, CrudModes state);

        AdminRoleType ManageAdminRoleType(AdminRoleType roleType, CrudModes state);

        SecurityActions ManageSecurityAction(SecurityActions action, CrudModes state);
    }
}