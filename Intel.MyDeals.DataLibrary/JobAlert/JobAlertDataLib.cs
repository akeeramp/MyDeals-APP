using Intel.MyDeals.DataAccessLib;
using Intel.MyDeals.Entities;
using Intel.MyDeals.IDataLibraries;
using Intel.Opaque.DBAccess;
using Intel.Opaque;

using Procs = Intel.MyDeals.DataAccessLib.StoredProcedures.MyDeals;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Intel.MyDeals.DataLibrary
{
    public class JobAlertDataLib : IJobAlertDataLib
    {
        
        public string SendJobAlerts()
        {

            Procs.dbo.PR_MYDL_CHECK_JOB_HEALTH cmd = new Procs.dbo.PR_MYDL_CHECK_JOB_HEALTH() { };

            try
            {
                using (var rdr = DataAccess.ExecuteReader(cmd)) { }
            }
            catch (Exception ex)
            {
                OpLogPerf.Log(ex);
                throw new Exception("An error occurred while accessing the database.", ex);
            }

            return "Command Executed Successfully";
        }
    }
}
