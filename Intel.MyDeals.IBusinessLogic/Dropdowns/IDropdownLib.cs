using System.Collections.Generic;
using Intel.MyDeals.Entities;

namespace Intel.MyDeals.IBusinessLogic
{
	public interface IDropdownLib
	{
        List<BasicDropdown> GetBasicDropdowns();

	    IEnumerable<BasicDropdown> GetDropdowns(string atrbCd);

        IEnumerable<BasicDropdown> GetDropdowns(string atrbCd, string dealtypeCd);

        DropdownHierarchy[] GetDropdownHierarchy(string prnt);

        DropdownHierarchy[] GetGeoDropdownHierarchy(string prnt);

        List<Dropdown> GetDealTypesDropdown();

        List<Dropdown> GetRoleTypesDropdown();

        List<Dropdown> GetSecurityActionsDropdown();

        List<Dropdown> GetNumTiersDropdown();

        List<Dropdown> GetGeosDropdown();

		List<Dropdown> GetProductLevelDropdown();

		List<Dropdown> GetDropdownGroups();

        BasicDropdown ManageBasicDropdowns(BasicDropdown dropdown, CrudModes type);

        bool DeleteBasicDropdowns(int id);

		//// TODO: Either uncomment the below out or remove it once we re-add Retail Cycle in
		//List<Dropdown> GetRetailPullSDMDropdown(RetailPullParams filterData);

		List<Dropdown> GetSoldToIdDropdown(int custId);

		List<OverlappingDeal> GetDealGroupDropdown(int dealId);

	}
}