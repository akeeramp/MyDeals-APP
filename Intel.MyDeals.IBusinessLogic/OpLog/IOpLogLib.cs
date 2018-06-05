using Intel.MyDeals.Entities;
using Intel.MyDeals.Entities.Logging;
using System.Collections.Generic;
using System;

namespace Intel.MyDeals.IBusinessLogic
{
    public interface IOpLogLib
    {
        List<logFileObject> GetOpaqueLog(DateTime startDate, DateTime endDate);

        string GetDetailsOpaqueLog(string fileName);

    }
}