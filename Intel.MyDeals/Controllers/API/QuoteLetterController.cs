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
using System.Web.Script.Serialization;

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
        [Route("GetDealQuoteLetter/{customerId}/{objectTypeId}/{dealId}")]
        public HttpResponseMessage GetDealQuoteLetter(string customerId, string objectTypeId, string dealId)
        {
            byte[] quoteLetterFinalBytes = null;
            var result = new HttpResponseMessage(HttpStatusCode.OK);
            var quoteLetterDealInfo = new QuoteLetterData(customerId, objectTypeId, dealId); 
            
            var quoteLetterFile = SafeExecutor(() => _quoteLetterLib.GetDealQuoteLetter(quoteLetterDealInfo, string.Empty, string.Empty)
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

        [HttpPost]
        [Route("GetDealQuoteLetterPreview")]
        public HttpResponseMessage GetDealQuoteLetterPreview(AdminQuoteLetter template)
        {
            //AdminQuoteLetter template = new JavaScriptSerializer().Deserialize<AdminQuoteLetter>(quoteLetterPreviewdata);

            byte[] quoteLetterFinalBytes = null;
            var result = new HttpResponseMessage(HttpStatusCode.OK);
            var quoteLetterDealInfo = new QuoteLetterData();
            var quoteLetterFile = SafeExecutor(() => _quoteLetterLib.GetDealQuoteLetter(quoteLetterDealInfo, template.HDR_INFO, template.BODY_INFO)
            //var quoteLetterFile = SafeExecutor(() => _quoteLetterLib.GetDealQuoteLetter("502124", string.Empty, string.Empty)
                , $"Unable to download preview quote letter"
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
        [Route("AdminGetTemplates")]
        public IEnumerable<AdminQuoteLetter> AdminGetTemplates()
        {
            return SafeExecutor(() => _quoteLetterLib
                .AdminGetTemplates()
                , $"AdminGetTemplates failed"
            );
        }

        [Authorize]
        [HttpPut]
        [Route("AdminSaveTemplate")]
        public AdminQuoteLetter AdminSaveTemplate(AdminQuoteLetter template)
        {
            return SafeExecutor(() => _quoteLetterLib
                .AdminSaveTemplate(template)
                , $"AdminSaveTemplate failed"
            );
        }
    }
}
