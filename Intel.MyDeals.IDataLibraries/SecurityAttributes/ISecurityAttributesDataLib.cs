using Intel.MyDeals.Entities;
using System.Collections.Generic;

namespace Intel.MyDeals.IDataLibrary
{
    public interface ISecurityAttributesDataLib
    {
        List<AdminDealType> CallManageAdminDealTypeSP(AdminDealType dealType, CrudModes state);

        bool DeleteAdminDealType(int id);

        List<AdminDealType> GetAdminDealTypes();

        AdminDealType ManageAdminDealType(AdminDealType dealType, CrudModes state);

        SecurityWrapper GetSecurityWrapper();

		bool SaveSecurityMappings(List<SecurityMapSave> saveMappings);
	}
}