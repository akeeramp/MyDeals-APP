using Intel.MyDeals.Entities;
using System.Collections.Generic;

namespace Intel.MyDeals.IBusinessLogic
{
    public interface IQuoteLetterLib
    {
        List<AdminQuoteLetter> AdminGetTemplates();
        AdminQuoteLetter AdminSaveTemplate(AdminQuoteLetter template);

        QuoteLetterFile GetDealQuoteLetter(QuoteLetterData quoteLetterDealInfo, string headerInfo, string bodyInfo, bool forceRegenerateQuoteLetter, ContractToken contractToken);

    }
}