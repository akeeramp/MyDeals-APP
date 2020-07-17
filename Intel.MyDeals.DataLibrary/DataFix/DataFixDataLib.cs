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
            List<DropDowns> lstRtn = new List<DropDowns>();
            lstRtn.Add(new DropDowns() { Text = DealSaveActionCodes.OBJ_DELETE, Value = 207.ToString() });
            lstRtn.Add(new DropDowns() { Text = DealSaveActionCodes.DEAL_ROLLBACK_TO_ACTIVE, Value = 210.ToString() });
            lstRtn.Add(new DropDowns() { Text = DealSaveActionCodes.GEN_TRACKER, Value = 212.ToString() });
            lstRtn.Add(new DropDowns() { Text = DealSaveActionCodes.SYNC_DEALS_MAJOR, Value = 216.ToString() });
            lstRtn.Add(new DropDowns() { Text = DealSaveActionCodes.RUN_MEET_COMP, Value = 217.ToString() });
            lstRtn.Add(new DropDowns() { Text = DealSaveActionCodes.RUN_COST_TEST, Value = 218.ToString() });
            lstRtn.Add(new DropDowns() { Text = DealSaveActionCodes.SAVE, Value = 221.ToString() });
            lstRtn.Add(new DropDowns() { Text = DealSaveActionCodes.SYNC_DEALS_MINOR, Value = 223.ToString() });
            return lstRtn;
        }

        public List<DataFix> GetDataFixes()
        {
            return new List<DataFix>();
        }

        public DataFix UpdateDataFix(DataFix data, bool isExecute)
        {
            data.DataFixActions.ForEach(x =>
            {
                x.TargetObjectIds = string.Join(",", x.TargetObjectIds.Split(',').Where(y => y.Trim() != string.Empty));
            });

            data.CreatedBy = OpUserStack.MyOpUserToken.Usr.Email;
            data.CreatedOn = DateTime.Now;
            return data;
        }
    }
}
