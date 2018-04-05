using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Xml.Serialization;
using Intel.Opaque.Tools;

namespace Intel.MyDeals.Entities
{
    public partial class DcsDealProduct
    {
        private const int LVL_ALL_PRD_NM = 7001;
        private const int LVL_DEAL_PRD_TYPE = 7002;
        private const int LVL_PRD_CATGRY_NM = 7003;
        private const int LVL_BRND_NM = 7004;
        private const int LVL_FMLY_NM = 7005;
        private const int LVL_PRCSSR_NBR = 7006;
        private const int LVL_DEAL_PRD_NM = 7007;
        private const int LVL_MTRL_ID = 7008;

        [IgnoreDataMember()]
        [XmlIgnore()]
        public string DisplayName
        {
            get
            {
                switch (this.PRD_ATRB_SID)
                {
                    case LVL_ALL_PRD_NM: return this.ALL_PRD_NM;
                    case LVL_DEAL_PRD_TYPE: return this.DEAL_PRD_TYPE;
                    case LVL_PRD_CATGRY_NM: return this.PRD_CATGRY_NM;
                    case LVL_BRND_NM: return this.BRND_NM;
                    case LVL_FMLY_NM: return this.FMLY_NM;
                    case LVL_PRCSSR_NBR: return this.PRCSSR_NBR;
                    case LVL_DEAL_PRD_NM: return this.DEAL_PRD_NM;
                    case LVL_MTRL_ID: return this.MTRL_ID;
                }

                return String.Empty;
            }
        }

        [IgnoreDataMember()]
        [XmlIgnore()]
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
        public string DisplayLevel
        {
            get
            {
                switch (this.PRD_ATRB_SID)
                {
                    case LVL_ALL_PRD_NM: return "All";
                    case LVL_DEAL_PRD_TYPE: return "Deal Product Type";
                    case LVL_PRD_CATGRY_NM: return "Product Vertical";
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
        public int[] ChildrenPrdMrbSids
        {
            get
            {
                return OpTypeConverter.StringToIntList(this.CHLD_SID_HASH).ToArray();
            }
        }

        [IgnoreDataMember()]
        [XmlIgnore()]
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

        public override string ToString()
        {
            return DisplayName;
        }
    }
}