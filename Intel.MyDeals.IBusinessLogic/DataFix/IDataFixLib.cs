using Intel.MyDeals.Entities;
using System.Collections.Generic;

namespace Intel.MyDeals.IBusinessLogic
{
    public interface IDataFixLib
    {
        List<DropDowns> GetDataFixActions();

        List<IncdnDataFix> GetDataFixes();

        IncdnActnUpd UpdateDataFix(DataFix data, bool isExecute);
    }
}
