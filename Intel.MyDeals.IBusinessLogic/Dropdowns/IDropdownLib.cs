using System.Collections.Generic;
using Intel.MyDeals.Entities;

namespace Intel.MyDeals.IBusinessLogic
{
	public interface IDropdownLib
	{
        List<BasicDropdown> GetBasicDropdowns();

        List<Dropdown> GetDealTypesDropdown();

		List<Dropdown> GetRoleTypesDropdown();
		
		List<Dropdown> GetSecurityActionsDropdown();

		List<Dropdown> GetDropdownGroups();

        BasicDropdown ManageBasicDropdowns(BasicDropdown dropdown, CrudModes type);

        bool DeleteBasicDropdowns(int id);

    }
}