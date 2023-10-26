using Intel.MyDeals.DataAccessLib;
using Intel.MyDeals.Entities;
using Intel.MyDeals.IDataLibrary;
using Intel.Opaque.DBAccess;
using System;
using System.Collections.Generic;
using System.Linq;
using Procs = Intel.MyDeals.DataAccessLib.StoredProcedures.MyDeals;

namespace Intel.MyDeals.DataLibrary
{
    public class AsyncProcTriggerDataLib : IAsyncProcTriggerDataLib
    {
        List<AsyncProcTrigger> IAsyncProcTriggerDataLib.GetAsyncProcTriggers()
        {
            var cmd = new Procs.dbo.PR_MYDL_ASYNC_TRIGGERS()
            {
                PROC_NAME = null,
                PROC_DATA = null
            };

            var ret = GetAsyncProcTriggerHandler(cmd);

            return ret;
        }

        List<AsyncProcTrigger> IAsyncProcTriggerDataLib.SaveAsyncProcTrigger(string procName, string procData)
        {
            var cmd = new Procs.dbo.PR_MYDL_ASYNC_TRIGGERS()
            {
                PROC_NAME = procName,
                PROC_DATA = procData
            };

            var ret = GetAsyncProcTriggerHandler(cmd);

            return ret;
        }

        private List<AsyncProcTrigger> GetAsyncProcTriggerHandler(Procs.dbo.PR_MYDL_ASYNC_TRIGGERS cmd)
        {
            var ret = new List<AsyncProcTrigger>();
            using (var reader = DataAccess.ExecuteReader(cmd))
            {
                int IDX_ASYNC_SID = DB.GetReaderOrdinal(reader, "ASYNC_SID");
                int IDX_STATE_TOKEN = DB.GetReaderOrdinal(reader, "STATE_TOKEN");
                int IDX_PROC_NAME = DB.GetReaderOrdinal(reader, "PROC_NAME");
                int IDX_PROC_DATA = DB.GetReaderOrdinal(reader, "PROC_DATA");
                int IDX_STATE = DB.GetReaderOrdinal(reader, "STATE");
                int IDX_START_TIME = DB.GetReaderOrdinal(reader, "START_TIME");
                int IDX_END_TIME = DB.GetReaderOrdinal(reader, "END_TIME");
                int IDX_DURATION = DB.GetReaderOrdinal(reader, "DURATION");

                while (reader.Read())
                {
                    ret.Add(new AsyncProcTrigger
                    {
                        ASYNC_SID = (IDX_ASYNC_SID < 0 || reader.IsDBNull(IDX_ASYNC_SID)) ? default(System.Int32) : reader.GetFieldValue<System.Int32>(IDX_ASYNC_SID),
                        STATE_TOKEN = (IDX_STATE_TOKEN < 0 || reader.IsDBNull(IDX_STATE_TOKEN)) ? default(System.Int32) : reader.GetFieldValue<System.Int32>(IDX_STATE_TOKEN),
                        PROC_NAME = (IDX_PROC_NAME < 0 || reader.IsDBNull(IDX_PROC_NAME)) ? String.Empty : reader.GetFieldValue<System.String>(IDX_PROC_NAME),
                        PROC_DATA = (IDX_PROC_DATA < 0 || reader.IsDBNull(IDX_PROC_DATA)) ? String.Empty : reader.GetFieldValue<System.String>(IDX_PROC_DATA),
                        STATE = (IDX_STATE < 0 || reader.IsDBNull(IDX_STATE)) ? String.Empty : reader.GetFieldValue<System.String>(IDX_STATE),
                        START_TIME = (IDX_START_TIME < 0 || reader.IsDBNull(IDX_START_TIME)) ? default(System.DateTime) : reader.GetFieldValue<System.DateTime>(IDX_START_TIME),
                        END_TIME = (IDX_END_TIME < 0 || reader.IsDBNull(IDX_END_TIME)) ? default(System.DateTime) : reader.GetFieldValue<System.DateTime>(IDX_END_TIME),
                        DURATION = (IDX_DURATION < 0 || reader.IsDBNull(IDX_DURATION)) ? String.Empty : reader.GetFieldValue<System.String>(IDX_DURATION),
                    });
                }
            }
            return ret;
        }
    }
}
