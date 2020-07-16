using Intel.MyDeals.IDataLibrary;
using Intel.MyDeals.DataAccessLib;
using Procs = Intel.MyDeals.DataAccessLib.StoredProcedures.MyDeals;
using Intel.Opaque.DBAccess;
using Intel.Opaque;
using System.Collections.Generic;
using Intel.MyDeals.Entities;
using System;

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
            return new List<DataFix>();
        }

        public DataFix UpdateDataFix(DataFix data, bool isExecute)
        {
            data.CreatedBy = OpUserStack.MyOpUserToken.Usr.Email;
            data.CreatedOn = DateTime.Now;
            return data;
        }
    }
}
