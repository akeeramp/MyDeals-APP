using Intel.MyDeals.Entities;
using Microsoft.Win32.SafeHandles;
using System;
using System.Configuration;
using System.Net.Http;
using System.Runtime.InteropServices;

namespace Vistex
{
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

        public ResponseType VistexCustomer()
        {
            ResponseType responseType = ResponseType.None;
            using (var client = new HttpClient())
            {
                client.BaseAddress = new Uri(ConfigurationManager.AppSettings["ServiceURI"]);

                //HTTP GET
                try
                {
                    var responseTask = client.GetAsync("GetVistexStatuses");
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
    }
}
