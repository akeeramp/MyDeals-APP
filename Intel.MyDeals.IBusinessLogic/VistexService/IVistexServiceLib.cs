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

        VistexDFDataResponseObject GetVistexDataOutBound(string packetType);

        void SetVistexDealOutBoundStage(Guid btchId, string rqstStatus);

        VistexDFDataLoadObject GetVistexDFStageData(string runMode);

        void UpdateVistexDFStageData(VistexDFDataResponseObject responseObj);

        Dictionary<string, string> PublishSapPo(string url, string jsonData);

        VistexDFDataResponseObject GetVistexStageData(string runMode);

        Boolean SaveVistexResponseData(VistexResponseMsg jsonDataPacket);

    }
}