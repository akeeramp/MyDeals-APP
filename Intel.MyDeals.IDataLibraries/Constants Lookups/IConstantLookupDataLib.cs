using Intel.MyDeals.Entities;
using System.Collections.Generic;

namespace Intel.MyDeals.IDataLibrary
{
    public interface IConstantLookupDataLib
    {
        List<AdminConstant> GetAdminConstants();

        AdminConstant SetAdminConstants(CrudModes mode, AdminConstant adminValues);
    }
}
