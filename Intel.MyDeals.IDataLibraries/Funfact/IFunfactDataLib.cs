using Intel.MyDeals.Entities;
using System.Collections.Generic;

namespace Intel.MyDeals.IDataLibrary
{
    public interface IFunfactDataLib
    {
        List<Funfact> GetFunfactItems();

        List<Funfact> SetFunfacts(CrudModes mode, Funfact data);
    }
}
