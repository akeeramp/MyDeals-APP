using System;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using Intel.Opaque;

namespace Intel.MyDeals.Helpers
{
    public static class ErrorHelper
    {
        private static readonly Version ErrorVersion = new Version(1, 0);
        private static readonly HttpStatusCode DEFAULT_STATUS_CODE = HttpStatusCode.InternalServerError;

        public static HttpResponseException ToHttpReponseException(Exception ex)
        {
            return new HttpResponseException(new HttpResponseMessage
            {
                Content = new StringContent(ex.ToString()),
                StatusCode = DEFAULT_STATUS_CODE,
                Version = ErrorVersion,
                ReasonPhrase = ex.Message.Replace("\r", "").Replace("\n", "")
            });
        }

        public static HttpResponseException ToHttpReponseException(OpMsgQueue ex)
        {
            return new HttpResponseException(new HttpResponseMessage
            {
                Content = new StringContent(ex.ToHTML("")), // TODO: Format as needed....
                StatusCode = DEFAULT_STATUS_CODE,
                Version = ErrorVersion,
                ReasonPhrase = ex.ToString().Replace("\r", "").Replace("\n", "")
            });
        }
    }
}