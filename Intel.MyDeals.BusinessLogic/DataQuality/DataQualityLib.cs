using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Intel.MyDeals.Entities;
using Intel.MyDeals.IBusinessLogic;
using Intel.MyDeals.IDataLibrary;

namespace Intel.MyDeals.BusinessLogic
{
    public class DataQualityLib : IDataQualityLib
    {
        private readonly IDataQualityDataLib _dataQualityDataLib;

        public DataQualityLib(IDataQualityDataLib dataQualityDataLib)
        {
            _dataQualityDataLib = dataQualityDataLib;
        }

        public IList<DataQualityUsecase> GetDataQualityUseCases()
        {
            return _dataQualityDataLib.GetDataQualityUseCases();
        }

        public bool RunDQ(string useCase)
        {
            return _dataQualityDataLib.RunDQ(useCase);
        }
    }
}
