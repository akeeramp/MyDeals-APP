using System;
using System.Data;
using Intel.Opaque.Tools;
using System.Collections;
using System.Collections.Generic;

namespace Intel.MyDeals.IBusinessLogic
{
    public interface IJmsLib
    {
        void CheckPreviousRunNotComplete(char jobType);

        DataTable CreatePricingRecords(char jobType);

        string GetPricingRecordsXml(int jmsId, int groupId);

        string GetMaxGroupId();

        string SendPricingRecordsToQueue(string pricingRecords);

        void DeleteUploadErrorTable();

        void InsertUploadErrorTable(Pair<int, int>[] pair);

        void UpdateRecordStagesAndNotifyErrors(int errorFlag, char jobType, string csvFilePath, string errorDetail);

        PairList<string, int> GetJMSQSchedule();

        void RetryJMSQSchedule(int sched_id);

        void InsertExceptionData(
        DateTime exceptionDatetime,
        string exceptionType,
        string exceptionMessage,
        string exceptionSource,
        string exceptionStackTrace);

        Dictionary<string, string> TestConnection(bool noSAP, string brokerURI,
                      string userName,
                      //string password,
                      string queueName);

        void Publish(string brokerURI,
                       string userName,
                       //string password,
                       string queueName,
                       List<string> data);
    }
}