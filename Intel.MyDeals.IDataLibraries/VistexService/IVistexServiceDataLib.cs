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

        void SetVistexDealOutBoundStageV(Guid btchId, string rqstStatus, string BatchMessage);

        void SetVistexDealOutBoundStageD(Guid btchId, string rqstStatus, List<VistexQueueObject> dataRecords);

        VistexDFDataLoadObject GetVistexDFStageData(string runMode);

        void UpdateVistexDFStageData(VistexDFDataResponseObject responseObj);

        Dictionary<string, string> PublishSapPo(string url, string jsonData);

        bool SaveVistexResponseData(Guid batchId, Dictionary<int, string> dealsMessages);

        void OnException(Exception e);

        CredentialCache GetVistexCredentials(string url);

        Dictionary<string, string> PublishToSapPoDCPV(string jsonData, string mode, VistexDFDataResponseObject responseObject);
    }
}
