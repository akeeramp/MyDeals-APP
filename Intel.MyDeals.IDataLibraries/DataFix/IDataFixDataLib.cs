using Intel.MyDeals.Entities;
using System;
using System.Collections.Generic;

namespace Intel.MyDeals.IDataLibrary
{
    public interface IDataFixDataLib
    {
        List<DropDownsList> GetDataFixActions();

        List<IncdnDataFix> GetDataFixes();

        IncdnActnUpd UpdateDataFix(DataFix data, bool isExecute);
        int IQRRollback(DataFix data);
    }
}
