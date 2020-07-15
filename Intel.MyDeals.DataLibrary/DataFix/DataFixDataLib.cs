using Intel.MyDeals.IDataLibrary;
using Intel.MyDeals.DataAccessLib;
using Procs = Intel.MyDeals.DataAccessLib.StoredProcedures.MyDeals;
using Intel.Opaque.DBAccess;
using Intel.Opaque;
using System.Collections.Generic;
using Intel.MyDeals.Entities;

namespace Intel.MyDeals.DataLibrary
{
    public class DataFixDataLib : IDataFixDataLib
    {
        public List<DropDowns> GetDataFixActions()
        {
            List<DropDowns> lstRtn = new List<DropDowns>();
            for (int i = 1; i <= 10; i++)
                lstRtn.Add(new DropDowns() { Value = i.ToString(), Text = string.Format("Action {0}", i) });
            return lstRtn;
        }

        public List<DataFix> GetDataFixes()
        {
            List<DataFix> lstRtn = new List<DataFix>();
            for (int i = 1; i <= 10; i++)
                lstRtn.Add(new DataFix()
                {
                    DataFixAttributes = new List<DataFixAttribute>(),
                    DataFixActions = new List<DataFixAction>(),
                    IncidentNumber = string.Format("Incident {0}", i),
                    Message = string.Format("Test notes for INC {0}", i),
                });
            return lstRtn;
        }

        public DataFix UpdateDataFix(DataFix data)
        {
            return data;
        }
    }
}
