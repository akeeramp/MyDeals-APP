using System;
using System.Data;
using Intel.Opaque.Tools;
using System.Collections;
using System.Collections.Generic;
using Intel.MyDeals.Entities;

namespace Intel.MyDeals.IBusinessLogic
{
    public interface IVistexServiceLib
    {
        List<VistexDealOutBound> GetVistexDealOutBoundData(string packetType);

        List<VistexQueueObject> GetVistexDataOutBound(string packetType);

        void SetVistexDealOutBoundStage(Guid btchId, string rqstStatus);

        VistexDFDataLoadObject GetVistexDFStageData(string runMode);

        void UpdateVistexDFStageData(VistexDFDataResponseObject responseObj);

        Dictionary<string, string> PublishSapPo(string url, string jsonData);

        Dictionary<string, string> TestConnection(bool noSAP, string brokerURI, string userName, string queueName);

        string GetMaxGroupId();

    }
}