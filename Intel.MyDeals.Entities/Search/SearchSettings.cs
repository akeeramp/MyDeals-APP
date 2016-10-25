using System.Collections.Generic;
using System.Runtime.Serialization;
using Intel.Opaque.Data;


namespace Intel.MyDeals.Entities
{
    [DataContract]
    [KnownType(typeof(SearchFilter))]
    [KnownType(typeof(SearchSorter))]
    [KnownType(typeof(OpDataElementType))]
    [KnownType(typeof(SchemeDetail))]
    public class SearchSettings
    {
        public SearchSettings()
        {
            SelectedAttributeID = new List<int>();
            Sorters = new List<SearchSorter>();

            ApplySecurity = true;
            TargetScheme = OpDataElementType.Deals; // Default to Deal
        }

        #region Properties

        /// <summary>
        /// Unique Identifer for this SearchSettings collection, so they can be saved/loaded
        /// </summary>
        [DataMember]
        public int ID { set; get; }
        
        /// <summary>
        /// User friendly way to identify this search
        /// </summary>
        [DataMember]
        public string Name { set; get; }

        
        /// <summary>
        /// Use this as the default search when a default is needed.
        /// </summary>
        [DataMember]
        public bool IsDefault { set; get; } 
        
        /// <summary>
        /// Owner of rthe search
        /// </summary>
        [DataMember]
        public int OwnerWWID { set; get; }

        /// <summary>
        /// When true, apply security to the result set
        /// </summary>
        [DataMember]
        public bool ApplySecurity { set; get; }

        /// <summary>
        /// What sort of data are we seeking against
        /// </summary>
        [DataMember]
        public OpDataElementType TargetScheme { set; get; }


        public SchemeDetail GetSchemeDetails()
        {
            return SchemeDetail.Get(TargetScheme);
        }
        
        #endregion

        #region List of collections

        /// <summary>
        /// Attribtues to return in the select
        /// </summary>
        [DataMember]
        public List<int> SelectedAttributeID {set; get;}

        /// <summary>
        /// Filter Criteria
        /// </summary>
        [DataMember]
        public SearchFilter Filters {set; get;}

        /// <summary>
        /// Order By Criteria
        /// </summary>
        [DataMember]
        public List<SearchSorter> Sorters { set; get; }

        #endregion

    }

}
