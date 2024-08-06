using Intel.MyDeals.IDataLibrary;
using Intel.Opaque;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.IO;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;
using static Intel.MyDeals.DataLibrary.JmsDataLib;

namespace Intel.MyDeals.DataLibrary
{
    public class MuleServiceDataLib : IMuleServiceDataLib
    {
        private string muleKey;
        private string muleSecret;
        private string muleTokenUrl;

        public MuleServiceDataLib()
        {
            muleKey = ConfigurationManager.AppSettings["muleKey"];
            muleSecret = ConfigurationManager.AppSettings["muleSecret"];
            muleTokenUrl = ConfigurationManager.AppSettings["muleTokenUrl"];
        }

        public string GenerateMuletoken()
        {
            ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
            string consumerKey = muleKey;
            string consumerSecret = muleSecret;
            string apiGeeTokenUrl = muleTokenUrl;
            string accessToken = "";

            byte[] byte1 = Encoding.ASCII.GetBytes("grant_type=client_credentials&client_id=" + consumerKey + "&client_secret=" + consumerSecret);

            HttpWebRequest bearerReq = WebRequest.Create(apiGeeTokenUrl) as HttpWebRequest;
            bearerReq.Accept = "application/json";
            bearerReq.Method = "POST";
            bearerReq.ContentType = "application/x-www-form-urlencoded";
            bearerReq.ContentLength = byte1.Length;
            bearerReq.KeepAlive = false;
            ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
            bearerReq.Proxy = new WebProxy("proxy-chain.intel.com", 911);
            try
            {
                Stream newStream = bearerReq.GetRequestStream();
                newStream.Write(byte1, 0, byte1.Length);
                WebResponse bearerResp = bearerReq.GetResponse();

                using (var reader = new StreamReader(bearerResp.GetResponseStream(), Encoding.UTF8))
                {
                    var response = reader.ReadToEnd();
                    Bearer bearer = JsonConvert.DeserializeObject<Bearer>(response);
                    accessToken = bearer.access_token;
                }
            }
            catch (Exception ex)
            {
                OpLogPerf.Log("ApiGee Token Generation Failure: " + ex);
            }

            return accessToken;
        }
    }
}

