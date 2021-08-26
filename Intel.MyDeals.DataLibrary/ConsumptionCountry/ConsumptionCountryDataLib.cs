using System;
using System.Collections.Generic;
using Intel.MyDeals.DataAccessLib;
using Intel.MyDeals.Entities;
using Intel.MyDeals.IDataLibrary;
using Intel.Opaque;
using Intel.Opaque.DBAccess;
using Procs = Intel.MyDeals.DataAccessLib.StoredProcedures.MyDeals;
using System.Linq;
using System.Data;
using Intel.Opaque.Tools;


namespace Intel.MyDeals.DataLibrary
{
    public class ConsumptionCountryDataLib : IConsumptionCountryDataLib
    {
        /// <summary>
        /// To get Consumption Country Mapped Data to Admin Screen
        /// </summary>
        /// <param name="custId"></param>
        /// <returns></returns>


        public List<ConsumptionCountry> GetConsumptionCountry()
        {
            var ret = new List<ConsumptionCountry>();
            var cmd = new Procs.dbo.PR_MYDL_CNSMPTN_CTRY { };

            try
            {

                using (var rdr = DataAccess.ExecuteReader(cmd))
                {
                    int IDX_CNSMPTN_CTRY_NM = DB.GetReaderOrdinal(rdr, "CNSMPTN_CTRY_NM");
                    int IDX_GEO_NM = DB.GetReaderOrdinal(rdr, "GEO_NM");

                    while (rdr.Read())
                    {
                        ret.Add(new ConsumptionCountry
                        {
                            CNSMPTN_CTRY_NM = (IDX_CNSMPTN_CTRY_NM < 0 || rdr.IsDBNull(IDX_CNSMPTN_CTRY_NM)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_CNSMPTN_CTRY_NM),
                            GEO_NM = (IDX_GEO_NM < 0 || rdr.IsDBNull(IDX_GEO_NM)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_GEO_NM)
                        });
                    }
                }
            }
            catch (Exception ex)
            {
                OpLogPerf.Log(ex);
                throw;
            }
            return ret;
        }


        public ConsumptionCountry ManageConsumptionCountry(ConsumptionCountry CompCtry, CrudModes type)
        {
            List<ConsumptionCountry> ret = ManageConsumptionCountryExcute(CompCtry, type);
            return ret.FirstOrDefault();

        }

        /// <summary>
        /// This will help to INSERT, UPDATE from Country  table
        /// </summary>
        /// <param name="mode"></param> // CrudModes - Insert / Update 
        /// <param name="data"></param>
        /// <returns></returns>
        public List<ConsumptionCountry> ManageConsumptionCountryExcute(ConsumptionCountry data, CrudModes type)
        {
            var retConsumptionCountry = new List<ConsumptionCountry>();

            using (var rdr = DataAccess.ExecuteReader(new Procs.dbo.PR_MYDL_UPD_CMPT_CTRY
            {
                in_cmpt_ctry_nm = data.CNSMPTN_CTRY_NM,
                in_cmpt_geo_nm = data.GEO_NM,
                in_emp_wwid = OpUserStack.MyOpUserToken.Usr.WWID

            }))
            {
                int IDX_CNSMPTN_CTRY_NM = DB.GetReaderOrdinal(rdr, "CNSMPTN_CTRY_NM");
                int IDX_GEO_NM = DB.GetReaderOrdinal(rdr, "GEO_NM");


                while (rdr.Read())
                {
                    retConsumptionCountry.Add(new ConsumptionCountry
                    {

                        CNSMPTN_CTRY_NM = (IDX_CNSMPTN_CTRY_NM < 0 || rdr.IsDBNull(IDX_CNSMPTN_CTRY_NM)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_CNSMPTN_CTRY_NM),
                        GEO_NM = (IDX_GEO_NM < 0 || rdr.IsDBNull(IDX_GEO_NM)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_GEO_NM)

                    });
                }
            }


            return retConsumptionCountry;
        }





    }
}
