using System.Collections.Generic;
using System.Linq;
using Intel.MyDeals.DataLibrary;
using Intel.MyDeals.Entities;

namespace Intel.MyDeals.BusinesssLogic
{
    public class GeosLib
    {
        #region Geo Dimension

        /// <summary>
        /// Get All Geo Dimensions
        /// </summary>
        /// <param name="getCachedResult">When set to false read
        /// request is coming from Admin screens by pass cached data
        /// </param>
        /// <returns>list of Geo Dimension data</returns>
        public List<GeoDimension> GetGeoDimensions(bool getCachedResult = true)
        {
            if (!getCachedResult)
            {
                new GeoDataLib().GetGeoDimensions();
            }
            return DataCollections.GetGeoData();
        }

        /// <summary>
        /// Get specific Geo Dimension
        /// </summary>
        /// <input>int sid of desired Geo Dimension</input>
        /// <returns>Geo Dimension data</returns>
        public GeoDimension GetGeoDimension(int sid)
        {
            return GetGeoDimensions().FirstOrDefault(c => c.GEO_MBR_SID == sid);
        }

        /// <summary>
        /// Get All Active Geo Dimensions
        /// </summary>
        /// <returns>list of Geo Dimension data flagged as active</returns>
        public List<GeoDimension> GetGeoDimensionsActive()
        {
            return GetGeoDimensions().Where(c => c.ACTV_IND == true).ToList();
        }

        /// <summary>
        /// Get All Geo Dimensions By Specified Geo Name
        /// </summary>
        /// <input>string name which is what will be filtered against (example: 'APAC')</input>
        /// <returns>list of Geo Dimension data of specified geo name</returns>
        public List<GeoDimension> GetGeoDimensionByGeoName(string name)
        {
            return GetGeoDimensions().Where(c => c.GEO_NM == name).ToList();
        }

        /// <summary>
        /// Get All Geo Dimensions By Specified Geo SID
        /// </summary>
        /// <input>int sid which is what will be filtered against (example: 7 = 'APAC')</input>
        /// <returns>list of Geo Dimension data of specified geo sid</returns>
        public List<GeoDimension> GetGeoDimensionByGeoSid(int sid)
        {
            return GetGeoDimensions().Where(c => c.GEO_NM_SID == sid).ToList();
        }

        /// <summary>
        /// Get All Geo Dimensions By Specified Region Name
        /// </summary>
        /// <input>string name which is what will be filtered against (example: 'Latin Amer')</input>
        /// <returns>list of Geo Dimension data of specified region name</returns>
        public List<GeoDimension> GetGeoDimensionByRegionName(string name)
        {
            return GetGeoDimensions().Where(c => c.RGN_NM == name).ToList();
        }

        /// <summary>
        /// Get All Geo Dimensions By Specified Region SID
        /// </summary>
        /// <input>int sid which is what will be filtered against (example: 9 = 'Latin Amer')</input>
        /// <returns>list of Geo Dimension data of specified region sid</returns>
        public List<GeoDimension> GetGeoDimensionByRegionSid(int sid)
        {
            return GetGeoDimensions().Where(c => c.RGN_NM_SID == sid).ToList();
        }

        /// <summary>
        /// Get All Geo Dimensions By Specified Country Name
        /// </summary>
        /// <input>string name which is what will be filtered against (example: 'Peru')</input>
        /// <returns>list of Geo Dimension data of specified country name</returns>
        public List<GeoDimension> GetGeoDimensionByCountryName(string name)
        {
            return GetGeoDimensions().Where(c => c.CTRY_NM == name).ToList();
        }

        /// <summary>
        /// Get All Geo Dimensions By Specified Geo SID
        /// </summary>
        /// <input>int sid which is what will be filtered against (example: 56 = 'Peru')</input>
        /// <returns>list of Geo Dimension data of specified country sid</returns>
        public List<GeoDimension> GetGeoDimensionByCountrySid(int sid)
        {
            return GetGeoDimensions().Where(c => c.CTRY_NM_SID == sid).ToList();
        }

        #endregion
    }
}
