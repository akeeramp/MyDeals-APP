using Intel.MyDeals.Entities;
using System;
using System.Collections.Generic;

namespace Intel.MyDeals.IBusinessLogic
{
    public interface IDsaEngineLib
    {
        List<VistexLogsInfo> GetVistexLogs(VistexMode vistexMode, DateTime StartDate, DateTime EndDate,string DealId);
        VistexLogDetails GetVistexLogs(VistexMode vistexMode, DateTime StartDate, DateTime EndDate, string DealId, string filter, string sort, int take, int skip);
        List<string> GetVistexFilterData(VistexMode vistexMode, DateTime StartDate, DateTime EndDate, string DealId, string filterName);
        List<VistexAttributes> GetVistexAttrCollection(int id);
        List<string> GetVistexStatuses();
        Guid UpdateVistexStatus(Guid batchId, VistexStage vistexStage, int? DealId, string strErrorMessage, int RQST_SID);
        Guid UpdateArchived(Guid batchId, VistexStage vistexStage, int? DealId, string strErrorMessage, int RQST_SID);
        List<VistexLogsInfo> AddVistexData(List<int> lstDealIds);
        List<VistexDealOutBound> GetVistexDealOutBoundData();
        List<ProductCategory> GetProductVerticalBody(int id);
        List<VistexProductVerticalOutBound> GetVistexProductVeticalsOutBoundData();
        List<RequestDetails> GetRequestTypeList();
    }
}
