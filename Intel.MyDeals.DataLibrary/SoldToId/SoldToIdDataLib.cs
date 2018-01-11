using System;
using System.Collections.Generic;
using Intel.MyDeals.DataAccessLib;
using Intel.MyDeals.Entities;
using Intel.MyDeals.IDataLibrary;
using Intel.Opaque.DBAccess;
using Procs = Intel.MyDeals.DataAccessLib.StoredProcedures.MyDeals;

namespace Intel.MyDeals.DataLibrary
{
    public class SoldToIdDataLib : ISoldToIdDataLib
	{
        public SoldToIdDataLib()
        {
        }

		/// <summary>
		/// Gets a list of GetSoldToIds (CUST_ATRB_SID = 2004)
		/// </summary>
		// TODO: we need to get the geos for this (in another sprint)
		public List<SoldToIds> GetSoldToIdList()
		{
			var ret = new List<SoldToIds>();
			using (var rdr = DataAccess.ExecuteReader(new Procs.dbo.PR_MYDL_GET_CUST_SOLD_TO_ID()))
			{
				int IDX_ACTV_IND = DB.GetReaderOrdinal(rdr, "ACTV_IND");
				int IDX_CUST_DIV_NM = DB.GetReaderOrdinal(rdr, "CUST_DIV_NM");
				int IDX_CUST_DIV_NM_SID = DB.GetReaderOrdinal(rdr, "CUST_DIV_NM_SID");
				int IDX_CUST_NM = DB.GetReaderOrdinal(rdr, "CUST_NM");
				int IDX_CUST_NM_SID = DB.GetReaderOrdinal(rdr, "CUST_NM_SID");
				int IDX_SOLD_TO_ID = DB.GetReaderOrdinal(rdr, "SOLD_TO_ID");
				int IDX_SOLD_TO_ID_SID = DB.GetReaderOrdinal(rdr, "SOLD_TO_ID_SID");
                int IDX_GEO_CD = DB.GetReaderOrdinal(rdr, "GEO_CD");
                int IDX_GEO_NM = DB.GetReaderOrdinal(rdr, "GEO_NM");

                while (rdr.Read())
				{
					ret.Add(new SoldToIds
					{
						ACTV_IND = (IDX_ACTV_IND < 0 || rdr.IsDBNull(IDX_ACTV_IND)) ? default(System.Boolean) : rdr.GetFieldValue<System.Boolean>(IDX_ACTV_IND),
						CUST_DIV_NM = (IDX_CUST_DIV_NM < 0 || rdr.IsDBNull(IDX_CUST_DIV_NM)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_CUST_DIV_NM),
						CUST_DIV_NM_SID = (IDX_CUST_DIV_NM_SID < 0 || rdr.IsDBNull(IDX_CUST_DIV_NM_SID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_CUST_DIV_NM_SID),
						CUST_NM = (IDX_CUST_NM < 0 || rdr.IsDBNull(IDX_CUST_NM)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_CUST_NM),
						CUST_NM_SID = (IDX_CUST_NM_SID < 0 || rdr.IsDBNull(IDX_CUST_NM_SID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_CUST_NM_SID),
						SOLD_TO_ID = (IDX_SOLD_TO_ID < 0 || rdr.IsDBNull(IDX_SOLD_TO_ID)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_SOLD_TO_ID),
						SOLD_TO_ID_SID = (IDX_SOLD_TO_ID_SID < 0 || rdr.IsDBNull(IDX_SOLD_TO_ID_SID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_SOLD_TO_ID_SID),
                        GEO_CD = (IDX_GEO_CD < 0 || rdr.IsDBNull(IDX_GEO_CD)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_GEO_CD),
                        GEO_NM = (IDX_GEO_NM < 0 || rdr.IsDBNull(IDX_GEO_NM)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_GEO_NM)
                    });
				} // while
			}
			return ret;
		}



	}
}