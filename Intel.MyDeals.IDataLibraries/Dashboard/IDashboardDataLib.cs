using System;
using System.Collections.Generic;
using Intel.MyDeals.Entities;

namespace Intel.MyDeals.IDataLibrary
{
    public interface IDashboardDataLib
    {
        List<DashboardContractSummary> GetDashboardContractSummary(List<int> custIds, DateTime startDate, DateTime endDate, string filter, string grpFltr, string sort, int take, int skip, List<int> vertIds = null);

        List<string> GetDashboardContractSummaryFltr(List<int> custIds, DateTime startDate, DateTime endDate, string filter, string grpFltr, string sort, int take, int skip, List<int> vertIds = null);


        List<DashboardContractSummaryCount> GetDashboardContractSummaryCount(List<int> custIds, DateTime startDate, DateTime endDate, string filter, string grpFltr, string sort, int take, int skip, List<int> vertIds = null);

    }
}