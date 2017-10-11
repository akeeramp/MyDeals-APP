using System.Collections.Generic;
using Intel.MyDeals.Entities;

namespace Intel.MyDeals.IDataLibrary
{
	public interface IDropdownDataLib
	{
		List<BasicDropdown> GetBasicDropdowns();

        List<Dropdown> GetDropdowns();
        
        BasicDropdown ManageBasicDropdowns(BasicDropdown dropdown, CrudModes type);

        List<BasicDropdown> ExecuteManageBasicDropdownSP(BasicDropdown dropdown, CrudModes type);

        bool DeleteBasicDropdown(int id);

		List<OverlappingDeal> GetDealGroupDropdown(int dealId);

	}
}
