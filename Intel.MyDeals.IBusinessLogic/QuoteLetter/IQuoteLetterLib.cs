using Intel.MyDeals.Entities;
using System.Collections.Generic;

namespace Intel.MyDeals.IBusinessLogic
{
    public interface IQuoteLetterLib
    {
        List<QuoteLetter> GetQuoteLetterTemplates();
    }
}