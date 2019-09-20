using Intel.MyDeals.Entities;
using Intel.MyDeals.Helpers;
using Intel.MyDeals.IBusinessLogic;
using System.Collections.Generic;
using System.Web.Http;

namespace Intel.MyDeals.Controllers.API
{
    [RoutePrefix("api/DataQuality")]
    public class DataQualityController : BaseApiController
    {

        private readonly IDataQualityLib _dataQualityLib;

        public DataQualityController(IDataQualityLib dataQualityLib)
        {
            this._dataQualityLib = dataQualityLib;
        }

        // GET: DataQuality
        public IList<DataQualityUsecase> GetDataQualityUseCases()
        {
            return SafeExecutor(() => _dataQualityLib.GetDataQualityUseCases()
               , $"Unable to get Data quality use cases"
           );
        }

        [AntiForgeryValidate]
        [Route("RunDQ")]
        [HttpPost]
        public bool RunDQ([FromBody] string useCase)
        {
            return SafeExecutor(() => _dataQualityLib.RunDQ(useCase)
              , $"Unable queue DQ {useCase}"
          );
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="startYearQuarter"></param>
        /// <param name="endYearQuarter"></param>
        /// <param name="in_prod_ids"></param>
        /// <returns></returns>
        [HttpPost]
        [AntiForgeryValidate]
        [Route("ExecuteCostGapFiller/{startYearQuarter}/{endYearQuarter}")]
        public bool ExecuteCostGapFiller(int startYearQuarter, int endYearQuarter, [FromBody] string productIds)
        {
            return SafeExecutor(() => _dataQualityLib.ExecuteCostGapFiller(startYearQuarter, endYearQuarter, productIds)
              , $"Unable run COST gap filler"
          );
        }
    }
}