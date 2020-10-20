using System.Collections.Generic;
using Intel.MyDeals.Entities;

namespace Intel.MyDeals.IBusinessLogic
{
	public interface IDropdownLib
	{
        List<BasicDropdown> GetBasicDropdowns();

        List<DropDowns> GetOpDataElements();

        IEnumerable<BasicDropdown> GetDropdowns(string atrbCd);

        IEnumerable<BasicDropdown> GetDropdownsWithInactives(string atrbCd);

        List<DictDropDown> GetDictDropDown(string atrbCd);

        IEnumerable<BasicDropdown> GetDistinctDropdownCodes(string atrbCd);

        IEnumerable<BasicDropdown> GetDropdowns(string atrbCd, string dealtypeCd);

        IEnumerable<BasicDropdown> GetDropdownsWithCustomer(string atrbCd, string custNm);

        IEnumerable<BasicDropdown> GetDropdownsWithCustomerId(string atrbCd, int custId);

        IEnumerable<BasicDropdown> GetDropdownsByCustomerOnly(string atrbCd, string custNm);

        IEnumerable<BasicDropdown> GetDropdownsByCustomerOnlyId(string atrbCd, int custId);

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

		List<Dropdown> GetSoldToIdDropdown(int custId, IEnumerable<string> geos, IEnumerable<string> custDivs);

        List<Dropdown> GetCustomersDropdown();

        List<OverlappingDeal> GetDealGroupDropdown(OpDataElementType opDataElementType, List<int> dealIds);

	}
}