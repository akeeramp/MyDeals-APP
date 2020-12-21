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
        VistexDFDataResponseObject GetVistexDealOutBoundData(string packetType, string runMode, VistexDFDataResponseObject responseObj);

        VistexDFDataResponseObject GetVistexDataOutBound(string packetType, VistexDFDataResponseObject responseObj);

        void SetVistexDealOutBoundStageV(Guid btchId, string rqstStatus, string BatchMessage);

        void SetVistexDealOutBoundStageD(Guid btchId, string rqstStatus, List<VistexQueueObject> resdataRecords);

        VistexDFDataLoadObject GetVistexDFStageData(string runMode);

        void UpdateVistexDFStageData(VistexDFDataResponseObject responseObj);

        VistexDFDataResponseObject GetVistexStageData(string runMode, VistexDFDataResponseObject responseObj);

        Boolean SaveVistexResponseData(VistexResponseMsg jsonDataPacket);

        Dictionary<string, string> PublishSapPo(string url, string jsonData);

    }
}