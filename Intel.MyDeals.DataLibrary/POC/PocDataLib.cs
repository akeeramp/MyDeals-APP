using System;
using System.Collections.Generic;
using System.Data;
using Intel.MyDeals.DataAccessLib;
using Intel.MyDeals.Entities;
using Intel.Opaque;
using Intel.Opaque.DBAccess;
using Procs = Intel.MyDeals.DataAccessLib.StoredProcedures.MyDeals;

namespace Intel.MyDeals.DataLibrary
{
    public class PocDataLib
    {
        /// <summary>
        /// Get POC Emp
        /// </summary>
        /// <returns>collection of employee data</returns>
        public IEnumerable<PocEmp> GetPocEmp()
        {
            OpLogPerf.Log("GetPocEmp");

            var ret = new List<PocEmp>();

            var cmd = new Procs.dbo.PR_GET_POC_EMP();

            try
            {
                using (var rdr = DataAccess.ExecuteReader(cmd))
                {
                    int IDX_emp_sid = DB.GetReaderOrdinal(rdr, "emp_sid");
                    int IDX_first_nm = DB.GetReaderOrdinal(rdr, "first_nm");
                    int IDX_last_nm = DB.GetReaderOrdinal(rdr, "last_nm");

                    while (rdr.Read())
                    {
                        ret.Add(new PocEmp
                        {
                            emp_sid = (IDX_emp_sid < 0 || rdr.IsDBNull(IDX_emp_sid)) ? default(Nullable<System.Int32>) : rdr.GetFieldValue<Nullable<System.Int32>>(IDX_emp_sid),
                            first_nm = (IDX_first_nm < 0 || rdr.IsDBNull(IDX_first_nm)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_first_nm),
                            last_nm = (IDX_last_nm < 0 || rdr.IsDBNull(IDX_last_nm)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_last_nm)
                        });
                    }
                }
            }
            catch (Exception ex)
            {
                OpLogPerf.Log(ex);
            }
            return ret;

        }



        /// <summary>
        /// Set POC Emp
        /// </summary>
        /// <returns>INSERT / UPDATE employee data</returns>
        public void SetPocEmp(PocEmp pocEmp)
        {
            OpLogPerf.Log("SetPocEmp");

            DataSet dsCheckConstraintErrors = null;
            try
            {
                DataAccess.ExecuteDataSet(new Procs.dbo.PR_SET_POC_EMP
                {
                    emp_sid = (int) pocEmp.emp_sid,
                    first_nm = pocEmp.first_nm,
                    last_nm = pocEmp.last_nm
                }, null, out dsCheckConstraintErrors);
            }
            catch (Exception)
            {
                if (dsCheckConstraintErrors != null && dsCheckConstraintErrors.Tables.Count > 0)
                {
                    // DO SOME ERROR HANDLING
                }
                throw;
            }

        }

        /// <summary>
        /// Delete POC Emp
        /// </summary>
        /// <returns></returns>
        public void DelPocEmp(int empSid)
        {
            OpLogPerf.Log("DelPocEmp");

            DataSet dsCheckConstraintErrors = null;
            try
            {
                DataAccess.ExecuteDataSet(new Procs.dbo.PR_DEL_POC_EMP
                {
                    emp_sid = empSid
                }, null, out dsCheckConstraintErrors);
            }
            catch (Exception)
            {
                if (dsCheckConstraintErrors != null && dsCheckConstraintErrors.Tables.Count > 0)
                {
                    // DO SOME ERROR HANDLING
                }
                throw;
            }
        }


    }
}
