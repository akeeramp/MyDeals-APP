using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;
using System.Threading.Tasks;

namespace Intel.MyDeals.Entities.TableTypeParameters
{
    public class in_t_lnkd_srvr_nm: SqlTableValueParameterBase
    {
        private const string DATA_TABLE_NAME = "dbo.t_lnkd_srvr_nm";
        public in_t_lnkd_srvr_nm()
            : base(DATA_TABLE_NAME)
        { }

        public in_t_lnkd_srvr_nm(SerializationInfo info, StreamingContext context)
            : base(DATA_TABLE_NAME, info, context) { }

        protected override void Init()
        {
            //// This order must match EXACTLY the order as it appears in the TYPE definition (lame!)   
            this.Columns.Add("LNKD_SRVR_NM", typeof(string));
            this.Columns.Add("ENVT", typeof(string));
            this.Columns.Add("LNKD_SRVR_CONN_DTL", typeof(string));
            this.Columns.Add("CHK_QUERY", typeof(string));
            this.Columns.Add("LST_CHCKD_DTM", typeof(DateTime)); 
            this.Columns.Add("LS_ERR_TXT", typeof(string));
            this.Columns.Add("ACTV_IND", typeof(bool));
        }

        /// <summary>
        /// Add a rows to the table parameter
        /// </summary>
        public void AddRow(AdminServerDetails itm,string mode)
        {
            if (itm == null) { return; }
            var r = this.NewRow(); 
            r["LNKD_SRVR_NM"] = itm.LNKD_SRVR_NM;
            r["ENVT"] = itm.ENVT;
            r["LNKD_SRVR_CONN_DTL"] = itm.LNKD_SRVR_CONN_DTL;
            r["CHK_QUERY"] = itm.CHK_QUERY;
            r["LST_CHCKD_DTM"] = (mode.ToString() == "Delete") ? (DateTime)System.Data.SqlTypes.SqlDateTime.MinValue : (DateTime)itm.LST_CHCKD_DTM; 
            r["LS_ERR_TXT"] = itm.LS_ERR_TXT;
            r["ACTV_IND"] = itm.ACTV_IND;
            this.Rows.Add(r);
        }
    }
}

