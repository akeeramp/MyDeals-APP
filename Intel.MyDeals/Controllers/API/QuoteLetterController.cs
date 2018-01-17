using System.Collections.Generic;
using System.Linq;
using System.Web.Http;
using Intel.MyDeals.App;
using Intel.MyDeals.Entities;
using Intel.MyDeals.IBusinessLogic;
using System.Net.Http;
using System.Net;
using System.IO;
using System.Net.Http.Headers;
using System;

namespace Intel.MyDeals.Controllers.API
{
    //TODO: Once security is implemented, we want to add it to these api controllers to ensure only the correct users are allowed to get Product information?
    [RoutePrefix("api/QuoteLetter")]
    public class QuoteLetterController : BaseApiController
    {
        private readonly IQuoteLetterLib _quoteLetterLib;

        public QuoteLetterController(IQuoteLetterLib quoteLetterLib)
        {
            this._quoteLetterLib = quoteLetterLib;
        }

        [HttpGet]
        [Route("GetDealQuoteLetter/{dealId}")]
        public HttpResponseMessage GetDealQuoteLetter(string dealId)
        {
            byte[] quoteLetterFinalBytes = null;
            var result = new HttpResponseMessage(HttpStatusCode.OK);

            var quoteLetterFile = SafeExecutor(() => _quoteLetterLib.GetDealQuoteLetter(dealId)
                , $"Unable to download quote letter for {dealId}"
            );
            quoteLetterFinalBytes = quoteLetterFile.Content;
            
            if (quoteLetterFinalBytes != null)
            {
                Stream stream = new MemoryStream(quoteLetterFinalBytes);
                result.Content = new StreamContent(stream);
            }

            string fName = quoteLetterFile.Name;

            if (!string.IsNullOrEmpty(fName))
            {
                string[] swapString = { "(", ")", "-", "&", "'", "*", "^", " " };
                foreach (string s in swapString)
                {
                    fName = fName.Replace(s, "_");
                }
                result.Content.Headers.ContentType = new MediaTypeHeaderValue("application/octet-stream");

                result.Content.Headers.Add("Content-Disposition", String.Format("attachment;filename={0}", fName));
            }
            else
                result = Request.CreateResponse(HttpStatusCode.NotFound);

            return result;
        }

        [Authorize]
        [HttpGet]
        [Route("GetQuoteLetterTemplates")]
        public IEnumerable<QuoteLetter_Tory> GetQuoteLetterTemplates()
        {
            return SafeExecutor(() => _quoteLetterLib
                .GetQuoteLetterTemplates()
                , $"Unable to get Quote Letter Templates"
            );
        }
    }
}
