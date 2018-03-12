using Intel.MyDeals.Entities;
using System.Collections.Generic;

namespace Intel.MyDeals.IBusinessLogic
{
    public interface ISecurityAttributesLib
    {

        bool DeleteAdminDealType(int id);

        List<AdminDealType> GetAdminDealTypes();

        SecurityWrapper GetSecurityMasks();
        SecurityItems GetMySecurityMasks();

        List<SecurityAttributesDropDown> GetSecurityAttributesDropDownData();

		Dictionary<string, Dictionary<string, Dictionary<string, List<string>>>> GetObjAtrbs();

        AdminDealType ManageAdminDealType(AdminDealType dealType, CrudModes state);

        bool SaveSecurityMappings(List<SecurityMapSave> saveMappings);

	}
}