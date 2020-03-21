using System;
using System.Collections.Generic;
using Intel.MyDeals.Entities;

namespace Intel.MyDeals.IDataLibrary
{
    public interface IVistexServiceDataLib
    {
        List<VistexDealOutBound> GetVistexDealOutBoundData(string packetType);

        List<VistexQueueObject> GetVistexDataOutBound(string packetType);

        void SetVistexDealOutBoundStage(Guid btchId, string rqstStatus);

        VistexDFDataLoadObject GetVistexDFStageData(string runMode);

        void UpdateVistexDFStageData(VistexDFDataResponseObject responseObj);

        Dictionary<string, string> PublishSapPo(string url, string jsonData);

        void OnException(Exception e);

        Dictionary<string, string> TestConnection(bool noSAP, string brokerURI, string userName, string queueName);


        // Test items below
        string GetMaxGroupId();

    }
}
