using Intel.MyDeals.Entities;
using System.Collections.Generic;

namespace Intel.MyDeals.IDataLibrary
{
    public interface IQuoteLetterDataLib
    {
        List<QuoteLetter_Tory> GetQuoteLetterTemplates();
        QuoteLetterFile GetDealQuoteLetter(string dealId);
    }
}
