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
        public List<DropDowns> GetDataFixActions()
        {
            List<DropDowns> ddlActionList = new List<DropDowns>();
            var cmd = new Procs.dbo.PR_MYDL_GET_DATA_FIX_ACTNS { };

            using (var rdr = DataAccess.ExecuteReader(cmd))
            {
                int IDX_Text = DB.GetReaderOrdinal(rdr, "ACTN_NM");
                int IDX_Value = DB.GetReaderOrdinal(rdr, "ACTN_NM");

                while (rdr.Read())
                {
                    ddlActionList.Add(new DropDowns
                    {
                        Text = (IDX_Text < 0 || rdr.IsDBNull(IDX_Text)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_Text),
                        Value = (IDX_Value < 0 || rdr.IsDBNull(IDX_Value)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_Value)
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
            //Converting Multiple values to String List => String Conversion
            data.DataFixAttributes[0].ATRB_VAL = String.IsNullOrEmpty(data.DataFixAttributes[0].value) == true ? string.Join(",", data.DataFixAttributes[0].values.ToArray()) : data.DataFixAttributes[0].value;
            //data.DataFixActions.ForEach(x =>
            //{
            //    x.OBJ_TYPE_SID = string.Join(",", x.OBJ_TYPE_SID.Split(',').Where(y => y.Trim() != string.Empty));
            //});

            data.CreatedBy = OpUserStack.MyOpUserToken.Usr.Email;
            data.CreatedOn = DateTime.Now;

            in_t_obj_atrb dt1 = new in_t_obj_atrb();
            dt1.AddRow(data.DataFixAttributes[0]);

            in_t_obj_actn dt2 = new in_t_obj_actn();
            dt2.AddRow(data.DataFixActions[0]);


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
