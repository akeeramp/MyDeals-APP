using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Intel.MyDeals.Entities;

namespace Intel.MyDeals.IBusinessLogic
{
    public interface IFunfactLib
    {

        List<Funfact> GetFunfactItems();

        List<Funfact> GetActiveFunfacts();

        List<Funfact> SetFunfacts(CrudModes mode, Funfact data);
        
    }
}
