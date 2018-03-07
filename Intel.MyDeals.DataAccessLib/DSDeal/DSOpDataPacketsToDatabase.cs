using System;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Threading.Tasks;
using Intel.Opaque;
using Procs = Intel.MyDeals.DataAccessLib.StoredProcedures.MyDeals;
using Intel.Opaque.DBAccess;
using Intel.Opaque.Tools;

namespace Intel.MyDeals.DataAccessLib
{
    public class DSOpDataPacketsToDatabase
    {
        #region Constructors

        private string ConnectionString { set; get; }

        public DSOpDataPacketsToDatabase(string connectionString) : this(new OpMsgQueue())
        {
            if (String.IsNullOrEmpty(connectionString))
            {
                throw new ArgumentException("Invalid connection string passed to DSDealToDatabase.", "connectionString");
            }

            ConnectionString = connectionString;
        }

        public DSOpDataPacketsToDatabase(OpMsgQueue messageQueue)
        {
            Messages = messageQueue;
            MessageWriter = Messages.GetMessageWriter();
        }

        #endregion

        #region Message Management

        /// <summary>
        /// Messages logged in deal transformation process
        /// </summary>
        public OpMsgQueue Messages { set; get; }

        private OpMsgQueue.MessageDelegate MessageWriter;

        private void WriteMessage(OpMsg.MessageType mt, string msg, params object[] args)
        {
            MessageWriter?.Invoke(mt, msg, args);
        }

        #endregion

        /// <summary>
        /// On failed import, attempt to rollback inserts.
        /// </summary>
        private void AttemptRollbackOnFailedInsert(Guid uqId)
        {

            if (uqId == Guid.Empty)
            {
                WriteMessage(OpMsg.MessageType.Error, "Error rolling back the transaction, invalid batch id.");
                return;
            }
            if (string.IsNullOrEmpty(ConnectionString))
            {
                WriteMessage(OpMsg.MessageType.Error, "Error rolling back the transaction, invalid connection string.");
                return;
            }

            ////DEV_REBUILD_REMOVALS
            // THIS IS A DANGEROUS THING TO REMOVE THAT MIGHT INTRODUCE DATA CORRUPTION, BUT ANCILLA SAID IT NEEDS TO GO.
            //try
            //{
            //    // We have failed, and we have not wired in a rollback, try to semi-rollback here...
            //    using (var cmd = (new Procs.dbo.PR_DEAL_WF_DEL
            //    {
            //        BTCH_ID = uqId,
            //        STG_ONLY = true
            //    }).ToSqlCommand())
            //    {
            //        using (SqlConnection conn = new SqlConnection(ConnectionString))
            //        {
            //            conn.Open();
            //            cmd.Connection = conn;
            //            cmd.ExecuteNonQuery();
            //        } // Doesn't need to use a conn.Close() since the using block does iDispose when completed.
            //    }
            //}
            //catch (Exception ex2)
            //{
            //    WriteMessage(OpMsg.MessageType.Debug, ex2.ToString());
            //    WriteMessage(OpMsg.MessageType.Error, "Error rolling back the transaction.");
            //}
        }

        /// <summary>
        /// Bulk load the passed deal data set into the database, using a MT transaciton to check for
        /// deadlocks and rollback/retry on deadlock as needed.  This is roughly 2x slower than the other
        /// method, but, obviously, more sturdy.
        /// 
        /// This one also fires triggers after insert as needed.
        /// </summary>
        /// <param name="ds">DataSet containing deal import data</param>
        public void BulkLoadDealDataSetToWipTablesInTransaction(DSDeal ds)
        {
            if (String.IsNullOrEmpty(ConnectionString))
            {
                throw new ArgumentException("Connection String is required.", "connectionString");
            }
            if (ds == null || ds.Tables.Count == 0)
            {
                throw new ArgumentException("A valid Deal DataSet is required.", "ds");
            }

            // Since each table is distinct, we should be able to load in parallel.
            Parallel.ForEach<DataTable>(ds.Tables.Cast<DataTable>().AsParallel(), dt =>
            {
                using (SqlConnection conn = new SqlConnection(ConnectionString))
                {
                    conn.Open();

                    int retryCount = 5; // Through trial and error, this seems to be the right number

                    while (retryCount > 0)
                    {
                        using (SqlTransaction trns = conn.BeginTransaction())
                        {
                            try
                            {
                                // This is the required constructor to use the transaction...
                                using (var copy = new SqlBulkCopy(
                                    ConnectionString,
                                    SqlBulkCopyOptions.UseInternalTransaction | SqlBulkCopyOptions.FireTriggers
                                    ))
                                {
                                    foreach (DataColumn dc in dt.Columns)
                                    {
                                        copy.ColumnMappings.Add(new SqlBulkCopyColumnMapping(dc.ColumnName, dc.ColumnName));
                                    }
                                    copy.DestinationTableName = dt.TableName;
                                    copy.BulkCopyTimeout = 180;
                                    copy.WriteToServer(dt);
                                }

                                retryCount = 0;
                                trns.Commit();

                            }
                            catch (SqlException ex)
                            {
                                retryCount--;
                                trns.Rollback();

                                if (ex.Message.ToLower().Contains("deadlock"))
                                {
                                    if (retryCount <= 0)
                                    {
                                        throw;
                                    }
                                    WriteMessage(OpMsg.MessageType.Debug, "Deadlock experienced while saving table [{0}]. Retries Left: {1}.", dt.TableName, retryCount);
                                    System.Threading.Thread.Sleep(500); // Try to wait for the other thing to finish.
                                }
                                else
                                {
                                    throw;
                                }
                            }
                        }
                    }
                    conn.Close(); // Remove sleeping DB processes
                }
            });
        }

        /// <summary>
        /// Import data into SQL Server.
        /// Each DataTable.TableName must match exactly the server table name.
        /// Each DataTable.Columns[].ColumnName must match the column name exactly.
        /// </summary>
        /// <param name="ds">DataSet to import</param>
        public void BulkImportDataSet(DataSet ds)
        {
#if DEBUG
            DataSetDebug.DataSetToSqlScriptOutput(ds);
#endif

            if (String.IsNullOrEmpty(ConnectionString))
            {
                throw new ArgumentException("Connection String is required.", "connectionString");
            }

            // Since each table is distinct, we should be able to load in parallel.
            OpParallelWait.ForEach<DataTable>(ds.Tables.Cast<DataTable>(), dt =>
            {
                using (SqlConnection conn = new SqlConnection(ConnectionString))
                {
                    conn.Open();
                    // note that this is not wired up to fire trigger, just FYI
                    using (var copy = new SqlBulkCopy(conn))
                    {
                        foreach (DataColumn dc in dt.Columns.Cast<DataColumn>().Where(c => c.ColumnMapping != MappingType.Hidden))
                        {
                            copy.ColumnMappings.Add(new SqlBulkCopyColumnMapping(
                                dc.ColumnName,
                                dc.ColumnName
                                ));
                        }
                        copy.DestinationTableName = dt.TableName;
                        copy.BulkCopyTimeout = Int32.MaxValue;
                        copy.WriteToServer(dt);

                        /*
                        // Useful for debugging...
                        foreach (DataRow row in dt.Rows)
                        {
                            try
                            {
                                var rows = new DataRow[] { row };
                                copy.WriteToServer(rows);
                            }
                            catch (Exception ex)
                            {
                                throw;
                            }
                        }
                        */

                    }
                    conn.Close(); // Remove sleeping DB processes
                }
            }
            );
        }

        /// <summary>
        /// Faster raw insert method to push deal data to the database, but does no transaction or rollback.
        /// That should be okay since the xml cleanup job should clear out the table on failure.
        /// </summary>
        /// <param name="ds">DataSet containing deal import data</param>
        public void BulkLoadDealDataSetToWipTables(DSDeal ds)
        {
            if (ds == null || ds.Tables.Count == 0)
            {
                throw new ArgumentException("A valid Deal DataSet is required.", "ds");
            }

            try
            {
                BulkImportDataSet(ds);
            }
            catch (Exception ex)
            {
                WriteMessage(OpMsg.MessageType.Debug, ex.ToString());
                WriteMessage(OpMsg.MessageType.Error, "Import deal data failed, attempting rollback.");

                AttemptRollbackOnFailedInsert(
                    ds.BTCH_ID
                    );

                throw;
            }
        }


    }
}