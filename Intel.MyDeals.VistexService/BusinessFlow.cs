using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Intel.MyDeals.Entities;

namespace Intel.MyDeals.VistexService
{
    public partial class Program
    {
        private static async Task SendDFDataToSapPo(string runMode) //VTX_OBJ: CUSTOMERS, PRODUCTS
        {
            try
            {
                VistexCommonLogging.WriteToLog("Business Flow - SendDFDataToSapPo - Initiated");
                VistexDFDataResponseObject dataRecord = new VistexDFDataResponseObject();
                dataRecord = await DataAccessLayer.GetVistexDFStageData(runMode);
                VistexCommonLogging.WriteToLog("Batch ID: " + dataRecord.BatchId);
                VistexCommonLogging.WriteToLog("Batch Status: " + dataRecord.BatchStatus);
                if (dataRecord.BatchId == "0")
                {
                    Console.WriteLine("There is no outbound data to push..");
                    VistexCommonLogging.WriteToLog("Business Flow - SendDFDataToSapPo - Success");
                }
                else
                {
                    Console.WriteLine("Data pushed to SAP Completed, Status: " + dataRecord.BatchStatus + " - " + dataRecord.BatchMessage);
                    VistexCommonLogging.WriteToLog("Business Flow - SendDFDataToSapPo - Success");
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                //Additionmal Logging
                VistexCommonLogging.WriteToLog("Exception Received: " + "Thrown from: SendDFDataToSapPo - Vistex Business Flow Error: " + ex.Message + " |Innerexception: " + ex.InnerException + " | Stack Trace: " + ex.StackTrace);
                VistexCommonLogging.WriteToLog("Business Flow - SendDFDataToSapPo - Exception");
            }


        }

        private static async Task SendDealsDataToSapPo(string runMode) //VTX_OBJ: DEALS
        {
            try
            {
                VistexCommonLogging.WriteToLog("Business Flow - SendDealsDataToSapPo - Initiated");
                VistexDFDataResponseObject dataRecord = new VistexDFDataResponseObject();
                dataRecord = await DataAccessLayer.GetVistexDataOutBound("VISTEX_DEALS", runMode);
                VistexCommonLogging.WriteToLog("Batch ID: " + dataRecord.BatchId);
                VistexCommonLogging.WriteToLog("Batch Status: " + dataRecord.BatchStatus);
                if (dataRecord.BatchId == "0" || dataRecord.BatchId == null)
                {
                    Console.WriteLine("There is no outbound data to push..");
                    VistexCommonLogging.WriteToLog("Business Flow - SendDealsDataToSapPo - Success");
                }
                else if (dataRecord.BatchStatus.ToLower() == "processed")
                {
                    Console.WriteLine("Outbound data pushed to SAP successfully..");
                    VistexCommonLogging.WriteToLog("Business Flow - SendDealsDataToSapPo - Success");
                }
                VistexCommonLogging.WriteToLogObject(dataRecord.MessageLog);
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                //Additionmal Logging
                VistexCommonLogging.WriteToLog("Exception Received: " + "Thrown from: SendDealsDataToSapPo - Vistex Business Flow Error: " + ex.Message + " |Innerexception: " + ex.InnerException + " | Stack Trace: " + ex.StackTrace);
                VistexCommonLogging.WriteToLog("Business Flow - SendDealsDataToSapPo - Exception");
            }
        }

        private static async Task<bool> SendVerticalsToSapPo() //VTX_OBJ: VERTICALS
        {
            try
            {
                VistexCommonLogging.WriteToLog("Business Flow - SendVerticalsToSapPo - Initiated");
                VistexDFDataResponseObject records = new VistexDFDataResponseObject();
                while (true)
                {
                    records = await DataAccessLayer.GetVistexVerticalStageData("V");
                    VistexCommonLogging.WriteToLog("Batch ID: " + records.BatchId);
                    VistexCommonLogging.WriteToLog("Batch Status: " + records.BatchStatus);

                    if (records.BatchId == "0" || records.BatchStatus == "ERROR" || records.BatchId == null)
                    {
                        Console.WriteLine("There is no outbound data to push..");
                        VistexCommonLogging.WriteToLogObject(records.MessageLog);
                        VistexCommonLogging.WriteToLog("Business Flow - SendVerticalsToSapPo - Success");
                        break;
                    }
                    else
                    {
                        Console.WriteLine("Batch Id: " + records.BatchId + "  " + "Status: " + records.BatchStatus + " " + "Message: " + records.BatchMessage);
                        VistexCommonLogging.WriteToLogObject(records.MessageLog);
                    }
                }
            }
            catch(Exception ex)
            {
                Console.WriteLine(ex.Message);
                //Additionmal Logging
                VistexCommonLogging.WriteToLog("Exception Received: "+ "Thrown from: SendVerticalsToSapPo - Vistex Business Flow Error: "+ ex.Message + " |Innerexception: " + ex.InnerException+ " | Stack Trace: " +ex.StackTrace);
                VistexCommonLogging.WriteToLog("Business Flow - SendVerticalsToSapPo - Exception");
            }

            return true;
        }


    }
}
