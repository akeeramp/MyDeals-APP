using Intel.MyDeals.Entities;
using System.Collections.Generic;

namespace Intel.MyDeals.IDataLibrary
{
    public interface IMyDealsManualDataLib
    {
        List<RefManualsNavItem> GetNavigationItems(string refType);
        string GetManualPageData(string pageLink);
    }
}