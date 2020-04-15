using System;
using System.Collections.Generic;
using System.Net;
using Intel.MyDeals.Entities;

namespace Intel.MyDeals.IDataLibrary
{
    public interface IVistexServiceDataLib
    {
        List<VistexQueueObject> GetVistexDealOutBoundData(string packetType, string runMode);

        List<VistexQueueObject> GetVistexDataOutBound(string packetType);

        void SetVistexDealOutBoundStage(Guid btchId, string rqstStatus);

        VistexDFDataLoadObject GetVistexDFStageData(string runMode);

        void UpdateVistexDFStageData(VistexDFDataResponseObject responseObj);

        Dictionary<string, string> PublishSapPo(string url, string jsonData);

        bool SaveVistexResponseData(Guid batchId, Dictionary<int, string> dealsMessages);

        void OnException(Exception e);

        CredentialCache GetVistexCredentials(string url);

        Dictionary<string, string> PublishToSapPoDCPV(string jsonData, string mode);
    }
}
