using System;
using Intel.MyDeals.DataAccessLib;
using Intel.Opaque;
using Intel.Opaque.DBAccess;
using Procs = Intel.MyDeals.DataAccessLib.StoredProcedures.MyDeals;
using Intel.MyDeals.IDataLibrary;

namespace Intel.MyDeals.DataLibrary
{
    public class DbAuditToolsDataLib: IDbAuditToolsDataLib
    {
        public string GetDbAuditData(string _mode) 
        {
            // Get either environments or objects data back as JSON
            var cmd = new Procs.dbo.PR_MYDL_AUDIT_DB()
            {
                MODE = _mode
            };

            string ret = "";

            try
            {
                using (var rdr = DataAccess.ExecuteReader(cmd))
                {
                    int IDX_RESULTS = DB.GetReaderOrdinal(rdr, "RESULTS");

                    while (rdr.Read())
                    {
                        ret = (IDX_RESULTS < 0 || rdr.IsDBNull(IDX_RESULTS)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_RESULTS);
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

        public string RunDbAudit(string _mode, string _jsonData)
        {
            // Get Audit Table data back as JSON
            var cmd = new Procs.dbo.PR_MYDL_AUDIT_DB()
            {
                MODE = _mode,
                DATA = _jsonData
            };

            string ret = "";

            try
            {
                using (var rdr = DataAccess.ExecuteReader(cmd))
                {
                    int IDX_RESULTS = DB.GetReaderOrdinal(rdr, "RESULTS");

                    while (rdr.Read())
                    {
                        ret = (IDX_RESULTS < 0 || rdr.IsDBNull(IDX_RESULTS)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_RESULTS);
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

        public string GetDbAuditObjectText(string _mode, string _jsonData)
        {
            // Get Audit Object Text back as JSON
            var cmd = new Procs.dbo.PR_MYDL_AUDIT_DB()
            {
                MODE = _mode,
                DATA = _jsonData
            };

            string ret = "";

            try
            {
                using (var rdr = DataAccess.ExecuteReader(cmd))
                {
                    int IDX_RESULTS = DB.GetReaderOrdinal(rdr, "RESULTS");

                    while (rdr.Read())
                    {
                        ret = (IDX_RESULTS < 0 || rdr.IsDBNull(IDX_RESULTS)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_RESULTS);
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

    }
}
