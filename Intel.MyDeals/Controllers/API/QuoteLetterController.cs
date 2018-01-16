using Intel.MyDeals.IBusinessLogic;
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

    }
}