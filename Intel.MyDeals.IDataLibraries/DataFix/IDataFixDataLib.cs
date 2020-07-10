using Intel.MyDeals.Entities;
using System.Collections.Generic;

namespace Intel.MyDeals.IDataLibrary
{
    public interface IDataFixDataLib
    {
        List<DropDowns> GetDataFixActions();

        List<DataFix> GetDataFixes();

        DataFix UpdateDataFix(DataFix data);
    }
}
