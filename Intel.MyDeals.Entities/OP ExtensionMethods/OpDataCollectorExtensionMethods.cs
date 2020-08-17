using System;
using System.Collections.Generic;
using System.Linq;
using Intel.Opaque;
using Intel.Opaque.Data;
using Newtonsoft.Json;
using Force.DeepCloner;

namespace Intel.MyDeals.Entities
{
    public static class OpDataCollectorExtensionMethods
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

        public static string GetDataElementValueNull(this IOpDataCollector dc, string name, string ifNull)
        {
            if (dc == null) throw new ArgumentNullException("dc");
            IOpDataElement de = dc.GetDataElement(name);
            string val = de?.AtrbValue.ToString();
            return String.IsNullOrEmpty(val) ? ifNull : val;
        }

        public static IOpDataElement GetDataElementByDim(this IOpDataCollector dc, string name, OpAtrbMapCollection dimKey)
        {
            return !dc.CheckDataElement(ref name) ? null : dc.DataElements.FirstOrDefault(d => d.AtrbCd == name && d.DimKey != null && d.DimKey.ToString() == dimKey.ToString());
        }

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

        public static void SetAtrb(this OpDataCollector dc, string atrbCd, object val, string timelineComment = null)
        {
            OpDataElementAtrb de = dc.GetAtrb(atrbCd);
            if (de == null || (de.AtrbValue != null && val != null && de.AtrbValue.ToString() == val.ToString())) return;
            if (de.AtrbValue == val) return;

            de.AtrbValue = val;
            de.State = OpDataElementState.Modified;
            if (!String.IsNullOrEmpty(timelineComment))
            {
                dc.AddTimelineComment(timelineComment);
            }
        }

        public static void SetModified(this OpDataCollector dc, string atrbCd)
        {
            OpDataElementAtrb de = dc.GetAtrb(atrbCd);
            if (de != null)
            {
                de.State = OpDataElementState.Modified;
            }
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
            if (dc?.DataElements == null) { return new OpDataElementAtrb[] { }; }
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
            if (dc == null || !String.IsNullOrEmpty(dc.DcType)) { return; }

            string dealType = opType != OpDataElementType.DEAL && opType != OpDataElementType.WIP_DEAL ? opType.ToString() : null;

            if (dealType == null)
            {
                string deDealTypeSid = dc.GetAtrbValue("OBJ_TYPE").ToString();

                if (String.IsNullOrEmpty(deDealTypeSid))
                {
                    dc.DcType = String.Empty;
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

            dc.DcType = dealType ?? String.Empty;

            IOpDataElement deDealTypeCd = (IOpDataElement)dc.GetAtrb("OBJ_TYPE");
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
            else if (deDealTypeCd.AtrbValue.ToString() == String.Empty)
            {
                deDealTypeCd.AtrbValue = dc.DcType;
            }
        }

        public static void AddTimelineComment(this OpDataCollector dc, string message)
        {
            if (dc == null) return;

            IOpDataElement deComment = (IOpDataElement)dc.GetAtrb(AttributeCodes.SYS_COMMENTS);
            if (deComment == null)
            {
                dc.DataElements.Add(new OpDataElement
                {
                    DcID = dc.DcID,
                    DcType = OpDataElementTypeConverter.StringToId(dc.DcType),
                    DcParentType = OpDataElementTypeConverter.StringToId(dc.DcParentType),
                    DcParentID = dc.DcParentID,
                    AtrbID = Attributes.SYS_COMMENTS.ATRB_SID,
                    AtrbValue = message,
                    OrigAtrbValue = String.Empty,
                    PrevAtrbValue = String.Empty,
                    AtrbCd = AttributeCodes.SYS_COMMENTS,
                    State = OpDataElementState.Modified
                });
            }
            else if (String.IsNullOrEmpty(deComment.AtrbValue.ToString()) || deComment.AtrbValue.ToString() == deComment.OrigAtrbValue.ToString())
            {
                deComment.AtrbValue = message;
            }
            else if (deComment.AtrbValue.ToString().IndexOf(message, StringComparison.Ordinal) < 0)
            {
                deComment.AtrbValue += "; " + message;
            }
        }

        public static void AddSalesForceApprover(this OpDataCollector dc)
        {
            if (dc == null) return;

            IOpDataElement deSalesforceApprovedBy = (IOpDataElement)dc.GetAtrb(AttributeCodes.AUTO_APPROVE_RULE_INFO);
            if (deSalesforceApprovedBy == null)
            {
                dc.DataElements.Add(new OpDataElement
                {
                    DcID = dc.DcID,
                    DcType = OpDataElementTypeConverter.StringToId(dc.DcType),
                    DcParentType = OpDataElementTypeConverter.StringToId(dc.DcParentType),
                    DcParentID = dc.DcParentID,
                    AtrbID = Attributes.AUTO_APPROVE_RULE_INFO.ATRB_SID,
                    AtrbValue = OpUserStack.MyOpUserToken.Usr.WWID,
                    OrigAtrbValue = String.Empty,
                    PrevAtrbValue = String.Empty,
                    AtrbCd = AttributeCodes.AUTO_APPROVE_RULE_INFO,
                    State = OpDataElementState.Modified
                });
            }
            else if (String.IsNullOrEmpty(deSalesforceApprovedBy.AtrbValue.ToString()) || deSalesforceApprovedBy.AtrbValue.ToString() == deSalesforceApprovedBy.OrigAtrbValue.ToString())
            {
                deSalesforceApprovedBy.AtrbValue = OpUserStack.MyOpUserToken.Usr.WWID;
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
            // cover the levels with TRKR_NBR defined
            var trackers = dc.GetDataElementsWhere(AttributeCodes.TRKR_NBR, d => d.AtrbValue.ToString() != String.Empty);
            if (trackers != null && trackers.Any()) return true;

            // cover rollup values
            string hasTracker = dc.GetDataElementValue(AttributeCodes.HAS_TRACKER);
            return hasTracker == "1";
        }

        public static void ApplySecurityAttributes(this OpDataCollector dc,
            string atrbAction,
            SecurityWrapper securityWrapper,
            string[] excludeList = null,
            Dictionary<string, bool> securityActionCache = null)
        {
            OpDataElementType dcType = (OpDataElementType)Enum.Parse(typeof(OpDataElementType), dc.DcType);
            if (dc.GetDataElementValue("OBJ_SET_TYPE_CD") == "") return;

            OpDataElementSetType objSetType = (OpDataElementSetType)Enum.Parse(typeof(OpDataElementSetType), dc.GetDataElementValue("OBJ_SET_TYPE_CD"));
            string stg = dc.GetDataElementValue(AttributeCodes.WF_STG_CD);
            if (dcType == OpDataElementType.WIP_DEAL || dcType == OpDataElementType.PRC_TBL_ROW) stg = dc.GetDataElementValue(AttributeCodes.PS_WF_STG_CD);
            if (excludeList == null) excludeList = new string[] { };

            var prop = "IsReadOnly";
            if (atrbAction == "ATRB_REQUIRED") prop = "IsRequired";
            if (atrbAction == "ATRB_HIDDEN") prop = "IsHidden";

            // For each element, apply metadata rules
            foreach (OpDataElement de in dc.DataElements)
            {
                var result = !excludeList.Contains(de.AtrbCd) && securityWrapper.ChkAtrbRules(
                    dcType,
                    objSetType,
                    stg,
                    atrbAction,
                    de.AtrbCd,
                    securityActionCache);

                if (result) typeof(OpDataElement).GetProperty(prop).SetValue(de, true);
            }
        }

        public static OpDataCollector Clone(this OpDataCollector dc, int dcId)
        {
            OpDataCollector dcClone = dc.DeepClone();
            dcClone.DcID = dcId;
            foreach (OpDataElement de in dcClone.DataElements)
            {
                de.DcID = dcId;
                de.State = OpDataElementState.Modified;
            }
            return dcClone;
        }

        public static void MarkAllModified(this OpDataCollector dc)
        {
            foreach (OpDataElement de in dc.DataElements)
            {
                de.State = OpDataElementState.Modified;
            }
        }

        public static string GetNextStage(this OpDataCollector dc, string actn, List<WorkFlows> workflows, string stage = null, OpDataElementType opDataElementType = OpDataElementType.ALL_OBJ_TYPE)
        {
            OpUserToken opUserToken = OpUserStack.MyOpUserToken;

            if (String.IsNullOrEmpty(stage)) stage = dc.GetDataElementValue(AttributeCodes.WF_STG_CD);
            string objSetType = dc.GetDataElementValue(AttributeCodes.OBJ_SET_TYPE_CD);

            if (opDataElementType == OpDataElementType.ALL_OBJ_TYPE) opDataElementType = OpDataElementTypeConverter.FromString(dc.DcType);

            // load actions
            return workflows
                .Where(w =>
                w.WF_NM == "General WF" &&
                (w.OBJ_TYPE == opDataElementType.ToDesc() || w.OBJ_TYPE == "ALL_TYPES") &&
                (w.OBJ_SET_TYPE_CD == objSetType || w.OBJ_SET_TYPE_CD == "ALL_TYPES") &&
                w.WFSTG_CD_SRC == stage &&
                w.WFSTG_ACTN_NM == actn &&
                w.ROLE_TIER_NM == opUserToken.Role.RoleTier)
                .OrderBy(w => w.OBJ_TYPE == "ALL_TYPES" ? 1 : 0)
                .ThenBy(w => w.OBJ_SET_TYPE_CD == "ALL_TYPES" ? 1 : 0)
                .Select(w => w.WFSTG_CD_DEST).FirstOrDefault();
        }

        public static void ClearValidationMessages(this OpDataCollector dc)
        {
            if (dc == null) return;
            foreach (IOpDataElement de in dc.GetDataElementsWhere(d => !string.IsNullOrEmpty(d.ValidationMessage)))
            {
                de.ValidationMessage = string.Empty;
            }
        }
    }
}