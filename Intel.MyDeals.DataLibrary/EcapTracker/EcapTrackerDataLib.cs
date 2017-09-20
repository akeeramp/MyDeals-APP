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
		public IEnumerable<EcapTrackerData> GetDealDetailsBasedOnTrackerNumbers(List<int> trackerNumbers)
		{
			// TODO: hook up to SP
			return null;
		}

	}
}