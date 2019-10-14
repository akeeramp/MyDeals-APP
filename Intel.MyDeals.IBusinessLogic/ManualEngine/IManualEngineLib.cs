using Intel.MyDeals.Entities;
using System.Collections.Generic;

namespace Intel.MyDeals.IBusinessLogic
{
    public interface IManualEngineLib
    {
        List<ManualsNavItem> GetNavigationItems();
    }
}