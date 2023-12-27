using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Intel.MyDeals.IQRService
{
    public partial class BusinessFlow
    {

        public static async Task SendTenderReturn()
        {
            try
            {
                IQRCommonLogging.WriteToLog("Business Flow - SendTenderReturn - Initiated");
                string dataRecord = "";
                dataRecord = await DataAccessLayer.SalesForceTenderResponseObject();
                if (dataRecord == null || dataRecord.Length == 0)
                {
                    Console.WriteLine("There is no data to push..");
                    IQRCommonLogging.WriteToLog("Business Flow - SendTenderReturn - Success");
                }
                else if (dataRecord.Length > 0)
                {
                    Console.WriteLine("Tender Return was successfully..");
                    IQRCommonLogging.WriteToLog("Business Flow - SendTenderReturn - Success");
                }
                File.AppendAllText(Intel.MyDeals.IQRService.Program._logFile, dataRecord);
                //IQRCommonLogging.SendMailTender("Tender Return", dataRecord, null);
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                //Additional Logging
                IQRCommonLogging.WriteToLog("Exception Received: " + "Thrown from: SendTenderReturn - Tender Return Flow Error: " + ex.Message + " |Innerexception: " + ex.InnerException + " | Stack Trace: " + ex.StackTrace);
                IQRCommonLogging.WriteToLog("Business Flow - SendTenderReturn - Exception");
                IQRCommonLogging.HandleException(ex, true, "Deals");
            }
        }
    }
}
