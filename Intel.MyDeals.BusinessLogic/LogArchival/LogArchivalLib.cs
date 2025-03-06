using System;
using System.Collections.Generic;
using System.Linq;
using Intel.MyDeals.DataLibrary;
using Intel.MyDeals.Entities;
using Intel.MyDeals.IBusinessLogic;
using Intel.MyDeals.IDataLibrary;
using Intel.Opaque.Data;


namespace Intel.MyDeals.BusinessLogic
{
    public class LogArchivalLib : ILogArchivalLib
    {
        private readonly ILogArchivalDataLib _logArchivalDataLib;


        public LogArchivalLib(ILogArchivalDataLib logArchivalDataLib)
        {
            _logArchivalDataLib = logArchivalDataLib;
        }
        public LogArchivalLib()
        {
            _logArchivalDataLib = new LogArchivalDataLib();
        }

        public List<LogArchivalDetails> GetLogArchivalDetails()
        {
            return _logArchivalDataLib.GetLogArchivalDetails();
        }

        public List<LogArchival> UpdateLogArchival(string mode, List<LogArchival> data)
        {
            return data == null ? null : _logArchivalDataLib.SetLogArchival(mode, data);
        }
    }
}