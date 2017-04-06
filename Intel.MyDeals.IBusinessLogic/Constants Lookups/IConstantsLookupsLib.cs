using Intel.MyDeals.Entities;
using System.Collections.Generic;
using System.Linq;

namespace Intel.MyDeals.IBusinessLogic
{
    public interface IConstantsLookupsLib
    {
        List<AdminConstant> GetAdminConstants(bool getCachedResult = true);

        AdminConstant CreateAdminConstant(AdminConstant data);

        AdminConstant UpdateAdminConstant(AdminConstant data);

        void DeleteAdminConstant(AdminConstant data);

        string GetToolConstantValue(string constant);

        List<LookupItem> GetLookups();

        IQueryable<LookupItem> GetLookups(string cd);

        AdminConstant GetConstantsByName(string constant);
    }
}