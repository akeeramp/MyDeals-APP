using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;
using System.Threading.Tasks;

namespace Intel.MyDeals.Entities.TableTypeParameters
{
    public class in_t_mydl_all_envt_dtl: SqlTableValueParameterBase
    {
        private const string DATA_TABLE_NAME = "dbo.t_mydl_all_envt_dtl";
        public in_t_mydl_all_envt_dtl()
            : base(DATA_TABLE_NAME)
        { }

        public in_t_mydl_all_envt_dtl(SerializationInfo info, StreamingContext context)
            : base(DATA_TABLE_NAME, info, context) { }

        protected override void Init()
        {  
            //// This order must match EXACTLY the order as it appears in the TYPE definition (lame!)   
            this.Columns.Add("ENVT_SID", typeof(int));
            this.Columns.Add("ENVT_NM", typeof(string));
            this.Columns.Add("DB_ENVT_NM", typeof(string));
            this.Columns.Add("DB_VANITY_CONN_STR", typeof(string));
            this.Columns.Add("DB_SRVR_DTL", typeof(string));
            this.Columns.Add("GRAFANA_DASHBOARD_LINK", typeof(string));
            this.Columns.Add("MANAGED_OWNERS", typeof(string)); 
            this.Columns.Add("WEBISTE_LINK", typeof(string));
            this.Columns.Add("APP_SERVER", typeof(string));
            this.Columns.Add("WIN_JOBS_HOSTED_MCHN", typeof(string));
            this.Columns.Add("SSIS_SRVR_CONN_STR", typeof(string)); 
            this.Columns.Add("SSIS_CATALOGUE_FOLDER", typeof(string));
            this.Columns.Add("SSIS_CATALOGUE_SRVR_DTL", typeof(string)); 
            this.Columns.Add("ACTV_IND", typeof(bool));
        }

        /// <summary>
        /// Add a rows to the table parameter
        /// </summary>
        public void AddRow(AdminEnvironments itm)
        {
            if (itm == null) { return; }
            var r = this.NewRow();
            r["ENVT_SID"] = itm.ENVT_SID;
            r["ENVT_NM"] = itm.ENVT_NM;
            r["DB_ENVT_NM"] = itm.DB_ENVT_NM;
            r["DB_VANITY_CONN_STR"] = itm.DB_VANITY_CONN_STR;
            r["DB_SRVR_DTL"] = itm.DB_SRVR_DTL;
            r["GRAFANA_DASHBOARD_LINK"] = itm.GRAFANA_DASHBOARD_LINK;
            r["MANAGED_OWNERS"] = itm.MANAGED_OWNERS;
            r["DB_VANITY_CONN_STR"] = itm.DB_VANITY_CONN_STR;
            r["WEBISTE_LINK"] = itm.WEBISTE_LINK;
            r["APP_SERVER"] = itm.APP_SERVER;
            r["WIN_JOBS_HOSTED_MCHN"] = itm.WIN_JOBS_HOSTED_MCHN;
            r["SSIS_SRVR_CONN_STR"] = itm.SSIS_SRVR_CONN_STR;
            r["SSIS_CATALOGUE_FOLDER"] = itm.SSIS_CATALOGUE_FOLDER;
            r["SSIS_CATALOGUE_SRVR_DTL"] = itm.SSIS_CATALOGUE_SRVR_DTL;
            r["ACTV_IND"] = itm.ACTV_IND;
            this.Rows.Add(r);
        }

    }
}
