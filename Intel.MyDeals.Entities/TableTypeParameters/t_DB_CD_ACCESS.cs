using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Runtime.Serialization;

namespace Intel.MyDeals.Entities.TableTypeParameters
{
    public class t_DB_CD_ACCESS : SqlTableValueParameterBase
    {
        private const string DATA_TABLE_NAME = "dbo.t_DB_CD_ACCESS";

        public t_DB_CD_ACCESS()
            : base(DATA_TABLE_NAME)
        { }

        public t_DB_CD_ACCESS(SerializationInfo info, StreamingContext context)
            : base(DATA_TABLE_NAME, info, context) { }

        protected override void Init()
        {
            //// This order must match EXACTLY the order as it appears in the TYPE definition (lame!)
            this.Columns.Add("ENVT", typeof(string));
            this.Columns.Add("DATABASEUSERNAME", typeof(string));
            this.Columns.Add("ACCESS_JSON", typeof(string));
            this.Columns.Add("ERR_TXT", typeof(string));
            this.Columns.Add("ACTV_IND", typeof(bool));
            //this.Columns.Add("CRE_DTM", typeof(DateTime));
            this.Columns.Add("EMP_WWID", typeof(int));
            //this.Columns.Add("CHG_DTM", typeof(DateTime));
            //this.Columns.Add("CHG_EMP_WWID", typeof(int));
        }

        /// <summary>
        /// Add a rows to the table parameter
        /// </summary>
        public void AddRow(DBAccessEnv itm)
        {
            if (itm == null) { return; }
            var r = this.NewRow();
            r["ENVT"] = itm.ENVT;
            r["DATABASEUSERNAME"] = itm.DATABASEUSERNAME;
            r["ACCESS_JSON"] = itm.ACCESS_JSON;
            r["ERR_TXT"] = itm.ERR_TXT;
            r["ACTV_IND"] = itm.ACTV_IND;
            //r["CRE_DTM"] = itm.CRE_DTM;
            r["EMP_WWID"] = itm.CRE_EMP_WWID;
            //r["CHG_DTM"] = itm.CHG_DTM;
            //r["CHG_EMP_WWID"] = itm.CHG_EMP_WWID;

            this.Rows.Add(r);
        }

        /// <summary>
        /// Add a rows to the table parameter
        /// </summary>
        public void AddRows(IEnumerable<DBAccessEnv> itms)
        {
            if (itms == null) { return; }

            foreach (var itm in itms)
            {
                var r = this.NewRow();
                r["ENVT"] = itm.ENVT;
                r["DATABASEUSERNAME"] = itm.DATABASEUSERNAME;
                r["ACCESS_JSON"] = itm.ACCESS_JSON;
                r["ERR_TXT"] = itm.ERR_TXT;
                r["ACTV_IND"] = itm.ACTV_IND;
                //r["CRE_DTM"] = itm.CRE_DTM;
                r["EMP_WWID"] = itm.CRE_EMP_WWID;
                //r["CHG_DTM"] = itm.CHG_DTM;
                //r["CHG_EMP_WWID"] = itm.CHG_EMP_WWID;

                this.Rows.Add(r);
            }
        }
    }
}
