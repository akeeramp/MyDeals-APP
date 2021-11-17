using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Configuration;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;

namespace Intel.MyDeals.UCDService
{
    public class UCDDataAccessLayer
    {
        private static string APIbaseUrl = GetAppSetting("MyDealsService");
        private static string UnifiedController = "/api/PrimeCustomers/";


        private static HttpClient MyDealsClient
        {
            get
            {
                HttpClientHandler handler = new HttpClientHandler()
                {
                    Credentials = CredentialCache.DefaultNetworkCredentials
                };
                HttpClient client = new HttpClient(handler);
                client.BaseAddress = new Uri(APIbaseUrl);
                client.Timeout = TimeSpan.FromMinutes(6);
                client.DefaultRequestHeaders.Accept.Clear();
                client.DefaultRequestHeaders.Accept.Add(
                    new MediaTypeWithQualityHeaderValue("application/json"));
                return client;
            }
        }

        public static string GetAppSetting(string appSettingName)
        {
            if (String.IsNullOrEmpty(ConfigurationManager.AppSettings[appSettingName]))
            {
                throw new Exception(appSettingName + " is missing!");
            }
            return ConfigurationManager.AppSettings[appSettingName];
        }


        public static async Task<String> PushUcdAMQResponse(string res)
        {
            string ret = "";
            //string input = "{\"accountId\":\"0012i00000c0NnoAAE\",\"accountName\":\"BMW\",\"primaryAddress\":" +
            //    "{\"countryName\":\"United States\"},\"masteredSimplifiedAccountName\":\"BMW\",\"masteredBusinessPhysicalAddress\":{\"countryCode\":\"USA\"," +
            //    "\"countryName\":\"United States\"},\"complianceWatchList\":[{\"code\":\"DPL\",\"name\":\"Denied Parties List\"},{\"code\":\"EC\",\"name\":\"Embargoed Country\"}]," +
            //    "\"customerAggregationType\":{\"code\":\"UNFD_CTRY_CUST\",\"name\":\"Unified Country Customer\"},\"customerProcessEngagement\":[{\"code\":\"DIR_PRC_EXCPT\",\"name\":" +
            //    "\"Direct Price Exception\"}],\"businessPartyIdentifier\":\"1000044339\"," +
            //    "\"parentAccount\":{\"accountId\":\"0012D00000OmHaeQAD\",\"accountName\":\"BMW\",\"businessPartyIdentifier\":\"1000006558\"}}";
            try
            {
                HttpContent hp = new StringContent(res, Encoding.UTF8, "application/json");
                var UnifiedAMCResponsePath = UnifiedController + "SaveAMCResponceObject";
                HttpResponseMessage response = await MyDealsClient.PostAsync(UnifiedAMCResponsePath,hp);
            }
            catch(Exception ex)
            {

            }


            return ret;
                 
        }
    }


}
