using Intel.MyDeals.Entities;
using System.Collections.Generic;


namespace Intel.MyDeals.IDataLibrary
{
    public interface IEnvironmentsDataLib
    {
        List<AdminEnvironments> GetEnvDetails();

        AdminEnvironments SetEnvDetails(CrudModes mode, AdminEnvironments adminValues);
        
        List<AdminServerDetails> GetServerDetails();

        AdminServerDetails SetServerDetails(CrudModes mode, AdminServerDetails adminValues);

    }
}
