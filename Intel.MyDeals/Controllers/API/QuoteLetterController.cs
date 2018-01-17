using Intel.MyDeals.Entities;
using Intel.MyDeals.IBusinessLogic;
using System.Collections.Generic;
using System.Web.Http;

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