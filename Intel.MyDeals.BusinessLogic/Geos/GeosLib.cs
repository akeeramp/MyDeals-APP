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
        /// <returns>list of Geo Dimension data</returns>
        public List<GeoDimension> GetGeoDimensions()
        {
            return DataCollections.GetGeoDimensions();
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

        //TODO: once the final version of Geo Dimensions is crafted and more columns are added, we will be able to add more specific filters.
        ///// <summary>
        ///// Get All Active Geo Dimensions
        ///// </summary>
        ///// <returns>list of Geo Dimension data flagged as active</returns>
        //public List<GeoDimension> GetGeoDimensionsActive()
        //{
        //    return GetGeoDimensions().Where(c => c.ACTV_IND == true).ToList();
        //}

        /// <summary>
        /// Get All Geo Dimensions By Specified Geo Name
        /// </summary>
        /// <input>string name which is what will be filtered against (example: 'APAC')</input>
        /// <returns>list of Geo Dimension data of specified geo name</returns>
        public List<GeoDimension> GetGeoDimensionByGeoName(string name)
        {
            return GetGeoDimensions().Where(c => c.GEO_NM == name).ToList();
        }

        #endregion
    }
}
