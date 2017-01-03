using Intel.MyDeals.Entities;
using System.Collections.Generic;

namespace Intel.MyDeals.IBusinessLogic
{
    public interface IGeosLib
    {
        GeoDimension GetGeoDimension(int sid);

        List<GeoDimension> GetGeoDimensionByCountryName(string name);

        List<GeoDimension> GetGeoDimensionByCountrySid(int sid);

        List<GeoDimension> GetGeoDimensionByGeoName(string name);

        List<GeoDimension> GetGeoDimensionByGeoSid(int sid);

        List<GeoDimension> GetGeoDimensionByRegionName(string name);

        List<GeoDimension> GetGeoDimensionByRegionSid(int sid);

        List<GeoDimension> GetGeoDimensions(bool getCachedResult = true);

        List<GeoDimension> GetGeoDimensionsActive();
    }
}