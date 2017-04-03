using System.Collections.Generic;
using System.Web.Http;
using Intel.MyDeals.Entities;
using Intel.MyDeals.IBusinessLogic;

namespace Intel.MyDeals.Controllers.API
{
    [RoutePrefix("api/Dropdown")]
    public class DropdownController : BaseApiController
	{
		private readonly IDropdownLib _dropdownLib;

		public DropdownController(IDropdownLib dropdownLib)
		{
			_dropdownLib = dropdownLib;
		}

        [Authorize]
        [Route("GetBasicDropdowns")]
        public IEnumerable<BasicDropdown> GetBasicDropdowns()
        {
            return SafeExecutor(() => _dropdownLib.GetBasicDropdowns()
                , $"Unable to get Basic Dropdowns"
            );
        }

        [Authorize]
        [Route("GetDropdowns/{atrbCd}")]
        public IEnumerable<BasicDropdown> GetDropdowns(string atrbCd)
        {
            return SafeExecutor(() => _dropdownLib.GetDropdowns(atrbCd)
                , $"Unable to get Dropdowns for {atrbCd}"
            );
        }

        [Authorize]
        [Route("GetDropdowns/{atrbCd}/{dealtypeCd}")]
        public IEnumerable<BasicDropdown> GetDropdowns(string atrbCd, string dealtypeCd)
        {
            return SafeExecutor(() => _dropdownLib.GetDropdowns(atrbCd, dealtypeCd)
                , $"Unable to get Dropdowns for {atrbCd} and {dealtypeCd}"
            );
        }

        [Authorize]
        [Route("GetDealTypesDropdowns")]
        public IEnumerable<Dropdown> GetDealTypesDropdowns()
        {
            return SafeExecutor(() => _dropdownLib.GetDealTypesDropdown()
                , $"Unable to get DealTypes Dropdowns"
            );
        }

        [Authorize]
        [Route("GetDropdownGroups")]
        public IEnumerable<Dropdown> GetDropdownGroups()
        {
            return SafeExecutor(() => _dropdownLib.GetDropdownGroups()
                , $"Unable to get Dropdowns Groups"
            );
        }

        [Authorize]
        [Route("GetNumTiersDropdowns")]
        public IEnumerable<Dropdown> GetNumTiersDropdowns()
        {
            return SafeExecutor(() => _dropdownLib.GetNumTiersDropdown()
                , $"Unable to get NumTiers Dropdowns"
            );
        }

        [Authorize]
        [Route("GetGeosDropdowns")]
        public IEnumerable<Dropdown> GetGeosDropdowns()
        {
            return SafeExecutor(() => _dropdownLib.GetGeosDropdown()
                , $"Unable to get Geos Dropdowns"
            );
        }

        [HttpPut]
        [Route("UpdateBasicDropdowns")]
        public BasicDropdown UpdateBasicDropdowns(BasicDropdown data)
        {
            return SafeExecutor(() => _dropdownLib.ManageBasicDropdowns(data, CrudModes.Update)
                , $"Unable to update basic dropdown"
            );
        }

        //[Authorize]
        [HttpPost]
        [Route("InsertBasicDropdowns")]
        public BasicDropdown InsertBasicDropdowns(BasicDropdown data)
        {
            return SafeExecutor(() => _dropdownLib.ManageBasicDropdowns(data, CrudModes.Insert)
                , $"Unable to insert basic dropdown"
            );
        }

        [HttpDelete]
        [Route("DeleteBasicDropdowns/{id}")]
        public bool DeleteBasicDropdowns(int id)
        {
            return SafeExecutor(() => _dropdownLib.DeleteBasicDropdowns(id)
                , $"Unable to delete basic dropdown"
            );
        }
    }
}
