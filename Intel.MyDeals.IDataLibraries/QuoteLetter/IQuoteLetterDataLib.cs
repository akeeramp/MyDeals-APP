using Intel.MyDeals.Entities;
using System.Collections.Generic;

namespace Intel.MyDeals.IDataLibrary
{
    public interface IQuoteLetterDataLib
    {
        List<QuoteLetter> GetQuoteLetterTemplates();
    }
}
