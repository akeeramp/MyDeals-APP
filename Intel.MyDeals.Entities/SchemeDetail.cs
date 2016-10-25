using System;
using System.Collections.Generic;
using System.Runtime.Serialization;
using Intel.Opaque.Data;

namespace Intel.MyDeals.Entities
{
    /// <summary>
    /// For a given OpDataElementType, get relevant DB details useful for search.
    /// Trying to make this a one-stop-shop for hard coded scheme details.
    /// </summary>
    [DataContract]
    public class SchemeDetail
    {
        /// <summary>
        /// Primary search view
        /// </summary>
        [DataMember]
        public string SearchViewName { private set; get; }
        /// <summary>
        /// Header table name
        /// </summary>
        [DataMember]
        public string HeaderTableName { private set; get; }

        /// <summary>
        /// PKID column name in header table
        /// </summary>
        [DataMember]
        public string PKColumnName { private set; get; }

        /// <summary>
        /// Actual Type
        /// </summary>
        [DataMember]
        public OpDataElementType SchemeType { private set; get; }

        public override string ToString()
        {
            return String.Format("{0}; {1}; {2}; {3}",
                SchemeType,
                SearchViewName,
                HeaderTableName,
                PKColumnName
                );
        }

        private static Dictionary<OpDataElementType, SchemeDetail> _cache = new Dictionary<OpDataElementType, SchemeDetail>();
        private static object LOCK_OBJECT = new object();

        /// <summary>
        /// Get scheme details for a given scheme
        /// </summary>
        /// <param name="schemeType"></param>
        /// <returns></returns>
        public static SchemeDetail Get(OpDataElementType schemeType)
        {
            // Tried to do an optimistic on-demand cache here...
            lock (LOCK_OBJECT)
            {
                if (_cache == null) { _cache = new Dictionary<OpDataElementType, SchemeDetail>(); }

                SchemeDetail ret;
                if (_cache.TryGetValue(schemeType, out ret))
                {
                    return ret;
                }
                _cache[schemeType] = ret = new SchemeDetail(schemeType);
                
                return ret;
            }
        }
        

        public static void ClearCache()
        {
            if (_cache != null) { _cache.Clear(); }
        }

        private SchemeDetail(OpDataElementType schemeType)
        {
            SearchViewName = GetSearchViewName(schemeType);
            HeaderTableName = GetHeaderTableName(schemeType);
            PKColumnName = GetPKColumnName(schemeType);

        }

        private static string GetSearchViewName(OpDataElementType scheme)
        {
            return String.Format("[deal].[VW_DEAL_SRCH_{0}]", OpDataElementTypeConverter.ToString(scheme));
        }

        private static string GetHeaderTableName(OpDataElementType scheme)
        {
            switch (scheme)
            {
                case OpDataElementType.Deals: return "[tdeal].[DEAL]";
                case OpDataElementType.Secondary: return "[tdeal].[DEAL_PREP]";
                case OpDataElementType.Tertiary: return "[tdeal].[PRD_LINE_AGRMNT_ATRB]";
                case OpDataElementType.Group: return "[tdeal].[DEAL_GRP_ATRB]";
                case OpDataElementType.Archive: return "[tdeal].[DEAL_ATRB_ARCHV]";
                case OpDataElementType.History: return "[tdeal].[DEAL_ATRB_HIST]";
                case OpDataElementType.Snapshot: return "[tdeal].[DEAL_ATRB_SNAPSHOT]";
            }
            return "[tdeal].[DEAL]";
        }

        private static string GetPKColumnName(OpDataElementType scheme)
        {
            switch (scheme)
            {
                case OpDataElementType.Deals: return "DEAL_SID";
                case OpDataElementType.Secondary: return "DEAL_PREP_SID";
                case OpDataElementType.Tertiary: return "PLI_SID";
                case OpDataElementType.Group: return "DEAL_GRP_SID";
                case OpDataElementType.Archive: return "DEAL_SID";
                case OpDataElementType.History: return "DEAL_SID";
                case OpDataElementType.Snapshot: return "DEAL_SID";
            }
            return "DEAL_SID";
        }
    }
}
