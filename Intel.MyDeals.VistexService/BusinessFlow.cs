using System;
using System.Collections.Generic;
using System.IO;
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
                VistexCommonLogging.WriteToLogObject(dataRecord.MessageLog);
                VistexCommonLogging.SendMail(runMode == "P" ? "Product" : "Customer", dataRecord, null);
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                //Additionmal Logging
                VistexCommonLogging.WriteToLog("Exception Received: " + "Thrown from: SendDFDataToSapPo - Vistex Business Flow Error: " + ex.Message + " |Innerexception: " + ex.InnerException + " | Stack Trace: " + ex.StackTrace);
                VistexCommonLogging.WriteToLog("Business Flow - SendDFDataToSapPo - Exception");
                VistexCommonLogging.HandleException(ex, true, runMode == "P" ? "Product" : "Customer");
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
                VistexCommonLogging.SendMail(runMode == "D" ? "Deals" : "Deal-Error-Resend", dataRecord, null);
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                //Additionmal Logging
                VistexCommonLogging.WriteToLog("Exception Received: " + "Thrown from: SendDealsDataToSapPo - Vistex Business Flow Error: " + ex.Message + " |Innerexception: " + ex.InnerException + " | Stack Trace: " + ex.StackTrace);
                VistexCommonLogging.WriteToLog("Business Flow - SendDealsDataToSapPo - Exception");
                VistexCommonLogging.HandleException(ex, true, "Deals");
            }
        }

        private static async Task<bool> SendVerticalsToSapPo() //VTX_OBJ: VERTICALS
        {
            try
            {
                List<string> lstStatus = new List<string>();
                VistexCommonLogging.WriteToLog("Business Flow - SendVerticalsToSapPo - Initiated");
                VistexDFDataResponseObject records = new VistexDFDataResponseObject();
                while (true)
                {
                    records = await DataAccessLayer.GetVistexVerticalStageData("V");
                    VistexCommonLogging.WriteToLog("Batch ID: " + records.BatchId);
                    VistexCommonLogging.WriteToLog("Batch Status: " + records.BatchStatus);

                    if (records.BatchId == "0" || records.BatchId == "-1" || records.BatchStatus == "ERROR" || records.BatchId == null)
                    {
                        Console.WriteLine("There is no outbound data to push..");
                        VistexCommonLogging.WriteToLogObject(records.MessageLog);
                        VistexCommonLogging.WriteToLog("Business Flow - SendVerticalsToSapPo - Success");
                        VistexCommonLogging.SendMail("Product-Vertical", records, lstStatus);//
                        break;
                    }
                    else
                    {
                        Console.WriteLine("Batch Id: " + records.BatchId + "  " + "Status: " + records.BatchStatus + " " + "Message: " + records.BatchMessage);
                        lstStatus.Add("Batch ID: " + records.BatchId);
                        lstStatus.Add("Batch Status: " + records.BatchStatus + Environment.NewLine);
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
                VistexCommonLogging.HandleException(ex, true, "Product-Vertical");
            }

            return true;
        }

        /// Tender Return ///
        private static async Task SendTenderReturn(string runMode) //VTX_OBJ: DEALS
        {
            try
            {
                VistexCommonLogging.WriteToLog("Business Flow - SendTenderReturn - Initiated");
                string dataRecord = "";
                dataRecord = await DataAccessLayer.TenderResponseObject();                
                if (dataRecord == null || dataRecord.Length == 0 )
                {
                    Console.WriteLine("There is no data to push..");
                    VistexCommonLogging.WriteToLog("Business Flow - SendTenderReturn - Success");
                }
                else if (dataRecord.Length > 0)
                {
                    Console.WriteLine("Tender Return was successfully..");
                    VistexCommonLogging.WriteToLog("Business Flow - SendTenderReturn - Success");
                }
                File.AppendAllText(Intel.MyDeals.VistexService.Program._logFile, dataRecord);                
                VistexCommonLogging.SendMailTender("Tender Return", dataRecord, null);
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                //Additionmal Logging
                VistexCommonLogging.WriteToLog("Exception Received: " + "Thrown from: SendTenderReturn - Tender Return Flow Error: " + ex.Message + " |Innerexception: " + ex.InnerException + " | Stack Trace: " + ex.StackTrace);
                VistexCommonLogging.WriteToLog("Business Flow - SendTenderReturn - Exception");
                VistexCommonLogging.HandleException(ex, true, "Deals");
            }
        }
    }
}
