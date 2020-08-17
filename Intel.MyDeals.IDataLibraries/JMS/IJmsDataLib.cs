using System;
using System.Data;
using Intel.Opaque.Tools;
using System.Collections;
using System.Collections.Generic;
using Intel.MyDeals.Entities;

namespace Intel.MyDeals.IDataLibrary
{
    public interface IJmsDataLib
    {
        void CheckPreviousRunNotComplete(char jobType);

        DataTable CreatePricingRecords(char jobType);

        string GetPricingRecordsXml(int jmsId, int groupId);

        string GetMaxGroupId();

        string SendDataToJmsQueue(string pricingRecords);

        void UpdateRecordStagesAndNotifyErrors(int errorFlag, char jobType, string csvFilePath, string errorDetail);

        void InsertUploadErrorTable(Pair<int, int>[] pair);

        void DeleteUploadErrorTable();

        void InsertExceptionData(DateTime exceptionDatetime, string exceptionType, string exceptionMessage, string exceptionSource, string exceptionStackTrace);

        bool PublishBackToSfTenders(string data);

        void Publish(string brokerURI, string userName, string queueName, List<string> data);

        void OnException(Exception e);
        
        Dictionary<string, string> TestConnection(bool noSAP, string brokerURI, string userName, string queueName);

        // Integration Items
        Guid SaveTendersDataToStage(string dataType, List<int> dealsList, string jsonDataPacket);

        List<TenderTransferObject> FetchTendersStagedData(string dataType, Guid specificRecord);

        void UpdateTendersStage(Guid btchId, string rqstStatus);

        List<TendersSFIDCheck> FetchDealsFromSfiDs(string salesForceIdCntrct, string salesForceIdDeal);

        int FetchCustFromCimId(string custCimId);

        ProductEpmObject FetchProdFromProcessorEpmMap(int epmId);

    }
}