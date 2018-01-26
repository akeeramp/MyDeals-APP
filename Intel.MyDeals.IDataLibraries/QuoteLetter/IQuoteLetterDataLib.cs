using Intel.MyDeals.Entities;
using System.Collections.Generic;

namespace Intel.MyDeals.IDataLibrary
{
    public interface IQuoteLetterDataLib
    {
        List<AdminQuoteLetter> AdminGetTemplates();
        AdminQuoteLetter AdminSaveTemplate(AdminQuoteLetter template);

        QuoteLetterFile GetDealQuoteLetter(QuoteLetterData quoteLetterDealInfo, string headerInfo, string bodyInfo);
    }
}
