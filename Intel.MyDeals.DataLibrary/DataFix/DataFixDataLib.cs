using Intel.MyDeals.IDataLibrary;
using Intel.MyDeals.DataAccessLib;
using Procs = Intel.MyDeals.DataAccessLib.StoredProcedures.MyDeals;
using Intel.Opaque.DBAccess;
using Intel.Opaque;
using System.Collections.Generic;
using Intel.MyDeals.Entities;
using System;
using System.Linq;

namespace Intel.MyDeals.DataLibrary
{
    public class DataFixDataLib : IDataFixDataLib
    {
        public List<DropDownsList> GetDataFixActions()
        {
            List<DropDownsList> ddlActionList = new List<DropDownsList>();
            var cmd = new Procs.dbo.PR_MYDL_GET_DATA_FIX_DROPDOWNS { };

            using (var rdr = DataAccess.ExecuteReader(cmd))
            {
                int IDX_COL_NM = DB.GetReaderOrdinal(rdr, "COL_NM");
                int IDX_COL_SID = DB.GetReaderOrdinal(rdr, "COL_SID");
                int IDX_DRPDWN_TYPE = DB.GetReaderOrdinal(rdr, "DRPDWN_TYPE");

                while (rdr.Read())
                {
                    ddlActionList.Add(new DropDownsList
                    {
                        Text = (IDX_COL_NM < 0 || rdr.IsDBNull(IDX_COL_NM)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_COL_NM),
                        Value = (IDX_COL_SID < 0 || rdr.IsDBNull(IDX_COL_SID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_COL_SID),
                        DdlType = (IDX_DRPDWN_TYPE < 0 || rdr.IsDBNull(IDX_DRPDWN_TYPE)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_DRPDWN_TYPE)
                    });
                }
            }
            return ddlActionList;            
        }

        public List<IncdnDataFix> GetDataFixes()
        {
            List<IncdnDataFix> lstVistex = new List<IncdnDataFix>();
            var cmd = new Procs.dbo.PR_MYDL_GET_INCDN_DATA_FIX  { };

            using (var rdr = DataAccess.ExecuteReader(cmd))
            {
                int IDX_CRE_DTM = DB.GetReaderOrdinal(rdr, "CRE_DTM");
                int IDX_CRE_EMP_NM = DB.GetReaderOrdinal(rdr, "CRE_EMP_NM");
                int IDX_INCDN_MSG = DB.GetReaderOrdinal(rdr, "INCDN_MSG");
                int IDX_INCDN_NBR = DB.GetReaderOrdinal(rdr, "INCDN_NBR");
                int IDX_INCDN_STS = DB.GetReaderOrdinal(rdr, "INCDN_STS");

                while (rdr.Read())
                {
                    lstVistex.Add(new IncdnDataFix
                    {
                        CRE_DTM = (IDX_CRE_DTM < 0 || rdr.IsDBNull(IDX_CRE_DTM)) ? default(System.DateTime) : rdr.GetFieldValue<System.DateTime>(IDX_CRE_DTM),
                        CRE_EMP_NM = (IDX_CRE_EMP_NM < 0 || rdr.IsDBNull(IDX_CRE_EMP_NM)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_CRE_EMP_NM),
                        INCDN_MSG = (IDX_INCDN_MSG < 0 || rdr.IsDBNull(IDX_INCDN_MSG)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_INCDN_MSG),
                        INCDN_NBR = (IDX_INCDN_NBR < 0 || rdr.IsDBNull(IDX_INCDN_NBR)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_INCDN_NBR),
                        INCDN_STS = (IDX_INCDN_STS < 0 || rdr.IsDBNull(IDX_INCDN_STS)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_INCDN_STS)
                    });
                }
            }
            return lstVistex;
        }

        public IncdnActnUpd UpdateDataFix(DataFix data, bool isExecute)
        {
            
            data.CreatedBy = OpUserStack.MyOpUserToken.Usr.Email;
            data.CreatedOn = DateTime.Now;

            in_t_obj_atrb dt1 = new in_t_obj_atrb();
            foreach(var r in data.DataFixAttributes)
            {
                dt1.AddRow(r);
            }            

            in_t_obj_actn dt2 = new in_t_obj_actn();
            foreach (var r in data.DataFixActions)
            {
                dt2.AddRow(r);
            }

            IncdnActnUpd IncdnUpd = new IncdnActnUpd();

            var cmd = new Procs.dbo.PR_MYDL_EXEC_INCDN_DATA_FIX {
                @in_incdn_nbr = data.INCDN_NBR,
                @in_incdn_msg = String.IsNullOrEmpty(data.Message) == true ? "" : data.Message,
                @in_obj_atrb = dt1,
                @in_obj_actn = dt2,
                @in_emp_wwid = OpUserStack.MyOpUserToken.Usr.WWID
            };

            using (var rdr = DataAccess.ExecuteReader(cmd))
            {
                int IDX_RESULT = DB.GetReaderOrdinal(rdr, "RESULT");

                while (rdr.Read())
                {
                    IncdnUpd.RESULT = (IDX_RESULT < 0 || rdr.IsDBNull(IDX_RESULT)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_RESULT);                    
                }
            }
            return IncdnUpd;
        }
    }
}
