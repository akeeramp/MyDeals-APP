using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Xml.Serialization;
using Intel.Opaque.Tools;
using Newtonsoft.Json;

namespace Intel.MyDeals.Entities
{
    public partial class DcsProduct
    {
        public const int LVL_ALL_PRD_NM = 7001;
        public const int LVL_DEAL_PRD_TYPE = 7002;
        public const int LVL_PRD_CATGRY_NM = 7003;
        public const int LVL_BRND_NM = 7004;
        public const int LVL_FMLY_NM = 7005;
        public const int LVL_PRCSSR_NBR = 7006;
        public const int LVL_DEAL_PRD_NM = 7007;
        public const int LVL_MTRL_ID = 7008;
        private static volatile int _UniqueInt = 1000000000;

        public enum DcsProductStatus
        {
            Inactive,
            Active,
            Future
        }

        [IgnoreDataMember()]
        [XmlIgnore()]
        [JsonIgnore]
        public string DisplayName
        {
            get
            {
                if (!String.IsNullOrEmpty(PRD_HIER_NM))
                {
                    return PRD_HIER_NM;
                }
                
                switch (this.PRD_ATRB_SID)
                {
                    case LVL_ALL_PRD_NM: PRD_HIER_NM = this.ALL_PRD_NM; break;
                    case LVL_DEAL_PRD_TYPE: PRD_HIER_NM = this.DEAL_PRD_TYPE; break;
                    case LVL_PRD_CATGRY_NM: PRD_HIER_NM = this.PRD_CATGRY_NM; break;
                    case LVL_BRND_NM: PRD_HIER_NM = this.BRND_NM; break;
                    case LVL_FMLY_NM: PRD_HIER_NM = this.FMLY_NM; break;
                    case LVL_PRCSSR_NBR: PRD_HIER_NM = this.PRCSSR_NBR; break;
                    case LVL_DEAL_PRD_NM: PRD_HIER_NM = this.DEAL_PRD_NM; break;
                    case LVL_MTRL_ID: PRD_HIER_NM = this.MTRL_ID; break;
                }

                return PRD_HIER_NM ?? String.Empty;
            }
        }


        [IgnoreDataMember()]
        [XmlIgnore()]
        [JsonIgnore]
        public string PROD_NAME
        {
            get
            {
                if (!String.IsNullOrEmpty(PRD_HIER_NM))
                {
                    return PRD_HIER_NM;
                }

                switch (this.PRD_ATRB_SID)
                {
                    case LVL_ALL_PRD_NM: PRD_HIER_NM = this.ALL_PRD_NM; break;
                    case LVL_DEAL_PRD_TYPE: PRD_HIER_NM = this.DEAL_PRD_TYPE; break;
                    case LVL_PRD_CATGRY_NM: PRD_HIER_NM = this.PRD_CATGRY_NM; break;
                    case LVL_BRND_NM: PRD_HIER_NM = this.BRND_NM; break;
                    case LVL_FMLY_NM: PRD_HIER_NM = this.FMLY_NM; break;
                    case LVL_PRCSSR_NBR: PRD_HIER_NM = this.PRCSSR_NBR; break;
                    case LVL_DEAL_PRD_NM: PRD_HIER_NM = this.DEAL_PRD_NM; break;
                    case LVL_MTRL_ID: PRD_HIER_NM = this.MTRL_ID; break;
                }

                return PRD_HIER_NM ?? String.Empty;
            }
        }

        [IgnoreDataMember()]
        [XmlIgnore()]
        [JsonIgnore]
        public string DisplayPath
        {
            get
            {
                List<string> paths = new List<string>();
                if (!string.IsNullOrEmpty(DEAL_PRD_TYPE)) paths.Add(DEAL_PRD_TYPE);
                if (!string.IsNullOrEmpty(PRD_CATGRY_NM)) paths.Add(PRD_CATGRY_NM);
                if (!string.IsNullOrEmpty(BRND_NM)) paths.Add(BRND_NM);
                if (!string.IsNullOrEmpty(FMLY_NM)) paths.Add(FMLY_NM);
                if (!string.IsNullOrEmpty(PRCSSR_NBR)) paths.Add(PRCSSR_NBR);
                if (!string.IsNullOrEmpty(DEAL_PRD_NM)) paths.Add(DEAL_PRD_NM);
                if (!string.IsNullOrEmpty(MTRL_ID)) paths.Add(MTRL_ID);
                return string.Join(" / ", paths);
            }
        }

        [IgnoreDataMember()]
        [XmlIgnore()]
        [JsonIgnore]
        public string DisplayLevel
        {
            get
            {
                switch (this.PRD_ATRB_SID)
                {
                    case LVL_ALL_PRD_NM: return "All";
                    case LVL_DEAL_PRD_TYPE: return "Deal Product Type";
                    case LVL_PRD_CATGRY_NM: return "Product Category";
                    case LVL_BRND_NM: return "Brand";
                    case LVL_FMLY_NM: return "Family";
                    case LVL_PRCSSR_NBR: return "Processor";
                    case LVL_DEAL_PRD_NM: return "Deal Product";
                    case LVL_MTRL_ID: return "Material";
                }

                return String.Empty;
            }
        }

        [IgnoreDataMember()]
        [XmlIgnore()]
        [JsonIgnore]
        public string DisplayLevelCode
        {
            get
            {
                switch (this.PRD_ATRB_SID)
                {
                    case LVL_ALL_PRD_NM: return "ALL_PRD_NM";
                    case LVL_DEAL_PRD_TYPE: return "DEAL_PRD_TYPE";
                    case LVL_PRD_CATGRY_NM: return "PRD_CATGRY_NM";
                    case LVL_BRND_NM: return "BRND_NM";
                    case LVL_FMLY_NM: return "FMLY_NM";
                    case LVL_PRCSSR_NBR: return "PRCSSR_NBR";
                    case LVL_DEAL_PRD_NM: return "DEAL_PRD_NM";
                    case LVL_MTRL_ID: return "MTRL_ID";
                }

                return String.Empty;
            }
        }

        [IgnoreDataMember()]
        [XmlIgnore()]
        [JsonIgnore]
        public int[] ChildrenPrdMrbSids
        {
            get
            {
                return OpTypeConverter.StringToIntList(this.CHLD_SID_HASH).ToArray();
            }
        }

        [IgnoreDataMember()]
        [XmlIgnore()]
        [JsonIgnore]
        public string[] ChildrenNames
        {
            get
            {
                return (this.CHLD_NM_HASH ?? "")
                    .Split('|')
                    .Select(s => s.Trim())
                    .ToArray();
            }
        }

        [IgnoreDataMember()]
        [XmlIgnore()]
        [JsonIgnore]
        public bool IsIA
        {
            get
            {
                switch ((DEAL_PRD_TYPE ?? "").ToUpper())
                {
                    case "CPU":
                    case "CS":
                    case "EIA CPU":
                    case "EIA CS":
                        return true;
                }

                return false;
            }
        }

        [IgnoreDataMember()]
        [XmlIgnore()]
        [JsonIgnore]
        public bool IsNandSsd
        {
            get
            {
                return ((PRD_CATGRY_NM ?? "").ToUpper() == "NAND (SSD)");
            }
        }

        [IgnoreDataMember()]
        [XmlIgnore()]
        [JsonIgnore]
        public bool IsAtomZ
        {
            get
            {
                return
                    (
                        (PRD_CATGRY_NM ?? "").ToUpper() == "MB"
                        &&
                        (PRCSSR_NBR ?? "").ToUpper().StartsWith("Z")
                    );
            }
        }


        [IgnoreDataMember()]
        [XmlIgnore()]
        [JsonIgnore]
        public string IS_ATOM_Z
        {
            get
            {
                return  ( this.IsAtomZ)?"Y":"N";
                    
            }
        }

        [IgnoreDataMember()]
        [XmlIgnore()]
        [JsonIgnore]
        public string IS_NAND_SSD
        {
            get
            {
                return (this.IsNandSsd)?"Y": "N";
            }
        }


        [IgnoreDataMember()]
        [XmlIgnore()]
        [JsonIgnore]
        public DcsProductStatus ProductStatus
        {
            get
            {
                // Future is hard coded in the SP as well...
                if ((this.PRODUCT_STATUS ?? "") == "Future") { return DcsProductStatus.Future; }

                return this.ACTV_IND ? DcsProductStatus.Active : DcsProductStatus.Inactive;
            }
        }

        //[IgnoreDataMember()]
        //[XmlIgnore()]
        //[JsonIgnore]
        //public string ProductName
        //{
        //    get
        //    {
        //        string strPrdDetails = string.Empty;
        //        if (!string.IsNullOrEmpty(MTRL_ID.ToString()))
        //            strPrdDetails = MTRL_ID.ToString();
        //        else if (!string.IsNullOrEmpty(DEAL_PRD_NM.ToString()))
        //            strPrdDetails = DEAL_PRD_NM.ToString();
        //        else if (!string.IsNullOrEmpty(PRCSSR_NBR.ToString()))
        //            strPrdDetails = PRCSSR_NBR.ToString();
        //        return strPrdDetails;
        //    }
        //}

        [IgnoreDataMember()]
        [XmlIgnore()]
        [JsonIgnore]
        public string ProductStartDt
        {
            get
            {
                return String.Format(" {0:MM/dd/yyyy}", PRD_STRT_DTM);
            }
        }

        [IgnoreDataMember()]
        [XmlIgnore()]
        [JsonIgnore]
        public string ProductEndDt
        {
            get
            {
                return String.Format(" {0:MM/dd/yyyy}", PRD_END_DTM);
            }
        }

        [IgnoreDataMember()]
        [XmlIgnore()]
        [JsonIgnore]
        public string Fsku
        {
            get
            {
                return ProductStatus.ToString();
            }
        }

        [IgnoreDataMember()]
        [XmlIgnore()]
        [JsonIgnore]
        public string CsCpu
        {
            get
            {
                return PRD_CATGRY_NM;
            }
        }

        public  string UniqueID
        {
            get
            {
                return (++_UniqueInt).ToString();
            }
        }

        public  string prdkey
        {
            get
            {
                return PRD_MBR_SID.ToString();
            }
        }
        


        /// <summary>
        /// This is used to populate "MEDIA_LIST" column in pivoted datatable
        /// </summary>
        [IgnoreDataMember()]
        [XmlIgnore()]
        [JsonIgnore]
        public string MEDIA_LIST
        {
            get
            {
                if (
                    //ACTV_IND != false
                    //&&
                    (
                    PRD_CATGRY_NM == "DT"
                    || 
                    PRD_CATGRY_NM == "Mb"
                    || 
                    PRD_CATGRY_NM == "SvrWS"
                    )
                   )
                {
                    return MM_MEDIA_CD.ToString();
                }
                else
                {
                    return string.Empty;
                }
            }
        }
       
        [IgnoreDataMember()]
        [XmlIgnore()]
        [JsonIgnore]
        public string IsValidPrd
        {
            get
            {
                return USER_ACCESS ? "Y" : "N";
            }
        }

        [IgnoreDataMember()]
        [XmlIgnore()]
        [JsonIgnore]
        public string IS_VALID_PRD
        {
            get
            {
                return USER_ACCESS ? "Y" : "N";
            }
        }

        public override string ToString()
        {
            return DisplayName;
        }
    }
}
