using System;
using System.Data;
using Intel.Opaque.Tools;
using System.Collections;
using System.Collections.Generic;
using Intel.MyDeals.Entities;

namespace Intel.MyDeals.IDataLibrary
{
    public interface IVistexServiceDataLib
    {
        List<VistexDealOutBound> GetVistexDealOutBoundData(string packetType);

        void SetVistexDealOutBoundStage(Guid btchId, string rqstStatus);

        Dictionary<string, string> PublishSapPo(string url, string jsonData);

        void OnException(Exception e);

        Dictionary<string, string> TestConnection(bool noSAP, string brokerURI, string userName, string queueName);


        // Test items below
        string GetMaxGroupId();

    }
}
