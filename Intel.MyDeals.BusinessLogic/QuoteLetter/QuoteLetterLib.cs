using Intel.MyDeals.DataLibrary;
using Intel.MyDeals.IBusinessLogic;
using Intel.MyDeals.IDataLibrary;

namespace Intel.MyDeals.BusinessLogic
{
    public class QuoteLetterLib : IQuoteLetterLib
    {
        private readonly IQuoteLetterDataLib _quoteLetterDataLib;

        /// <summary>
        /// TODO: This parameterless constructor is left as a reminder,
        /// once we fix our unit tests to use Moq remove this constructor, also remove direct reference to "Intel.MyDeals.DataLibrary"
        /// </summary>
        public QuoteLetterLib()
        {
            _quoteLetterDataLib = new QuoteLetterDataLib();
        }

        public QuoteLetterLib(IQuoteLetterDataLib quoteLetterDataLib)
        {
            _quoteLetterDataLib = quoteLetterDataLib;
        }

    }

}