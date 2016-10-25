using System;
using System.Runtime.Serialization;


namespace Intel.MyDeals.Entities
{

    [DataContract]
    public class SearchSorter
    {
        [DataContract]
        public enum SortModeType
        {
            [EnumMember]
            Ascending,
            [EnumMember]
            Descending
        };

        /// <summary>
        /// Attribute to order by
        /// </summary>
        [DataMember]
        public string AttributeCode;

        /// <summary>
        /// Order by direction
        /// </summary>
        [DataMember]
        public SortModeType SortMode;

        public string GetSortModeString()
        {
            switch (SortMode)
            {
                case SortModeType.Ascending: return "ASC";
                case SortModeType.Descending: return "DESC";
                default: return "ASC";
            }
        }

        public string GetOrderBy()
        {
            if (String.IsNullOrEmpty(AttributeCode))
            {
                return "";
            }

            return String.Format("[{0}] {1}",
                AttributeCode,
                GetSortModeString()
                );
        }

        public override string ToString()
        {
            return GetOrderBy();
        }
    }
}