using Intel.MyDeals.Entities;
using System.Collections.Generic;

namespace Intel.MyDeals.IDataLibrary
{
    public interface IReportingDataLib
    {
        ReportMasterData GetReportDashboard();
        List<ReportMissingCostData> GetReportMissingCostData();
        List<ReportNewProductMissingCostData> GetNewProductReportMissingCostData();
        List<UCMReportData> GetUCMReportData();
        List<ReportProdCustomer> GetProdCustomerReport(string custName);
        List<ReportProductData> GetProductDataReport(string product);
    }
}
