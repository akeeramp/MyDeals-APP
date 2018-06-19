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
        public static MyDealsData GetByIDs(this OpDataElementType opDataElementType, IEnumerable<int> ids, List<OpDataElementType> includeTypes, OpDataCollectorFlattenedDictList flattenedDictList, SavePacket savePacket = null)
        {
            OpDataElementSetType opDataElementSetType = flattenedDictList == null
                ? OpDataElementSetType.Unknown
                : OpDataElementSetTypeConverter.FromString(flattenedDictList[opDataElementType][0][AttributeCodes.OBJ_SET_TYPE_CD]);

            MyDealsData myDealsData = GetByIDs(opDataElementType, ids, includeTypes, new List<int>())
                .FillInHolesFromAtrbTemplate(includeTypes, opDataElementSetType);

            if (flattenedDictList != null) myDealsData.Merge(flattenedDictList, savePacket);
            return myDealsData;
        }

        public static DcPath GetDcPath(this OpDataElementType opDataElementType, int dcId)
        {
            MyDealsData myDealsData = opDataElementType.GetByIDs(new List<int>
            {
                dcId
            },
            new List<OpDataElementType>
            {
                OpDataElementType.CNTRCT,
                OpDataElementType.PRC_ST,
                OpDataElementType.PRC_TBL,
                OpDataElementType.PRC_TBL_ROW,
                OpDataElementType.WIP_DEAL,
            },
            new List<int>
            {
                Attributes.OBJ_SET_TYPE_CD.ATRB_SID,
                Attributes.CUST_MBR_SID.ATRB_SID
            });

            DcPath dcPath = new DcPath();

            if (!myDealsData.ContainsKey(opDataElementType) ||
                !myDealsData[opDataElementType].AllDataCollectors.Any())
            {
                return dcPath;
            }

            dcPath.CustMbrSid = myDealsData[OpDataElementType.CNTRCT].AllDataElements
                .Where(s => s.AtrbCd == AttributeCodes.CUST_MBR_SID)
                .Select(s => int.Parse(s.AtrbValue.ToString())).FirstOrDefault();

            while (opDataElementType != OpDataElementType.ALL_OBJ_TYPE)
            {
                switch (opDataElementType)
                {
                    case OpDataElementType.CNTRCT:
                        dcPath.ContractId = dcId;
                        break;
                    case OpDataElementType.PRC_ST:
                        dcPath.PricingStrategyId = dcId;
                        if (dcPath.PricingTableId == 0)
                            dcPath.PricingTableId = myDealsData[OpDataElementType.PRC_TBL].AllDataElements.Where(s => s.DcParentID == dcId).Select(s => s.DcID).FirstOrDefault();
                        break;
                    case OpDataElementType.PRC_TBL:
                        dcPath.PricingTableId = dcId;
                        break;
                    case OpDataElementType.PRC_TBL_ROW:
                        dcPath.PricingTableRowId = dcId;
                        break;
                    case OpDataElementType.WIP_DEAL:
                        dcPath.WipDealId = dcId;
                        break;

                }
                dcId = myDealsData[opDataElementType].AllDataElements.Select(s => s.DcParentID).FirstOrDefault();

                opDataElementType = opDataElementType.GetParent();
            }

            return dcPath;
        }

        public static MyDealsData UpdateAtrbValue(this OpDataElementType opDataElementType, ContractToken contractToken, List<int> ids, MyDealsAttribute atrb, object value, bool forceToGoActive = false)
        {
            List<int> quotableIds = new List<int>();

            List<OpDataElementType> opDataElementTypes = new List<OpDataElementType>
            {
                opDataElementType
            };

            List<int> atrbs = new List<int>
            {
                atrb.ATRB_SID,
                Attributes.OBJ_SET_TYPE_CD.ATRB_SID,
                Attributes.REBATE_TYPE.ATRB_SID,
                Attributes.CUST_MBR_SID.ATRB_SID,
                Attributes.IN_REDEAL.ATRB_SID,
                Attributes.WF_STG_CD.ATRB_SID,
                Attributes.SYS_COMMENTS.ATRB_SID
            };

            DateTime start = DateTime.Now;
            MyDealsData myDealsData = opDataElementType.GetByIDs(ids, opDataElementTypes, atrbs);
            contractToken.AddMark("GetByIDs - PR_MYDL_GET_OBJS_BY_SIDS", TimeFlowMedia.DB, (DateTime.Now - start).TotalMilliseconds);

            List<OpDataCollector> allDcs = myDealsData[opDataElementType].AllDataCollectors.ToList();

            if (myDealsData.ContainsKey(OpDataElementType.WIP_DEAL))
            {
                List<string> quotableTypes = new List<string> { "ECAP", "KIT" };
                quotableIds = myDealsData[OpDataElementType.WIP_DEAL].AllDataElements
                    .Where(d => d.AtrbCd == AttributeCodes.OBJ_SET_TYPE_CD && quotableTypes.Contains(d.AtrbValue.ToString())).Select(d => d.DcID).ToList();
            }

            foreach (OpDataCollector dc in allDcs)
            {
                IOpDataElement de = dc.GetDataElement(atrb.ATRB_COL_NM);
                IOpDataElement deSource = dc.GetDataElement(AttributeCodes.CUST_MBR_SID) ?? dc.GetDataElement(AttributeCodes.OBJ_SET_TYPE_CD);
                string prevVal = string.Empty;

                if (de == null)
                {
                    dc.DataElements.Add(new OpDataElement
                    {
                        DcID = deSource.DcID,
                        DcType = deSource.DcType,
                        DcParentType = deSource.DcParentType,
                        DcParentID = deSource.DcParentID,
                        AtrbID = atrb.ATRB_SID,
                        AtrbValue = value,
                        AtrbCd = atrb.ATRB_COL_NM,
                        State = OpDataElementState.Modified
                    });
                }
                else
                {
                    prevVal = de.AtrbValue.ToString();
                    de.SetAtrbValue(value);
                    if (prevVal != value.ToString()) de.State = OpDataElementState.Modified;
                }

                if (atrb.ATRB_COL_NM == AttributeCodes.WF_STG_CD && prevVal != value.ToString())
                {
                    dc.AddTimelineComment($"Stage changed from {prevVal} to {value}");
                }
            }

            myDealsData[opDataElementType].BatchID = Guid.NewGuid();
            myDealsData[opDataElementType].GroupID = -101; // Whatever the real ID of this object is
            myDealsData[opDataElementType].AddSaveActions(null, ids);
            if (forceToGoActive)
            {
                myDealsData[opDataElementType].AddGoingActiveActions(ids);
                myDealsData[opDataElementType].AddQuoteLetterActions(quotableIds);
            }
            myDealsData.EnsureBatchIDs();

            return myDealsData.Save(contractToken);

        }

    }
}