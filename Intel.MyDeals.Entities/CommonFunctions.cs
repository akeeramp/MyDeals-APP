using System;
using System.Linq;
using Intel.Opaque;
using Intel.Opaque.Data;
using Intel.Opaque.Tools;

namespace Intel.MyDeals.Entities
{
    public static class CommonFunctions
    {

        /// <summary>
        /// 
        /// </summary>
        /// <param name="str"></param>
        /// <returns></returns>
        public static string CleanUserInput(string str)
        {
            if (String.IsNullOrEmpty(str)) { return String.Empty; }

            // Custom replaces
            str = str
                .Replace((char)8216, '\'') // Smart ticks
                .Replace((char)8217, '\'')
                .Replace((char)96, '\'')
                .Replace((char)8220, '\"')   //double tick
                .Replace((char)8221, '\"')    //double tick
                .Replace((char)8242, '\'')
                .Replace((char)769, '\'')
                .Replace((char)768, '\'')
                // Replacing Different Types of Hyphen refered from this sitehttp://unicodelookup.com/#Hyphen/1 
                .Replace((char)45, '-') // Hyphen
                .Replace((char)6150, '-') //Hyphen
                .Replace((char)8209, '-') //Hyphen
                .Replace((char)8259, '-') // Hyphen
                .Replace((char)65123, '-') // Hyphen
                .Replace((char)65293, '-') //Hyphen
                .Replace('\t', ' ')
                .Replace('\n', ' ')
                .Replace('\r', ' ');

            // Replace double spaces
            while (str.Contains("  ")) { str = str.Replace("  ", " "); }

            // Replace anything else that is not a valid A-z 0-9 Tick or space
            //return Regex.Replace(str, @"[^A-z0-9\' ]", "");
            return str;
        }

        /// <summary>
        /// This method will convert the input data into the given data type
        /// </summary>
        /// <param name="strDataInput"></param>
        /// <param name="strDataType"></param>
        /// <returns></returns>
        public static string ConvertToElementDataType(string strDataInput, string strDataType)
        {
            string strData = string.Empty;

            switch (strDataType)
            {
                case "System.DateTime":
                    strData = OpConvertSafe.ToStringDay(strDataInput);
                    break;

                case "System.Double":
                    strData = OpConvertSafe.ToDouble(strDataInput).ToString();
                    break;

                case "System.Int32":
                    strData = OpConvertSafe.ToInt(strDataInput).ToString();
                    break;

                default:
                    strData = Convert.ToString(strDataInput);
                    break;
            }

            return strData;
        }

    //    public static DateTime GetCurrentQtrStartDate(string custNm = "Intel")
    //    {
    //        DateTime today = DateTime.Now;
    //        return today.AddMonths(-1);
    //    }
    //    public static DateTime GetCurrentQtrEndDate(string custNm = "Intel")
    //    {
    //        DateTime today = DateTime.Now;
    //        return today.AddMonths(1);
    //    }
    //    public static DateTime GetQtrStartDate(DateTime date, string custNm = "Intel")
    //    {
    //        return date.AddMonths(-1).Date;
    //    }
    //    public static DateTime GetQtrEndDate(DateTime date, string custNm = "Intel")
    //    {
    //        return date.AddMonths(1).Date;
    //    }

        public static void ResetStateInWb(this MyDealsData myDealsData)
        {
            myDealsData.ResetStateInWb(OpDataElementType.Group);
            myDealsData.ResetStateInWb(OpDataElementType.Tertiary);
            myDealsData.ResetStateInWb(OpDataElementType.Secondary);
            myDealsData.ResetStateInWb(OpDataElementType.Deals);
        }

        public static void ResetStateInWb(this MyDealsData myDealsData, OpDataElementType opDataElementType)
        {
            if (!myDealsData.ContainsKey(opDataElementType)) return;

            foreach (OpDataElement dataElement in myDealsData[opDataElementType].AllDataElements)
            {
                dataElement.State = OpDataElementState.Unchanged;
            }

        }

        /// <summary>
        /// Standardize on Sold To string formatting
        /// </summary>
        /// <param name="input">Sold to string (e.g. 123456-EU,234556-AP)</param>
        /// <param name="fmt_sold_to">Sold to formatted to spec.</param>
        /// <returns>When true, the input appears valid and fmt_sold_to will be returned, else false and fmt_sold_to = input.</returns>
        public static bool FormatSoldToList(string input, out string fmt_sold_to)
        {
            const string GEO_SEP = "-";
            const string SOLD_SEP = ",";

            fmt_sold_to = input;
            
            if (String.IsNullOrEmpty(input))
            {
                return true; // Blank is valid
            }

            bool valid = true;

            var ai = input.ToUpper()
                // Other dash types that may have been copied from Office
                .Replace("—", GEO_SEP)
                .Replace("–", GEO_SEP)
                // Allow for splitting on various characters
                .Split(',', '/', '\\', '\n', '\r', '\t', ' ', ';', '|')
                .Where(s => !String.IsNullOrEmpty(s))
                .Select(s =>
                {
                    var ret = new OpPair<UInt64, string>(0, String.Empty);
                    if (!s.Contains(GEO_SEP))
                    {
                        return ret; // No - to seperate sold to and Geo, invalid
                    }

                    var as2 = s.Split(new string[] { GEO_SEP }, StringSplitOptions.RemoveEmptyEntries);
                    if (as2.Length != 2)
                    {
                        return ret; // Paranoia check
                    }

                    UInt64 stid = 0;
                    if (UInt64.TryParse(as2[0].Trim(), out stid))
                    {
                        ret.First = stid; // Sold to should be castable to a long
                    }
                    else
                    {
                        ret.First = 0; // Error condition
                    }
                    ret.Second = as2[1].Trim();

                    return ret;
                })
                .ToArray();

            foreach (var bad_pairs in ai.Where(pp =>
            {
                // Check for invalid sold to pairs...
                if(pp == null){ return true;} // Paranoia
                if (pp.First == null || pp.First <= 0) { return true; } // Sold to should be > 0
                if (pp.Second == null || String.IsNullOrEmpty(pp.Second) || pp.Second.Length != 2) { return true; } // Should be a 2 char string
                
                return false; // since we are looking for bad, false = good
            }))
            {
                valid = false;

                // TODO: What to do with these messages?  Maybe want to return them as an error message?
                if(bad_pairs == null)
                {
                    OpLogPerf.Log("Invalid Sold-To Pair: Value is Null.");
                } 
                else 
                {
                    OpLogPerf.Log(@"Invalid Sold-To Pair: ""{0}""-""{1}"".", bad_pairs.First, bad_pairs.Second);
                }
            }

            // If the input string was not valid, just return it in error (set at top)
            if(!valid)
            {
                return false;
            }

            // Order the values and join with the standard delims
            fmt_sold_to = String.Join(SOLD_SEP,
                ai
                    .OrderBy(pp => pp.First)
                    .ThenBy(pp => pp.Second)
                    .Select(pp => String.Format("{0}{1}{2}", pp.First, GEO_SEP, pp.Second))
                );

            return true;
        }


        ///// <summary>
        ///// 0
        ///// </summary>
        //public const int INVALID_WWID = 0;
        ///// <summary>
        ///// 99999999
        ///// </summary>
        //public const int SYSTEM_WWID = 99999999;

        ///// <summary>
        ///// Url Root for DcsServiceCalls
        ///// </summary>
        //public static string DCS_SERVICE_ROOT
        //{
        //    get
        //    {
        //        if (String.IsNullOrEmpty(_DCS_SERVICE_ROOT))
        //        {
        //            _DCS_SERVICE_ROOT = (new OpCurrentConfig("DCS")).CurrentWebServiceOpEnvironment.NodeAddress;
        //        }
        //        return _DCS_SERVICE_ROOT;
        //    }
        //}
        //private static string _DCS_SERVICE_ROOT = String.Empty;

        //public static void ClearCache()
        //{
        //    if (IdsidWWIDCache == null) { IdsidWWIDCache = new Dictionary<string, int>(); }

        //    lock (IdsidWWIDCache)
        //    {
        //        IdsidWWIDCache.Clear();
        //    }
        //}

        //public static bool IsAuth()
        //{
        //    return (GetWWIDFromIdsid() != INVALID_WWID);
        //}

        //public static bool IsAuth(out string idsid, out int wwid)
        //{
        //    idsid = Utils.ThreadUser;
        //    wwid = GetWWIDFromIdsid(idsid, true);
        //    return (wwid != INVALID_WWID);
        //}

        //public static bool TryAuth(out int wwid)
        //{
        //    wwid = GetWWIDFromIdsid();
        //    return (wwid != INVALID_WWID);
        //}

        ///// <summary>
        ///// Get WWID of current thread user
        ///// </summary>
        ///// <returns>WWID or 0 on error</returns>
        //public static int GetWWIDFromIdsid()
        //{
        //    return GetWWIDFromIdsid(Utils.ThreadUser, true);
        //}
        ///// <summary>
        ///// Get employee WWID from IDSID
        ///// </summary>
        ///// <param name="idsid">Valid IDSID</param>
        ///// <returns>WWID</returns>
        //public static int GetWWIDFromIdsid(string idsid)
        //{
        //    return GetWWIDFromIdsid(idsid, false);
        //}

        ///// <summary>
        ///// Get employee WWID from IDSID
        ///// </summary>
        ///// <param name="idsid">Valid IDSID</param>
        ///// <param name="logit">Log login to login log</param>
        ///// <returns>WWID</returns>
        //public static int GetWWIDFromIdsid(string idsid, bool logit)
        //{
        //    return GetWWIDFromIdsid(idsid, logit, true);
        //}
        //public static int GetWWIDFromIdsid(string idsid, bool logit, bool useCache)
        //{
        //    idsid = (idsid ?? "").ToUpper().Trim();

        //    if (!String.IsNullOrEmpty(idsid))
        //    {
        //        int wwid;

        //        if (useCache)
        //        {
        //            lock (IdsidWWIDCache)
        //            {
        //                if (IdsidWWIDCache.TryGetValue(idsid, out wwid))
        //                {
        //                    return wwid;
        //                }
        //            }
        //        }

        //        object ret = DataAccess.ExecuteScalar(new Procs.core.PR_GET_WWID
        //        {
        //            idsid_or_wwid = idsid,
        //            logit = logit
        //        });

        //        if (ret != null && ret != DBNull.Value)
        //        {
        //            wwid = (int)ret;

        //            // If they are invalid, don't cache it, so when the tool comes back 
        //            // on line we don't need to clear cache for all users.
        //            if (wwid != INVALID_WWID && wwid != SYSTEM_WWID)
        //            {
        //                if (useCache)
        //                {
        //                    lock (IdsidWWIDCache)
        //                    {
        //                        IdsidWWIDCache[idsid] = wwid;
        //                    }
        //                }

        //                return wwid;
        //            }
        //        }
        //    }

        //    return INVALID_WWID; // Not sure what else to return here?
        //}
        //private static Dictionary<string, int> IdsidWWIDCache = new Dictionary<string, int>();

        ///// <summary>
        ///// Get WWID and IDSID uncached.
        ///// Used for debugging.
        ///// </summary>
        ///// <returns></returns>
        //public static OpPair<int, string> GetDebuggingNameAndIdsidPair()
        //{
        //    try
        //    {
        //        string idsid = Utils.ThreadUser;

        //        return new OpPair<int, string>
        //            (
        //            GetWWIDFromIdsid(idsid, false, false),
        //            idsid
        //            );

        //    }
        //    catch (Exception ex)
        //    {
        //        OpLogPerf.Log(ex);
        //        return new OpPair<int, string>(0, String.Format("Unable to resolve user details. {0}", ex.Message));
        //    }
        //}

        //public static string GetDebuggingNameAndIdsid()
        //{
        //    try
        //    {
        //        var p = GetDebuggingNameAndIdsidPair();

        //        return String.Format("IDSID: \"{0}\", WWID: {1}",
        //            p.Second,
        //            p.First
        //            );
        //    }
        //    catch (Exception ex)
        //    {
        //        OpLogPerf.Log(ex);
        //        return String.Format("Unable to resovle user details. {0}", ex.Message);
        //    }
        //}

    }



}