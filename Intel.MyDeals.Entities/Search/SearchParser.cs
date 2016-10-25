using System;
using System.Collections.Generic;

namespace Intel.MyDeals.Entities
{
    /// <summary>
    /// Base class for parsing arbitrary text and trying to form a search clause out of it.
    /// </summary>
    public abstract class SearchParser
    {
        protected SearchParser(string targetAttribute)
        {
            TargetAttribute = targetAttribute;
        }

        /// <summary>
        /// Attribute on which we are trying to seek.
        /// </summary>
        public string TargetAttribute { set; get; }

        /// <summary>
        /// Function used to parse search
        /// </summary>
        /// <param name="searchTerm">Text search term to seek.</param>
        /// <param name="atrb">Resolved attribue of TargetAttribue.</param>
        /// <param name="atrbMstr">Master Data</param>
        /// <returns>null or a valid search filter</returns>
        public abstract SearchFilter Parse(string searchTerm, MyDealsAttribute atrb, AttributeCollection atrbMstr, Dictionary<int, CustomerDivision> divisions);

        /// <summary>
        /// Helper function to see if the passed value conforms to type spec for said attribue.
        /// </summary>
        /// <param name="searchTerm">Text search term to seek.</param>
        /// <param name="atrb">Resolved attribue of TargetAttribue.</param>
        /// <returns>Value as string but after coversion to strong type, or empty/null string.</returns>
        protected string GetValueStonglyTyped(string searchTerm, MyDealsAttribute atrb)
        {
            if (String.IsNullOrEmpty(searchTerm) || atrb == null) { return null; }

            string ret = String.Join("{0}", atrb.GetValueStronglyTyped(searchTerm));
            if (String.IsNullOrEmpty(ret)) { return null; }
            if (!atrb.IsLengthCheck(ret)) { return null; }

            return ret;
        }
    }
}
