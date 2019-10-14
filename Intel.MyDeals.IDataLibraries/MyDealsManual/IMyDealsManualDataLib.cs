using Intel.MyDeals.Entities;
using System.Collections.Generic;

namespace Intel.MyDeals.IDataLibrary
{
    public interface IMyDealsManualDataLib
    {
        List<ManualsNavItem> GetNavigationItems();
    }
}