using System.Collections.Generic;
using System.Web.Http;
using Intel.MyDeals.Entities;
using Intel.Opaque;
using System;
using System.Linq;
using System.Net;
using Intel.MyDeals.IBusinessLogic;

namespace Intel.MyDeals.Controllers.API
{
    [RoutePrefix("api/Dropdown")]
    public class DropdownController : BaseApiController
	{
		private IDropdownLib _dropdownLib;

		public DropdownController(IDropdownLib _dropdownLib)
		{
			this._dropdownLib = _dropdownLib;
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
