using Intel.MyDeals.Entities;
using System;
using System.Collections.Generic;

namespace Intel.MyDeals.IBusinessLogic
{
    public interface IDsaEngineLib
    {
        List<VistexLogs> GetVistexLogs(VistexMode vistexMode);
        List<VistexAttributes> GetVistexAttrCollection(int id);
        List<string> GetVistexStatuses();
        Guid UpdateVistexStatus(Guid batchId, VistexStage vistexStage, int? DealId, string strErrorMessage);
        List<VistexLogs> AddVistexData(List<int> lstDealIds);
        List<VistexDealOutBound> GetVistexDealOutBoundData();
        List<ProductCategory> GetProductVerticalBody(int id);
        List<VistexProductVerticalOutBound> GetVistexProductVeticalsOutBoundData();
    }
}
