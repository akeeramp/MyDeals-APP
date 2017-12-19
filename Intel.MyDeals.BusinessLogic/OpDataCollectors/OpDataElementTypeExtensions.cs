using System;
using System.Collections.Generic;
using System.Linq;
using Intel.MyDeals.DataLibrary;
using Intel.MyDeals.Entities;
using Intel.Opaque.Data;

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
        public static MyDealsData GetByIDs(this OpDataElementType opDataElementType, IEnumerable<int> ids, List<OpDataElementType> includeTypes, OpDataCollectorFlattenedDictList flattenedDictList, bool needToCheckForDelete = true)
        {
            OpDataElementSetType opDataElementSetType = flattenedDictList == null
                ? OpDataElementSetType.Unknown
                : OpDataElementSetTypeConverter.FromString(flattenedDictList[opDataElementType][0][AttributeCodes.OBJ_SET_TYPE_CD]);

            MyDealsData myDealsData = GetByIDs(opDataElementType, ids, includeTypes, new List<int>())
                .FillInHolesFromAtrbTemplate(includeTypes, opDataElementSetType);

            if (flattenedDictList != null) myDealsData.Merge(flattenedDictList, needToCheckForDelete);
            return myDealsData;
        }

        public static MyDealsData UpdateAtrbValue(this OpDataElementType opDataElementType, ContractToken contractToken, List<int> ids, MyDealsAttribute atrb, object value, bool forceToGoActive = false)
        {
            List<OpDataElementType> opDataElementTypes = new List<OpDataElementType>
            {
                opDataElementType
            };

            List<int> atrbs = new List<int>
            {
                atrb.ATRB_SID,
                Attributes.OBJ_SET_TYPE_CD.ATRB_SID,
                Attributes.CUST_MBR_SID.ATRB_SID
            };

            MyDealsData myDealsData = opDataElementType.GetByIDs(ids, opDataElementTypes, atrbs);

            List<OpDataCollector> allDcs = myDealsData[opDataElementType].AllDataCollectors.ToList();

            foreach (OpDataCollector dc in allDcs)
            {
                IOpDataElement de = dc.GetDataElement(atrb.ATRB_COL_NM);
                IOpDataElement deCust = dc.GetDataElement(AttributeCodes.CUST_MBR_SID);

                if (de == null)
                {
                    dc.DataElements.Add(new OpDataElement
                    {
                        DcID = deCust.DcID,
                        DcType = deCust.DcType,
                        DcParentType = deCust.DcParentType,
                        DcParentID = deCust.DcParentID,
                        AtrbID = atrb.ATRB_SID,
                        AtrbValue = value,
                        AtrbCd = atrb.ATRB_COL_NM,
                        State = OpDataElementState.Modified
                    });
                }
                else
                {
                    de.SetAtrbValue(value);
                    de.State = OpDataElementState.Modified;
                }
            }

            myDealsData[opDataElementType].BatchID = Guid.NewGuid();
            myDealsData[opDataElementType].GroupID = -101; // Whatever the real ID of this object is
            myDealsData[opDataElementType].AddSaveActions();
            if (forceToGoActive) myDealsData[opDataElementType].AddGoingActiveActions(ids);
            myDealsData.EnsureBatchIDs();

            return myDealsData.Save(contractToken);

        }

    }
}