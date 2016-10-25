using System;
using System.Collections.Generic;
using System.Linq;
using Intel.Opaque.Data;

namespace Intel.MyDeals.Entities
{
    /// <summary>
    /// One stop shop for getting attribute meta data details
    /// </summary>
    public class AttributeCollection
    {
        public int ErrorInt = 0;
        public string ErrorString = string.Empty;

        // I am not sure we need the locking, but I will sleep better knowing it is in place.
        private static readonly object LockObject = new object();

        public AttributeCollection(Dictionary<int, MyDealsAttribute> masterDataInt, IEnumerable<OpAtrbMap> masterDataLookups)
        {
            MasterDataInt = masterDataInt;
            MasterDataLookups = masterDataLookups.ToArray();
        }


        #region Collections
        /// <summary>
        /// All attribute data keyed by ATRB_SID.
        /// This collection will get the data from the remote system using the resolver.
        /// </summary>
        public Dictionary<int, MyDealsAttribute> MasterDataInt { get; set;  }

        /// <summary>
        /// All attribute data keyed at ATBR_CD.
        /// This uses MasterDataInt for its source data.
        /// </summary>
        public Dictionary<string, MyDealsAttribute> MasterDataString
        {
            get
            {
                lock (LockObject)
                {
                    if (_masterDataString == null)
                    {
                        _masterDataString = MasterDataInt.ToDictionary(kvp => kvp.Value.ATRB_CD, kvp => kvp.Value);
                    }
                }
                return _masterDataString;
            }
        }
        private Dictionary<string, MyDealsAttribute> _masterDataString;

        /// <summary>
        /// Attribute lookup details (like DEAL_TYPE_CD to DEAL_TYPE_SID mappings).
        /// This collection will get the data from the remote system using the resolver.
        /// </summary>
        public OpAtrbMap[] MasterDataLookups { get; set; }

        /// <summary>
        /// All DCS Attributes
        /// </summary>
        public MyDealsAttribute[] All => MasterDataInt.Values.ToArray();

        #endregion

        #region Attribute Getters

        public MyDealsAttribute Get(string atrbCd)
        {
            return Get(atrbCd, null);
        }
        public MyDealsAttribute Get(string atrbCd, MyDealsAttribute errorDefault)
        {
            if (string.IsNullOrEmpty(atrbCd)) { return errorDefault; }

            MyDealsAttribute ret;
            if (MasterDataString.TryGetValue(atrbCd, out ret))
            {
                return ret;
            }
            return errorDefault;
        }

        public MyDealsAttribute Get(int atrbSid)
        {
            return Get(atrbSid, null);
        }
        public MyDealsAttribute Get(int atrbSid, MyDealsAttribute errorDefault)
        {
            if (atrbSid <= 0) { return errorDefault; }

            MyDealsAttribute ret;
            if (MasterDataInt.TryGetValue(atrbSid, out ret))
            {
                return ret;
            }
            return errorDefault;
        }

        public string GetCode(int atrbSid)
        {
            return GetCode(atrbSid, ErrorString);
        }
        public string GetCode(int atrbSid, string errorDefault)
        {
            var a = Get(atrbSid);
            if (a == null) { return errorDefault; }
            return a.ATRB_CD;
        }

        public int GetSid(string atrbCd)
        {
            return GetSid(atrbCd, ErrorInt);
        }
        public int GetSid(string atrbCd, int errorDefault)
        {
            var a = Get(atrbCd);
            if (a == null) { return errorDefault; }
            return a.ATRB_SID;
        }

        /// <summary>
        /// Get the ATRB_SID for a given ATRB_CD
        /// </summary>
        /// <param name="atrbCd">Valid, case sensitive, ATRB_CD</param>
        /// <returns>ATRB_SID or 0</returns>
        public int this[string atrbCd] => GetSid(atrbCd);

        /// <summary>
        /// Get the ATRB_CD for a given ATRB_SID
        /// </summary>
        /// <param name="atrbSid"></param>
        /// <returns>ATRB_CD or blank string</returns>
        public string this[int atrbSid] => GetCode(atrbSid);

        public MyDealsAttribute[] Find(Func<MyDealsAttribute, bool> pred)
        {
            return All.Where(pred).ToArray();
        }
        public MyDealsAttribute[] GetMany(params int[] atrbSids)
        {
            if (atrbSids == null || atrbSids.Length == 0)
            {
                return new MyDealsAttribute[] { };
            }

            return All
                .Where(a => atrbSids.Contains(a.ATRB_SID))
                .ToArray();
        }
        public MyDealsAttribute[] GetMany(params string[] atrbCds)
        {
            if (atrbCds == null || !atrbCds.Any())
            {
                return new MyDealsAttribute[] { };
            }

            return All
                .Where(a => atrbCds.Contains(a.ATRB_CD))
                .ToArray();
        }

        public string[] GetManyCode(params int[] atrbSids)
        {
            return GetMany(atrbSids)
                .Select(a => a.ATRB_CD)
                .ToArray();
        }
        public int[] GetManySid(params string[] atrbCds)
        {
            return GetMany(atrbCds)
               .Select(a => a.ATRB_SID)
               .ToArray();
        }

        #endregion

        #region Lookup Getters

        public OpAtrbMap LookupGet(string atrbCd, int itemSid)
        {
            foreach (var ret in MasterDataLookups.Where(lu => lu.AtrbCd == atrbCd && lu.AtrbItemId == itemSid))
            {
                return ret;
            }
            return null;
        }

        public string LookupGetValue(string atrbCd, int itemSid, string errorDefault)
        {
            foreach (var ret in MasterDataLookups.Where(lu => lu.AtrbCd == atrbCd && lu.AtrbItemId == itemSid))
            {
                return ret.AtrbItemValue;
            }
            return errorDefault;
        }

        public OpAtrbMap LookupGet(int atrbSid, int itemSid)
        {
            foreach (var ret in MasterDataLookups.Where(lu => lu.AtrbID == atrbSid && lu.AtrbItemId == itemSid))
            {
                return ret;
            }
            return null;
        }
        public OpAtrbMap LookupGet(string atrbCd, string itemValue)
        {
            foreach (var ret in MasterDataLookups.Where(lu => lu.AtrbCd == atrbCd && lu.AtrbItemValue == itemValue))
            {
                return ret;
            }
            return null;
        }

        public string LookupGetValue(int atrbSid, int itemSid)
        {
            return LookupGetValue(atrbSid, itemSid, ErrorString);
        }
        public string LookupGetValue(int atrbSid, int itemSid, string errorDefault)
        {
            foreach (var ret in MasterDataLookups.Where(lu => lu.AtrbID == atrbSid && lu.AtrbItemId == itemSid))
            {
                return ret.AtrbItemValue;
            }
            return errorDefault;
        }

        public int LookupGetItemId(string atrbCd, string itemValue)
        {
            return LookupGetItemId(atrbCd, itemValue, ErrorInt) ?? ErrorInt;
        }
        public int? LookupGetItemId(string atrbCd, string itemValue, int? errorDefault)
        {
            foreach (var ret in MasterDataLookups.Where(lu => lu.AtrbCd == atrbCd && lu.AtrbItemValue == itemValue))
            {
                return ret.AtrbItemId;
            }
            return errorDefault;
        }

        public OpAtrbMap[] LookupGet(int atrbSid)
        {
            return MasterDataLookups
                .Where(lu => lu.AtrbID == atrbSid)
                .ToArray();
        }

        public OpAtrbMap[] LookupGet(string atrbCd)
        {
            return MasterDataLookups
                .Where(lu => lu.AtrbCd == atrbCd)
                .ToArray();
        }

        public OpAtrbMap[] LookupFind(Func<OpAtrbMap, bool> pred)
        {
            return MasterDataLookups
                .Where(pred)
                .ToArray();
        }
        #endregion

        #region Try Getters
        public bool ContainsKey(string atrbCd)
        {
            return MasterDataString.ContainsKey(atrbCd);
        }
        public bool ContainsKey(int atrbSid)
        {
            return MasterDataInt.ContainsKey(atrbSid);
        }

        public bool TryGetValue(string atrbCd, out MyDealsAttribute atrb)
        {
            return MasterDataString.TryGetValue(atrbCd, out atrb);
        }

        public bool TryGetValue(int atrbSid, out MyDealsAttribute atrb)
        {
            return MasterDataInt.TryGetValue(atrbSid, out atrb);
        }

        public bool TryGetValue(string atrbCd, out int atrbSid)
        {
            MyDealsAttribute atrb;
            if (MasterDataString.TryGetValue(atrbCd, out atrb))
            {
                atrbSid = atrb.ATRB_SID;
                return true;
            }

            atrbSid = ErrorInt;
            return false;
        }

        public bool TryGetValue(int atrbSid, out string atrbCd)
        {
            MyDealsAttribute atrb;
            if (MasterDataInt.TryGetValue(atrbSid, out atrb))
            {
                atrbCd = atrb.ATRB_CD;
                return true;
            }

            atrbCd = ErrorString;
            return false;
        }
        #endregion

        public int Count()
        {
            return MasterDataInt.Count;
        }

        public bool HasData => MasterDataInt.Any();
    }

    public class AttributeCollectionHelpers
    {

    }
}
