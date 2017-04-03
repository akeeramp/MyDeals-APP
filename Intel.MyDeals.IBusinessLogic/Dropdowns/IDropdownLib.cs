using System.Collections.Generic;
using Intel.MyDeals.Entities;

namespace Intel.MyDeals.IBusinessLogic
{
	public interface IDropdownLib
	{
        List<BasicDropdown> GetBasicDropdowns();

	    IEnumerable<BasicDropdown> GetDropdowns(string atrbCd);

        IEnumerable<BasicDropdown> GetDropdowns(string atrbCd, string dealtypeCd);

        List<Dropdown> GetDealTypesDropdown();

        List<Dropdown> GetRoleTypesDropdown();

        List<Dropdown> GetSecurityActionsDropdown();

        List<Dropdown> GetNumTiersDropdown();

        List<Dropdown> GetGeosDropdown();

        List<Dropdown> GetDropdownGroups();

        BasicDropdown ManageBasicDropdowns(BasicDropdown dropdown, CrudModes type);

        bool DeleteBasicDropdowns(int id);

    }
}