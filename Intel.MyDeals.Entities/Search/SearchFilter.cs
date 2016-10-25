using System;
using System.Collections.Generic;
using System.Runtime.Serialization;
using System.Xml.Serialization;

namespace Intel.MyDeals.Entities
{
    /// <summary>
    /// A single search clause
    /// </summary>
    [DataContract]
    public class SearchFilter
    {
        #region Enums
        [DataContract]
        public enum ConjunctionType
        {
            [EnumMember]
            AND,
            [EnumMember]
            OR
        };


        [DataContract]
        public enum OperatorType 
        {
            [EnumMember]
            NOT_SET,
            [EnumMember]
            EQUAL,
            [EnumMember]
            NOT_EQUAL,
            [EnumMember]
            GREATER,
            [EnumMember]
            GREATER_OR_EQUAL,
            [EnumMember]
            LESS,
            [EnumMember]
            LESS_OR_EQUAL
        };
        #endregion

        #region Constructors
        public SearchFilter()
        {
            SubFilters = new List<SearchFilter>();
            Operator = OperatorType.NOT_SET;
        }

        public SearchFilter(ConjunctionType subFilterConjunction, params SearchFilter[] subItems) 
            : this()
        {
            SubFilterConjunction = subFilterConjunction;
            SubFilters.AddRange(subItems);
        }

        public SearchFilter(int atrb_id, OperatorType oper, string value)
            : this()
        {
            this.AttributeID = atrb_id;
            this.Operator = oper;
            this.Value = value;
        }
        #endregion

        #region Primary Properties
        /// <summary>
        /// Attribute to see upon, must exist in ATRB_MSTR.
        /// </summary>
        [DataMember]
        public int AttributeID { set; get; }
        
        /// <summary>
        /// How to search...
        /// </summary>
        [DataMember]
        public OperatorType Operator { set; get; }
       
        /// <summary>
        /// What are you seeking.
        /// ; will split into OR, * = wildcard, &lt;blank&gt; searchs for null/blank  string
        /// </summary>
        [DataMember]
        public string Value { set; get; }

        /// <summary>
        /// For any sub filter items, how are those items aggregated together
        /// </summary>
        [DataMember]
        public ConjunctionType SubFilterConjunction { set; get; }

        /// <summary>
        /// Subset of items (recursive)
        /// </summary>
        [DataMember]
        public List<SearchFilter> SubFilters { set; get; }
        #endregion

        #region Derived Properties
        /// <summary>
        /// Operator in string format
        /// </summary>
        [XmlIgnore]
        [IgnoreDataMember]
        public string OperatorString
        {
            get
            {
                switch (Operator)
                {
                    case OperatorType.EQUAL: return "=";
                    case OperatorType.GREATER: return ">";
                    case OperatorType.GREATER_OR_EQUAL: return ">=";
                    case OperatorType.LESS: return "<";
                    case OperatorType.LESS_OR_EQUAL: return "<=";
                    case OperatorType.NOT_EQUAL: return "<>";
                    default: return "=";
                }
            }
        }

        /// <summary>
        /// True when fitler contains a specific search item, else false.
        /// This does not look at SubFilters when determining validity.
        /// </summary>
        [XmlIgnore]
        [IgnoreDataMember]
        public bool IsFilter
        {
            get
            {
                if ((Operator == OperatorType.NOT_SET) || (AttributeID <= 0))
                {
                    return false;
                }
                else
                {
                    return true;
                }
            }
        }

        [XmlIgnore]
        [IgnoreDataMember]
        public bool HasValidFilter
        {
            get
            {
                if (IsFilter) { return true; }

                foreach (var f in this.SubFilters)
                {
                    if (f.HasValidFilter) { return true; }
                }

                return false;
            }
        }

        public override string ToString()
        {
            return String.Format("(([ATRB_SID] = {0}) AND ([ATRB_VAL] {1} '{2}'))",
                AttributeID,
                OperatorString,
                Value
                );
        }
        #endregion

    }

}