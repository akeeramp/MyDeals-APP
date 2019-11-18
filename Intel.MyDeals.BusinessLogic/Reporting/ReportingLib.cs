using System.Collections.Generic;
using Intel.MyDeals.Entities;
using Intel.MyDeals.IBusinessLogic;
using Intel.MyDeals.IDataLibrary;

namespace Intel.MyDeals.BusinessLogic
{
    public class ReportingLib : IReportingLib
    {
        private readonly IReportingDataLib _reportingCollectorLib;

        public ReportingLib(IReportingDataLib reportingCollectorLib)
        {
            _reportingCollectorLib = reportingCollectorLib;
        }

        /// <summary>
        /// Get Reporting Dashboard
        /// </summary>
        /// <returns>List of all Report Dashboard</returns>
        public ReportMasterData GetReportDashboard()
        {
            // TODO :Later need to decide caching will be apply or not
            return _reportingCollectorLib.GetReportDashboard();
        }        
    }
}
