using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Intel.MyDeals.Entities;

namespace Intel.MyDeals.IBusinessLogic
{
    public interface IDataQualityLib
    {
        IList<DataQualityUsecase> GetDataQualityUseCases();
        bool RunDQ(string useCase);
    }
}
