using Intel.MyDeals.Entities;
using System.Collections.Generic;

namespace Intel.MyDeals.IBusinessLogic
{
    public interface IDataFixLib
    {
        List<DropDowns> GetDataFixActions();

        List<DataFix> GetDataFixes();

        DataFix UpdateDataFix(DataFix data, bool isExecute);
    }
}
