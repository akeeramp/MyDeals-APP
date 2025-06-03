using Intel.MyDeals.Entities;
using System.Collections.Generic;

namespace Intel.MyDeals.IDataLibrary
{
    public interface IGeoDataLib
    {
        List<GeoDimension> GetGeoDimensions();
        GeoDetails GetGeoDimensions(string filter, string sort, int take, int skip);
    }
}