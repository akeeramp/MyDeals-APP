using Intel.MyDeals.Entities;
using Microsoft.Win32.SafeHandles;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.IO;
using System.Net;
using System.Net.Http;
using System.Runtime.InteropServices;
using System.Text;
using Intel.Opaque.Utilities.Server;

namespace Intel.MyDeals.VistexService
{
    // TODO This file might go away as well - review it
    public class VistexHttpService : IDisposable
    {
        // Flag: Has Dispose already been called?
        bool disposed = false;
        // Instantiate a SafeHandle instance.
        SafeHandle handle = new SafeFileHandle(IntPtr.Zero, true);

        // Public implementation of Dispose pattern callable by consumers.
        public void Dispose()
        {
            Dispose(true);
            GC.SuppressFinalize(this);
        }

        // Protected implementation of Dispose pattern.
        protected virtual void Dispose(bool disposing)
        {
            if (disposed)
                return;

            if (disposing)
            {
                handle.Dispose();
                // Free any other managed objects here.
                //
            }

            disposed = true;
        }

        public static string GetResposnseMessage(ResponseType responseType)
        {
            switch (responseType)
            {
                case ResponseType.UnableToReachServer:
                    {
                        return "Service is unavailable!";
                    }
                case ResponseType.ConnectionClosed:
                    {
                        return "Unable to read data from the transport connection: An existing connection was forcibly closed by the remote host.!";
                    }
                case ResponseType.None:
                    {
                        return "No response!";
                    }
                case ResponseType.Unauthorized:
                    {
                        return "Able to reach server, but do not have an access!";
                    }
                case ResponseType.Success:
                    {
                        return "Request is success!";
                    }
                case ResponseType.Failed:
                    {
                        return "Request is failed!";
                    }
                case ResponseType.Unknown:
                    {
                        return "Unknown error occured!";
                    }
                default:
                    {
                        return "Status unavailable!";
                    }
            }
        }



        private static CredentialCache GetCredentials(string url)
        {
            ServicePointManager.SecurityProtocol = SecurityProtocolType.Ssl3;
            CredentialCache credentialCache = new CredentialCache();
            credentialCache.Add(new System.Uri(url), "Basic", new NetworkCredential(ConfigurationManager.AppSettings["vistexUI"],
                StringEncrypter.StringDecrypt(ConfigurationManager.AppSettings["vistexPWD"] != string.Empty ? ConfigurationManager.AppSettings["vistexPWD"] : "", "Vistex_Password")));
            return credentialCache;
        }


        public static Dictionary<string, string> TestVistexConnection()
        {
            string url = @"https://sappodev.intel.com:8215/RESTAdapter/MyDeals";

            // Create a request using a URL that can receive a post.   
            WebRequest request = WebRequest.Create(url);
            request.Credentials = GetCredentials(url);
            // Set the Method property of the request to POST.  
            request.Method = "POST";

            // Create POST data and convert it to a byte array.  
            //string json = "{\"Mydeals\": {	\"Cust_no\": \"9666\",	\"Deal_id\": \"54556\",	\"END_DT\": \"5556\",	\"GEO_COMBINED\": \"556\",	\"MRKT_SEG\": \"5556\",	\"OBJ_SET_TYPE_CD\": \"859\",	\"PAYOUT_BASED_ON\": \"88\",	\"PRODUCT_FILTER\": \"8559\",	\"START_DT\": \"899\",	\"VOLUME\": \"899\"	}}";
            string json = "{" +
                          "\"Mydeals\": {" +
                          "\"Cust_no\": \"9666\"," +
                          "\"Deal_id\": \"54556\"," +
                          "\"END_DT\": \"5556\"," +
                          "\"GEO_COMBINED\": \"556\"," +
                          "\"MRKT_SEG\": \"5556\"," +
                          "\"OBJ_SET_TYPE_CD\": \"859\"," +
                          "\"PAYOUT_BASED_ON\": \"88\"," +
                          "\"PRODUCT_FILTER\": \"8559\"," +
                          "\"START_DT\": \"899\"," +
                          "\"VOLUME\": \"899\"" +
                          "}" +
                          "}";

            byte[] byteArray = Encoding.UTF8.GetBytes(json);

            // Set the ContentType property of the WebRequest.  
            request.ContentType = "application/x-www-form-urlencoded";
            // Set the ContentLength property of the WebRequest.  
            request.ContentLength = byteArray.Length;

            // Get the request stream, write data, then close the stream
            Stream dataStream = request.GetRequestStream();
            dataStream.Write(byteArray, 0, byteArray.Length);
            dataStream.Close();

            Dictionary<string, string> responseObjectDictionary = new Dictionary<string, string>();

            try
            {
                WebResponse response = request.GetResponse(); // Get the response.  
                responseObjectDictionary["Status"] = ((HttpWebResponse)response).StatusDescription;

                // Get the stream containing content returned by the server.  
                // The using block ensures the stream is automatically closed.
                using (dataStream = response.GetResponseStream())
                {
                    // Open the stream using a StreamReader for easy access.  
                    StreamReader reader = new StreamReader(dataStream);
                    // Read the content.  
                    string responseFromServer = reader.ReadToEnd();
                    // Display the content.  
                    responseObjectDictionary["Data"] = responseFromServer;
                }

                response.Close();
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
                responseObjectDictionary["Status"] = e.Message;
                //throw;
            }

            return responseObjectDictionary;
        }

        ResponseType GetResponse(string strMethodName)
        {
            ResponseType responseType = ResponseType.None;
            using (var client = new HttpClient())
            {
                client.BaseAddress = new Uri(ConfigurationManager.AppSettings["ServiceURI"]);

                //HTTP GET
                try
                {
                    var responseTask = client.GetAsync(strMethodName);
                    responseTask.Wait();

                    HttpResponseMessage result = responseTask.Result;
                    switch (result.ReasonPhrase)
                    {
                        case "Unauthorized":
                            {
                                responseType = ResponseType.Unauthorized;
                            }
                            break;
                    }
                    if (responseType == ResponseType.None)
                        responseType = result.IsSuccessStatusCode ? ResponseType.Success : ResponseType.Failed;
                }
                catch (AggregateException ex)
                {
                    switch(ex.InnerExceptions[0].InnerException.Message)
                    {
                        case "Unable to connect to the remote server":
                            {
                                responseType = ResponseType.UnableToReachServer;
                            }
                            break;
                        case "The underlying connection was closed: An unexpected error occurred on a send.":
                            {
                                responseType = ResponseType.ConnectionClosed;
                            }
                            break;
                    }
                }
                catch (Exception ex)
                {
                    responseType = ResponseType.Unknown;
                }
            }
            return responseType;
        }

        public ResponseType GetVistexOutBoundData()
        {
            return GetResponse("GetVistexOutBoundData");
        }
    }
}
