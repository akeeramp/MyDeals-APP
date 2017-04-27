using System;
using System.Collections.Generic;
using Intel.MyDeals.DataLibrary;
using Intel.MyDeals.Entities;
using Intel.MyDeals.IBusinessLogic;
using Intel.MyDeals.IDataLibrary;

namespace Intel.MyDeals.BusinessLogic
{
    public class DashboardLib : IDashboardLib
    {
        private readonly IDashboardDataLib _dashboardDataLib;

        public DashboardLib(IDashboardDataLib dashboardDataLib)
        {
            _dashboardDataLib = dashboardDataLib;
        }

        public List<DashboardContractSummary> GetDashboardContractSummary(List<int> custIds, DateTime startDate, DateTime endDate)
        {
            return new DashboardDataLib().GetDashboardContractSummary(custIds, startDate, endDate);
        }
    }


}
