using System;
using Intel.MyDeals.Entities;

namespace Intel.MyDeals.IBusinessLogic
{
    public interface IIntegrationLib
    {
        void IntegrationTest();
        Guid SaveSalesForceTenderData(TenderTransferRootObject jsonDataPacket);
    }
}
