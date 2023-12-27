using System;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Net;

namespace Intel.MyDeals.IQRService
{
    public class DataAccessLayer
    {
        private static string iqrAPIbaseUrl = GetAppSetting("MyDealsService");
        private static string tenderController = "/api/Integration/";

        private static HttpClient MyDealsClient
        {
            get
            {
                HttpClientHandler handler = new HttpClientHandler()
                {
                    Credentials = CredentialCache.DefaultNetworkCredentials
                };
                HttpClient client = new HttpClient(handler);
                client.BaseAddress = new Uri(iqrAPIbaseUrl);
                client.Timeout = TimeSpan.FromMinutes(6);
                client.DefaultRequestHeaders.Accept.Clear();
                client.DefaultRequestHeaders.Accept.Add(
                    new MediaTypeWithQualityHeaderValue("application/json"));
                return client;
            }
        }

        public static async Task<string> SalesForceTenderResponseObject()
        {
            IQRCommonLogging.WriteToLog("Data Access Layer - SalesForceTenderDataResponseObject - Initiated");
            string retRecord = "";
            var xmlRecords = string.Empty;
            try
            {
                var fetchIqrDFData = tenderController + "ExecuteBatchWiseSalesForceTenderData/";
                HttpResponseMessage response = await MyDealsClient.GetAsync(fetchIqrDFData);
                if (response.IsSuccessStatusCode)
                {
                    xmlRecords = await response.Content.ReadAsStringAsync();
                    IQRCommonLogging.WriteToLog("Data Access Layer - ReturnSalesForceTenderResults - Success");
                    retRecord = String.Format("{0:HH:mm:ss.fff} @ {1}", DateTime.Now, "Tender Request was Successful." + "\n" + response.ToString());
                }
                else
                {
                    retRecord = String.Format("{0:HH:mm:ss.fff} @ {1}", DateTime.Now, "Something went wrong in Tender Request" + response.ToString());
                }
            }
            catch (Exception ex)
            {
                IQRCommonLogging.WriteToLog("Exception Received: " + "Thrown from: ReturnSalesForceTenderResults - Tender Business Flow Error: " + ex.Message + " |Innerexception: " + ex.InnerException + " | Stack Trace: " + ex.StackTrace);
                IQRCommonLogging.WriteToLog("Data Access Layer - VistexTenderResponseObject - Completed");
            }

            return retRecord;
        }

        public static string GetAppSetting(string appSettingName)
        {
            if (String.IsNullOrEmpty(ConfigurationManager.AppSettings[appSettingName]))
            {
                throw new Exception(appSettingName + " is missing!");
            }
            return ConfigurationManager.AppSettings[appSettingName];
        }
    }
}
