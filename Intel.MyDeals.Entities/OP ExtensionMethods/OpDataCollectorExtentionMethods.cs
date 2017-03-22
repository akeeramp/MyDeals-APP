using System;
using System.Collections.Generic;
using System.Linq;
using Intel.Opaque.Data;

namespace Intel.MyDeals.Entities
{
    public static class OpDataCollectorExtentionMethods
    {
       
        ///// <summary>
        ///// Add a simple data element.
        ///// Uses default service client to get attribute master data.
        ///// </summary>
        ///// <param name="wb"></param>
        ///// <param name="atrb_cd">ATBR_CD to add.</param>
        ///// <param name="atrbVal">Value.</param>
        ///// <returns>Newly added data element.</returns>
        //public static OpDataElement AddDataElement(this OpDataCollector wb, string atrb_cd, object atrbVal)
        //{
        //    return AddDataElement(wb, atrb_cd, atrbVal, DataCollections.GetAttributeData());
        //}

        /// <summary>
        /// Add a simple data element.
        /// </summary>
        /// <param name="dc"></param>
        /// <param name="atrbCd">ATBR_CD to add.</param>
        /// <param name="atrbVal">Value.</param>
        /// <param name="sourceData">Master data list to lookup extended attribute details.</param>
        /// <returns>Newly added data element.</returns>
        public static OpDataElement AddDataElement(this OpDataCollector dc, string atrbCd, object atrbVal, AttributeCollection sourceData)
        {
            var atrb = sourceData.Get(atrbCd);

            var de = new OpDataElement
            {
                DcID = dc.DcID,
                AtrbID = atrb.ATRB_SID,
                AtrbCd = atrb.ATRB_COL_NM,
                DataType = atrb.DOT_NET_DATA_TYPE,
                AtrbValue = atrbVal
            };
            dc.DataElements.Add(de);

            return de;
        }

        /// <summary>
        /// Get first matching attribute
        /// </summary>
        public static OpDataElementAtrb GetAtrb(this OpDataCollector dc, string atrbCd)
        {
            return dc?.DataElements?.FirstOrDefault(de => de.AtrbCd == atrbCd);
        }

        /// <summary>
        /// Get first matching attribute
        /// </summary>
        public static OpDataElementAtrb GetAtrb(this OpDataCollector dc, int atrbId)
        {
            return dc?.DataElements?.FirstOrDefault(de => de.AtrbID == atrbId);
        }

        /// <summary>
        /// Get first matching attribute value
        /// </summary>
        public static object GetAtrbValue(this OpDataCollector dc, string atrbCd)
        {
            var el = dc?.DataElements?.FirstOrDefault(de => de.AtrbCd == atrbCd);
            return el?.AtrbValue;
        }

        /// <summary>
        /// Get first matching attribute value
        /// </summary>
        public static object GetAtrbValue(this OpDataCollector dc, int atrbId)
        {
            var el = dc?.DataElements?.FirstOrDefault(de => de.AtrbID == atrbId);
            return el?.AtrbValue;
        }

        /// <summary>
        /// Get all matching attributes
        /// </summary>
        public static IEnumerable<OpDataElementAtrb> GetAtrbs(this OpDataCollector dc, string atrbCd)
        {
            if (dc?.DataElements == null) { return new OpDataElementAtrb[]{}; }
            return dc.DataElements.Where(de => de.AtrbCd == atrbCd);
        }

        /// <summary>
        /// Get all matching attributes
        /// </summary>
        public static IEnumerable<OpDataElementAtrb> GetAtrbs(this OpDataCollector dc, int atrbId)
        {
            if (dc?.DataElements == null) { return new OpDataElementAtrb[] { }; }
            return dc.DataElements.Where(de => de.AtrbID == atrbId);
        }



        /// <summary>
        /// Ensure each data collector has the DcAltId set when known, and has an OpDataElement for DEAL_SID.
        /// </summary>
        public static void EnsureDcType(this OpDataCollector dc, AttributeCollection sourceData, OpDataElementType opType)
        {
            // TODO May not need this if decision is to store dealtype (objsettype) instead of the SID
            if (dc == null || !string.IsNullOrEmpty(dc.DcType)) { return; }

            string dealType = opType != OpDataElementType.DEAL && opType != OpDataElementType.WIP_DEAL ? opType.ToString() : null;

            if (dealType == null)
            {
                string deDealTypeSid = dc.GetAtrbValue("OBJ_TYPE").ToString();

                if (string.IsNullOrEmpty(deDealTypeSid))
                {
                    dc.DcType = string.Empty;
                    return;
                }

                dealType = sourceData.MasterDataLookups
                    .Where(m => m.AtrbCd == AttributeCodes.OBJ_SET_TYPE_SID && m.AtrbItemId.ToString() == deDealTypeSid)
                    .Select(m => m.AtrbItemValue).FirstOrDefault();
            }

            // TODO maybe sync names with database names
            if (dealType == OpDataElementType.CNTRCT.ToString()) dealType = "CONTRACT";
            if (dealType == OpDataElementType.PRC_ST.ToString()) dealType = "PRICING STRAT";
            if (dealType == OpDataElementType.PRC_TBL.ToString()) dealType = "PRICING TABLE";
            if (dealType == OpDataElementType.PRC_TBL_ROW.ToString()) dealType = "PRICING TABLE ROW";

            dc.DcType = dealType ?? string.Empty;

            IOpDataElement deDealTypeCd = (IOpDataElement) dc.GetAtrb("OBJ_TYPE");
            if (deDealTypeCd == null)
            {
                dc.DataElements.Add(new OpDataElement
                {
                    DcID = dc.DcID,
                    DcType = OpDataElementTypeConverter.StringToId(dc.DcType),
                    DcParentType = OpDataElementTypeConverter.StringToId(dc.DcParentType),
                    DcParentID = dc.DcParentID,
                    AtrbID = 5,
                    AtrbValue = dc.DcType,
                    OrigAtrbValue = dc.DcType,
                    PrevAtrbValue = dc.DcType,
                    AtrbCd = "OBJ_TYPE",
                    State = OpDataElementState.Unchanged
                });
            }
            else if (deDealTypeCd.AtrbValue.ToString() == string.Empty)
            {
                deDealTypeCd.AtrbValue=dc.DcType;
            }

        }

        /// <summary>
        /// Ensure each data collector has the DcAltId set when known, and has an OpDataElement for DEAL_SID.
        /// </summary>
        public static void EnsureObjSetIdAtrb(this OpDataCollector dc, AttributeCollection sourceData)
        {
            if (dc == null) { return; }

            var atrb = sourceData.Get(AttributeCodes.DEAL_SID);
            if (dc.DataElements.All(de => de.AtrbID != atrb.ATRB_SID))
            {
                dc.DataElements.Add(new OpDataElement
                {
                    AtrbCd = atrb.ATRB_COL_NM,
                    AtrbID = atrb.ATRB_SID,
                    AtrbValue = dc.DcID,
                    DcID = dc.DcID,
                    DcParentType = OpDataElementTypeConverter.StringToId(dc.DcParentType),
                    DcType = OpDataElementTypeConverter.StringToId(dc.DcType),
                    DcParentID = dc.DcParentID,
                    State = OpDataElementState.Unchanged
                });
            }

        }

        public static bool HasTracker(this OpDataCollector dc)
        {
            var trackers = dc.GetDataElementsWhere(AttributeCodes.TRKR_NBR, d => d.AtrbValue.ToString() != string.Empty);
            return trackers != null && trackers.Any();
        }

        public static void ApplySecurityAttributes(this OpDataCollector dc, 
            string atrbAction, 
            SecurityWrapper securityWrapper, 
            string[] excludeList = null, 
            Dictionary<string, bool> securityActionCache = null)
        {
            OpDataElementType dcType = (OpDataElementType)Enum.Parse(typeof(OpDataElementType), dc.DcType);
            OpDataElementSetType objSetType = (OpDataElementSetType)Enum.Parse(typeof(OpDataElementSetType), dc.GetDataElementValue("OBJ_SET_TYPE_CD"));
			string stg = dc.GetDataElementValue(AttributeCodes.DEAL_STG_CD);
            if (excludeList == null) excludeList = new string[] { };

            // For each element, apply metadata rules
            foreach (OpDataElement de in dc.DataElements)
            {
                de.IsReadOnly = !excludeList.Contains(de.AtrbCd) && securityWrapper.ChkAtrbRules(
                    dcType,
					objSetType,
					OpUserStack.MyOpUserToken.Role,
                    stg,
                    atrbAction,
                    de.AtrbCd,
                    securityActionCache);
            }
        }
    }
}
