using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Intel.MyDeals.Entities;

namespace Intel.MyDeals.IBusinessLogic
{
    public interface IReportingLib
    {
        ReportMasterData GetReportDashboard();

        List<ReportMissingCostData> GetReportMissingCostData();

        List<ReportNewProductMissingCostData> GetNewProductReportMissingCostData();

        List<UCMReportData> GetUCMReportData();
        List<ReportProdCustomer> GetProdCustomerReport(string custName);
        List<ReportProductData> GetProductDataReport(string product);

    }
}
