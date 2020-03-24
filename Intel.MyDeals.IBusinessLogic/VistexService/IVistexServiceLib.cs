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
        VistexDFDataResponseObject GetVistexDealOutBoundData(string packetType, string runMode);

        List<VistexDFDataResponseObject> GetVistexDataOutBound(string packetType);

        void SetVistexDealOutBoundStage(Guid btchId, string rqstStatus);

        VistexDFDataLoadObject GetVistexDFStageData(string runMode);

        void UpdateVistexDFStageData(VistexDFDataResponseObject responseObj);

        Dictionary<string, string> PublishSapPo(string url, string jsonData);

        Dictionary<string, string> TestConnection(bool noSAP, string brokerURI, string userName, string queueName);

        VistexDFDataResponseObject GetVistexStageData(string runMode);

        string GetMaxGroupId();

    }
}