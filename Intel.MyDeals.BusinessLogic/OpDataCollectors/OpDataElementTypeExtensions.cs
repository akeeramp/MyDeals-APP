using System.Collections.Generic;
using System.Linq;
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
        /// <returns></returns>
        public static MyDealsData GetByIDs(this OpDataElementType opDataElementType, IEnumerable<int> ids, List<OpDataElementType> includeTypes)
        {
            return GetByIDs(opDataElementType, ids, includeTypes, new List<int>());
        }

        /// <summary>
        /// Get an object tree from its user displayed ID
        /// </summary>
        /// <param name="opDataElementType">Top level of object tree that you expect to get.</param>
        /// <param name="ids">List of IDs to pull.</param>
        /// <param name="includeTypes">Which object types to include in the request.</param>
        /// <param name="secondaryIds"></param>
        /// <param name="includeSecondaryTypes"></param>
        /// <param name="atrbs">Attributes that need to be brought in as well.</param>
        /// <returns></returns>
        public static MyDealsData GetByIDs(this OpDataElementType opDataElementType, IEnumerable<int> ids, List<OpDataElementType> includeTypes, IEnumerable<int> atrbs)
        {
            IEnumerable<int> atrbsArray = atrbs as int[] ?? atrbs.ToArray();

            MyDealsData myDealsData = new OpDataCollectorDataLib().GetByIDs(opDataElementType, ids, includeTypes, atrbsArray);

            // need to check for scondary ids to merge 2 levels of objects together (better performance than loading the entire binary tree structure)
            //IEnumerable<int> secondaryIdsArray = secondaryIds as int[] ?? secondaryIds.ToArray();
            //if (!secondaryIdsArray.Any() || !includeSecondaryTypes.Any()) return myDealsData;

            //MyDealsData secondaryMyDealsData = new OpDataCollectorDataLib().GetByIDs(opDataElementType, secondaryIdsArray, includeSecondaryTypes, atrbsArray);
            //foreach (KeyValuePair<OpDataElementType, OpDataPacket<OpDataElementType>> kvp in secondaryMyDealsData)
            //{
            //    myDealsData[kvp.Key] = kvp.Value;
            //}

            return myDealsData;
        }

        /// <summary>
        /// Get an object tree from its user displayed ID
        /// </summary>
        /// <param name="opDataElementType">Top level of object tree that you expect to get.</param>
        /// <param name="ids">List of IDs to pull.</param>
        /// <param name="includeTypes">Which object types to include in the request.</param>
        /// <param name="secondaryIds"></param>
        /// <param name="includeSecondaryTypes"></param>
        /// <param name="flattenedDictList"></param>
        /// <returns></returns>
        public static MyDealsData GetByIDs(this OpDataElementType opDataElementType, IEnumerable<int> ids, List<OpDataElementType> includeTypes, OpDataCollectorFlattenedDictList flattenedDictList)
        {
            OpDataElementSetType opDataElementSetType = flattenedDictList == null
                ? OpDataElementSetType.Unknown
                : OpDataElementSetTypeConverter.FromString(flattenedDictList[opDataElementType][0][AttributeCodes.OBJ_SET_TYPE_CD]);

            MyDealsData myDealsData = GetByIDs(opDataElementType, ids, includeTypes, new List<int>())
                .FillInHolesFromAtrbTemplate(opDataElementType, opDataElementSetType);

            if (flattenedDictList != null) myDealsData.Merge(flattenedDictList);
            return myDealsData;
        }

    }
}