using System;
using System.Collections.Generic;
using Intel.MyDeals.Entities;

namespace Intel.MyDeals.IDataLibrary
{
    public interface IProductCostTestDataLib
    {
        List<ProductCostTestRules> GetProductCostTestRules();

        List<ProductTypeMappings> GetPCTProductTypeMappings();

        List<ProductAttributeValues> GetProductAttributeValues(int verticalId);

        List<ProductCostTestRules> SetPCTRules(CrudModes mode, ProductCostTestRules pctRules);

        List<PCTLegalException> GetLegalExceptions();
        

        PCTLegalException SetPCTlegalException(CrudModes update, PCTLegalException input);

        List<VersionHistPCTExceptions> GetVersionDetailsPCTExceptions(int PCT_LGL_EXCPT_SID,int excludeCurrVer);

        List<LegalExceptionExport> DownloadLegalException(string data, bool excludeCurrVer, bool dealList);
    }
}