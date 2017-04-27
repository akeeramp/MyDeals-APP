using System.Collections.Generic;
using Intel.MyDeals.DataLibrary;
using Intel.MyDeals.Entities;

namespace Intel.MyDeals.BusinessLogic
{
    public static class OpDataElementTypeExtensions
    {

        /// <summary>
        /// Get an object tree from its user displayed ID
        /// </summary>
        /// <param name="opDataElementType">Top level of object tree that you expect to get.</param>
        /// <param name="ids">List of IDs to pull.</param>
        /// <returns></returns>
        public static MyDealsData GetByIDs(this OpDataElementType opDataElementType, IEnumerable<int> ids)
        {
            return GetByIDs(opDataElementType, ids, new List<OpDataElementType> { opDataElementType }, new List<int>());
        }


        /// <summary>
        /// Get an object tree from its user displayed ID
        /// </summary>
        /// <param name="opDataElementType">Top level of object tree that you expect to get.</param>
        /// <param name="ids">List of IDs to pull.</param>
        /// <param name="includeTypes">Which object types to include in the request.</param>
        /// <param name="flattenedDictList"></param>
        /// <returns></returns>
        public static MyDealsData GetByIDs(this OpDataElementType opDataElementType, IEnumerable<int> ids, List<OpDataElementType> includeTypes, OpDataCollectorFlattenedDictList flattenedDictList = null)
        {
            OpDataElementSetType opDataElementSetType = flattenedDictList == null
                ? OpDataElementSetType.Unknown
                : OpDataElementSetTypeConverter.FromString(flattenedDictList[opDataElementType][0][AttributeCodes.OBJ_SET_TYPE_CD]);

            return flattenedDictList == null 
                ? GetByIDs(opDataElementType, ids, includeTypes, new List<int>())
                    .FillInHolesFromAtrbTemplate(opDataElementSetType) 
                : GetByIDs(opDataElementType, ids, includeTypes, new List<int>())
                    .FillInHolesFromAtrbTemplate(opDataElementSetType)
                    .Merge(flattenedDictList);
        }


        /// <summary>
        /// Get an object tree from its user displayed ID
        /// </summary>
        /// <param name="opDataElementType">Top level of object tree that you expect to get.</param>
        /// <param name="ids">List of IDs to pull.</param>
        /// <param name="includeTypes">Which object types to include in the request.</param>
        /// <param name="atrbs">Attributes that need to be brought in as well.</param>
        /// <returns></returns>
        public static MyDealsData GetByIDs(this OpDataElementType opDataElementType, IEnumerable<int> ids, List<OpDataElementType> includeTypes, IEnumerable<int> atrbs)
        {
            return new OpDataCollectorDataLib().GetByIDs(opDataElementType, ids, includeTypes, atrbs);
        }

    }
}