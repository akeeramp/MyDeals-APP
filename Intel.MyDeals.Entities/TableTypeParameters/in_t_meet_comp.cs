using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Runtime.Serialization;

namespace Intel.MyDeals.Entities
{
    public class in_t_meet_comp : SqlTableValueParameterBase
    {
        private const string DATA_TABLE_NAME = "dbo.t_MEET_COMP";

        public in_t_meet_comp()
            : base(DATA_TABLE_NAME)
        { }

        public in_t_meet_comp(SerializationInfo info, StreamingContext context)
            : base(DATA_TABLE_NAME, info, context) { }

        protected override void Init()
        {
            //// This order must match EXACTLY the order as it appears in the TYPE definition (lame!)            
            this.Columns.Add("GRP", typeof(string));            
            this.Columns.Add("CUST_NM_SID", typeof(int));
            this.Columns.Add("DEAL_PRD_TYPE", typeof(string));
            this.Columns.Add("PRD_CAT_NM", typeof(string));
            this.Columns.Add("GRP_PRD_NM", typeof(string));
            this.Columns.Add("GRP_PRD_SID", typeof(int));
            this.Columns.Add("DEAL_OBJ_SID", typeof(int));
            this.Columns.Add("COMP_SKU", typeof(string));
            this.Columns.Add("COMP_PRC", typeof(decimal));
            this.Columns.Add("COMP_BNCH", typeof(decimal));
            this.Columns.Add("IA_BNCH", typeof(decimal));
            this.Columns.Add("COMP_OVRRD_RSN", typeof(string));
            this.Columns.Add("COMP_OVRRD_FLG", typeof(bool));
            this.Columns.Add("MEET_COMP_UPD_FLG", typeof(char));
        }

        /// <summary>
        /// Add a rows to the table parameter
        /// </summary>
        public void AddRow(MeetCompUpdate itm)
        {
            if (itm == null) { return; }
            var r = this.NewRow();            
            r["GRP"] = itm.GRP;                
            r["CUST_NM_SID"] = itm.CUST_NM_SID;
            r["DEAL_PRD_TYPE"] = itm.DEAL_PRD_TYPE;
            r["PRD_CAT_NM"] = itm.PRD_CAT_NM;
            r["GRP_PRD_NM"] = itm.GRP_PRD_NM;
            r["GRP_PRD_SID"] = itm.GRP_PRD_SID;
            r["DEAL_OBJ_SID"] = itm.DEAL_OBJ_SID;
            r["COMP_SKU"] = itm.COMP_SKU;
            r["COMP_PRC"] = itm.COMP_PRC;
            if (itm.COMP_BNCH.HasValue)
                r["COMP_BNCH"] = itm.COMP_BNCH.Value;
            else
                r["COMP_BNCH"] = DBNull.Value;
            if (itm.IA_BNCH.HasValue)
                r["IA_BNCH"] = itm.IA_BNCH.Value;
            else
                r["IA_BNCH"] = DBNull.Value;
            r["COMP_OVRRD_RSN"] = itm.COMP_OVRRD_RSN;
            r["COMP_OVRRD_FLG"] = itm.COMP_OVRRD_FLG;
            r["MEET_COMP_UPD_FLG"] = itm.MEET_COMP_UPD_FLG;           
            this.Rows.Add(r);
        }

        /// <summary>
        /// Add a rows to the table parameter
        /// </summary>
        public void AddRows(IEnumerable<MeetCompUpdate> itms)
        {
            if (itms == null) { return; }

            foreach (var itm in itms)
            {
                var r = this.NewRow();
                r["GRP"] = itm.GRP;
                r["CUST_NM_SID"] = itm.CUST_NM_SID;
                r["DEAL_PRD_TYPE"] = itm.DEAL_PRD_TYPE;
                r["PRD_CAT_NM"] = itm.PRD_CAT_NM;
                r["GRP_PRD_NM"] = itm.GRP_PRD_NM;
                r["GRP_PRD_SID"] = itm.GRP_PRD_SID;
                r["DEAL_OBJ_SID"] = itm.DEAL_OBJ_SID;
                r["COMP_SKU"] = itm.COMP_SKU;
                r["COMP_PRC"] = itm.COMP_PRC;
                if (itm.COMP_BNCH.HasValue)
                    r["COMP_BNCH"] = itm.COMP_BNCH.Value;
                else
                    r["COMP_BNCH"] = DBNull.Value;
                if (itm.IA_BNCH.HasValue)
                    r["IA_BNCH"] = itm.IA_BNCH.Value;
                else
                    r["IA_BNCH"] = DBNull.Value;
                r["COMP_OVRRD_RSN"] = itm.COMP_OVRRD_RSN;
                r["COMP_OVRRD_FLG"] = itm.COMP_OVRRD_FLG;
                r["MEET_COMP_UPD_FLG"] = itm.MEET_COMP_UPD_FLG;
                this.Rows.Add(r);
            }
        }
    }
}