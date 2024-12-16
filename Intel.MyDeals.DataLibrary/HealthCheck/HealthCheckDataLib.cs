using Intel.MyDeals.DataAccessLib;
using Intel.MyDeals.Entities;
using Intel.MyDeals.IDataLibrary;
using Intel.Opaque;
using Intel.Opaque.DBAccess;
using System;
using System.Collections.Generic;
using Procs = Intel.MyDeals.DataAccessLib.StoredProcedures.MyDeals;

namespace Intel.MyDeals.DataLibrary
{
    public class HealthCheckDataLib : IHealthCheckDataLib
    {
        public List<HealthCheckData> GetDbHealthCheckStatus()
        {
            var result = new List<HealthCheckData>();
            var cmd = new Procs.dbo.PR_MYDL_HEALTH_CHCK { };
            try
            {
                using (var rdr = DataAccess.ExecuteReader(cmd))
                {
                    int IDX_DETAILS = DB.GetReaderOrdinal(rdr, "DETAILS");
                    int IDX_RESPONSE = DB.GetReaderOrdinal(rdr, "RESPONSE");
                    int IDX_STATUS = DB.GetReaderOrdinal(rdr, "STATUS");

                    while (rdr.Read())
                    {
                        result.Add(new HealthCheckData
                        {
                            DETAILS = (IDX_DETAILS < 0 || rdr.IsDBNull(IDX_DETAILS)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_DETAILS),
                            RESPONSE = (IDX_RESPONSE < 0 || rdr.IsDBNull(IDX_RESPONSE)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_RESPONSE),
                            STATUS = (IDX_STATUS < 0 || rdr.IsDBNull(IDX_STATUS)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_STATUS)
                        });
                    }
                }
            }
            catch (Exception ex)
            {
                OpLogPerf.Log(ex);
                result.Add(new HealthCheckData
                {
                    STATUS = "Fail",
                    DETAILS = ex.ToString()
                });
            }
            return result;
        }

        public int GetDbaasCpuHealthStatus()
        {
            int result = 0;
            var cmd = new Procs.dbo.PR_MYDL_HIGH_CPU_EMAIL
            {
                @CREATE_TICKET = true ,
                @SEND_MAIL = false
            };
            try
            {
                using (var rdr = DataAccess.ExecuteReader(cmd))
                {
                    int IDX_STATUS = DB.GetReaderOrdinal(rdr, "STATUS_CODE");
                    while (rdr.Read())
                    {
                        result = (IDX_STATUS < 0 || rdr.IsDBNull(IDX_STATUS)) ? 0 : rdr.GetFieldValue<System.Int32>(IDX_STATUS);
                    }
                }
            }
            catch (Exception ex)
            {
                OpLogPerf.Log(ex);
                throw new ApplicationException("An error occurred while getting the DBaaS CPU health status.", ex);
            }
            return result;
        }
    }
}