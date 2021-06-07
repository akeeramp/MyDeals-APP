using Intel.MyDeals.Entities;
using System;
using System.Collections.Generic;

namespace Intel.MyDeals.IBusinessLogic
{
    public interface IDsaEngineLib
    {
        List<VistexLogsInfo> GetVistexLogs(VistexMode vistexMode, DateTime StartDate, DateTime EndDate);
        List<VistexAttributes> GetVistexAttrCollection(int id);
        List<string> GetVistexStatuses();
        Guid UpdateVistexStatus(Guid batchId, VistexStage vistexStage, int rqstId, int? DealId, string strErrorMessage);
        List<VistexLogsInfo> AddVistexData(List<int> lstDealIds);
        List<VistexDealOutBound> GetVistexDealOutBoundData();
        List<ProductCategory> GetProductVerticalBody(int id);
        List<VistexProductVerticalOutBound> GetVistexProductVeticalsOutBoundData();
        List<RequestDetails> GetRequestTypeList();
    }
}
