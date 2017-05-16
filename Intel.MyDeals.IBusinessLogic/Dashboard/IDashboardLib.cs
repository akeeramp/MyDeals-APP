using System;
using System.Collections.Generic;
using Intel.MyDeals.Entities;

namespace Intel.MyDeals.IBusinessLogic
{
    public interface IDashboardLib
    {
        List<DashboardContractSummary> GetDashboardContractSummary(List<int> custIds, DateTime startDate, DateTime endDate);
        OpDataCollectorFlattenedDictList GetWipSummary(int ptId);
    }
}