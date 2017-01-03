using Intel.MyDeals.Entities;
using System.Collections.Generic;

namespace Intel.MyDeals.IBusinessLogic
{
    public interface IConstantsLookupsLib
    {
        List<AdminConstant> GetAdminConstants();

        AdminConstant CreateAdminConstant(AdminConstant data);

        AdminConstant UpdateAdminConstant(AdminConstant data);

        void DeleteAdminConstant(AdminConstant data);

        List<ToolConstants> GetToolConstants();

        ToolConstants GetToolConstant(string constant);

        string GetToolConstantValue(string constant);

    }
}
