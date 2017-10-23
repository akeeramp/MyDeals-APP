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

namespace Intel.MyDeals.DataLibrary
{
	public class EcapTrackerDataLib : IEcapTrackerDataLib
	{
		public EcapTrackerDataLib()
		{
		}

		/// <summary>
		/// Get a list of possible ECAP Adjustment Tracker Numbers that match filterData parameter
		/// </summary>
		/// <returns>list of ECAP Adjustment Tracker Numbers</returns>
		public IEnumerable<string> GetEcapTrackerList(EcapTrackerFilterData filterData)
		{
			var ret = new List<string>();
			try
			{
				in_t_trkr_atrb dt = new in_t_trkr_atrb();
				dt.AddRow(filterData);
				Procs.dbo.PR_MYDL_GET_TRKR_BY_ATRB cmd = new Procs.dbo.PR_MYDL_GET_TRKR_BY_ATRB
				{
					in_t_trkr_atrb = dt
				};

				using (var rdr = DataAccess.ExecuteReader(cmd))
				{
					int IDX_ATRB_VAL = DB.GetReaderOrdinal(rdr, "BRND_NM");

					while (rdr.Read())
					{
						string rowVal = (IDX_ATRB_VAL < 0 || rdr.IsDBNull(IDX_ATRB_VAL)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_ATRB_VAL);
						ret.Add(rowVal);
					} // while
				}
			}
			catch (Exception ex)
			{
				OpLogPerf.Log(ex);
				throw;
			}
			return ret;
		}

		/// <summary>
		/// Get a list of existing deal details based on ECAP Adjustment Tracker Numbers
		/// </summary>
		/// <returns>list of EcapTrackerData</returns>
		public IEnumerable<EcapTrackerData> GetDealDetailsBasedOnTrackerNumbers(List<string> trackerNumbers, int custId)
		{
			var ret = new List<EcapTrackerData>();
			try
			{
				type_list dt = new type_list();
				dt.AddRows(trackerNumbers);

				Procs.dbo.PR_MYDL_GET_DEAL_BY_TRKR cmd = new Procs.dbo.PR_MYDL_GET_DEAL_BY_TRKR
				{
					in_cust_mbr_sid = custId, 
					in_trkr_no = dt
				};

				using (var rdr = DataAccess.ExecuteReader(cmd))
				{
					int IDX_OBJ_SID = DB.GetReaderOrdinal(rdr, "OBJ_SID");
					int IDX_TRKR_NBR = DB.GetReaderOrdinal(rdr, "TRKR_NBR");
					int IDX_START_DT = DB.GetReaderOrdinal(rdr, "START_DT");
					int IDX_END_DT = DB.GetReaderOrdinal(rdr, "END_DT");
					int IDX_PTR_SYS_PRD = DB.GetReaderOrdinal(rdr, "PTR_SYS_PRD");
					int IDX_GEO_COMBINED = DB.GetReaderOrdinal(rdr, "GEO_COMBINED");
					int IDX_MRKT_SEG = DB.GetReaderOrdinal(rdr, "MRKT_SEG");
					int IDX_MEET_COMP_PRICE_QSTN = DB.GetReaderOrdinal(rdr, "MEET_COMP_PRICE_QSTN");
					int IDX_PAYOUT_BASED_ON = DB.GetReaderOrdinal(rdr, "PAYOUT_BASED_ON");
					int IDX_PROD_INCLDS = DB.GetReaderOrdinal(rdr, "PROD_INCLDS");
					int IDX_PROGRAM_PAYMENT = DB.GetReaderOrdinal(rdr, "PROGRAM_PAYMENT");
					int IDX_TERMS = DB.GetReaderOrdinal(rdr, "TERMS");

					while (rdr.Read())
					{
						ret.Add(new EcapTrackerData
						{
							OBJ_SID = (IDX_OBJ_SID < 0 || rdr.IsDBNull(IDX_OBJ_SID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_OBJ_SID),
							TRKR_NBR = (IDX_TRKR_NBR < 0 || rdr.IsDBNull(IDX_TRKR_NBR)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_TRKR_NBR),
							STRT_DT = (IDX_START_DT < 0 || rdr.IsDBNull(IDX_START_DT)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_START_DT),
							END_DT = (IDX_END_DT < 0 || rdr.IsDBNull(IDX_END_DT)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_END_DT),
							PTR_SYS_PRD = (IDX_PTR_SYS_PRD < 0 || rdr.IsDBNull(IDX_PTR_SYS_PRD)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_PTR_SYS_PRD),
							GEO_COMBINED = (IDX_GEO_COMBINED < 0 || rdr.IsDBNull(IDX_GEO_COMBINED)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_GEO_COMBINED),
							MRKT_SEG = (IDX_MRKT_SEG < 0 || rdr.IsDBNull(IDX_MRKT_SEG)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_MRKT_SEG),
							MEET_COMP_PRICE_QSTN = (IDX_MEET_COMP_PRICE_QSTN < 0 || rdr.IsDBNull(IDX_MEET_COMP_PRICE_QSTN)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_MEET_COMP_PRICE_QSTN),
							PAYOUT_BASED_ON = (IDX_PAYOUT_BASED_ON < 0 || rdr.IsDBNull(IDX_PAYOUT_BASED_ON)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_PAYOUT_BASED_ON),
							PROD_INCLDS = (IDX_PROD_INCLDS < 0 || rdr.IsDBNull(IDX_PROD_INCLDS)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_PROD_INCLDS),
							PROGRAM_PAYMENT = (IDX_PROGRAM_PAYMENT < 0 || rdr.IsDBNull(IDX_PROGRAM_PAYMENT)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_PROGRAM_PAYMENT),
							TERMS = (IDX_TERMS < 0 || rdr.IsDBNull(IDX_TERMS)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_TERMS),
						});
					} // while
				}
			}
			catch (Exception ex)
			{
				OpLogPerf.Log(ex);
				throw;
			}
			return ret;
		}

	}
}