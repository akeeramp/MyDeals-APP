using Intel.MyDeals.DataLibrary;
using Intel.MyDeals.Entities;
using Intel.MyDeals.IBusinessLogic;
using Intel.MyDeals.IDataLibrary;
using System.Collections.Generic;

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

        public List<AdminQuoteLetter> AdminGetTemplates()
        {
            return _quoteLetterDataLib.AdminGetTemplates();
        }

        public AdminQuoteLetter AdminSaveTemplate(AdminQuoteLetter template)
        {
            return _quoteLetterDataLib.AdminSaveTemplate(template);
        }


        /// <summary>
        /// Get quote letter file object
        /// </summary>
        public QuoteLetterFile GetDealQuoteLetter(QuoteLetterData quoteLetterDealData, string headerInfo, string bodyInfo, bool forceRegenerateQuoteLetter = false)
        {
            return _quoteLetterDataLib.GetDealQuoteLetter(quoteLetterDealData, headerInfo, bodyInfo, forceRegenerateQuoteLetter);
        }
        

    }

}