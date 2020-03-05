using System;
using Intel.MyDeals.Entities;

namespace Intel.MyDeals.IBusinessLogic
{
    public interface IIntegrationLib
    {

        Guid SaveSalesForceTenderData(TenderTransferRootObject jsonDataPacket);

        Boolean SaveVistexResponseData(VistexResponseMsg jsonDataPacket);
    }
}
