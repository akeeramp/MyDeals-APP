using System;
using System.Collections.Generic;
using Intel.MyDeals.Entities;

namespace Intel.MyDeals.IBusinessLogic
{
    public interface IDashboardLib
    {
        List<DashboardContractSummary> GetDashboardContractSummary(List<int> custIds, DateTime startDate, DateTime endDate, List<int> vertIds = null);
        OpDataCollectorFlattenedDictList GetWipSummary(int ptId);
    }
}