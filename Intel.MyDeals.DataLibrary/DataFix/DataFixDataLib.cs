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
                    ActionId = i,
                    DataToFix = new List<rule>(),
                    IncidentNumber = string.Format("Incident {0}", i),
                    IsActive = true,
                    IsApproved = i % 2 == 0,
                    Notes = string.Format("Test notes for INC {0}", i),
                    RequestId = i
                });
            return lstRtn;
        }

        public DataFix UpdateDataFix(DataFix data)
        {
            data.RequestId = 11;
            return data;
        }
    }
}
