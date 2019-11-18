using Intel.MyDeals.Entities;
using System.Collections.Generic;

namespace Intel.MyDeals.IBusinessLogic
{
    public interface IManualEngineLib
    {
        List<RefManualsNavItem> GetNavigationItems(string refType);
        string GetManualPageData(string pageLink);
    }
}