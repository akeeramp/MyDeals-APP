using System.Collections.Generic;
using System.Web.Http;
using Intel.MyDeals.Entities;
using Intel.MyDeals.IBusinessLogic;
using Intel.MyDeals.Helpers;
using System.Linq;

namespace Intel.MyDeals.Controllers.API
{
    [RoutePrefix("api/ConsumptionCountry")]
    public class ConsumptionCountryController : BaseApiController
    {
        private readonly IConsumptionCountryLib _consumptionCountryLib;

        public ConsumptionCountryController(IConsumptionCountryLib consumptionCountryLib)
        {
            _consumptionCountryLib = consumptionCountryLib;
        }


        /// <summary>
        /// Get Consumption Country List
        /// </summary>
        /// <param name="getCachedResult"></param>
        /// <returns></returns>
        [Authorize]
        [Route("GetConsumptionCountry/{getCachedResult:bool?}")]
        public List<ConsumptionCountry> GetConsumptionCountry(bool getCachedResult = true)
        {
            return SafeExecutor(() => _consumptionCountryLib.GetConsumptionCountry(), "Unable to get Consumption Country");
        }

        [HttpPut]
        [AntiForgeryValidate]
        [Route("UpdateConsumptionCountry")]
        public ConsumptionCountry UpdateConsumptionCountry(ConsumptionCountry data)
        {
            return SafeExecutor(() => _consumptionCountryLib.ManageConsumptionCountry(data, CrudModes.Update)
                , $"Unable to update basic dropdown"
            );
        }

        //[Authorize]
        [HttpPost]
        [AntiForgeryValidate]
        [Route("InsertConsumptionCountry")]
        public ConsumptionCountry InsertConsumptionCountry(ConsumptionCountry data)
        {
            return SafeExecutor(() => _consumptionCountryLib.ManageConsumptionCountry(data, CrudModes.Insert)
                , $"Unable to insert basic dropdown"
            );

        }


    }
}
