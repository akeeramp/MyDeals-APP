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

    }
}
