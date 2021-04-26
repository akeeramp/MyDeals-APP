using System;
using Intel.MyDeals.Entities;

namespace Intel.MyDeals.IBusinessLogic
{
    public interface IIntegrationLib
    {

        void TestAsyncProcess(Guid myGuid);

        Guid SaveSalesForceTenderData(TenderTransferRootObject jsonDataPacket);

        string ExecuteSalesForceTenderData(Guid workId);
        
        string ReturnSalesForceTenderResults();

        string MuleSoftReturnTenderStatus(string xid, string retStatus);

        string MuleSoftReturnTenderStatusByGuid(Guid btchId, string retStatus, int dealId);

        string ReTriggerMuleSoftByXid(string xid);
    }
}
