using System;
using System.Collections.Generic;
using System.Data;
using System.IO;
using System.Linq;
using System.Text;
using Intel.Opaque;
using Intel.Opaque.Tools;

namespace Intel.MyDeals.DataAccessLib
{

    /// <summary>
    /// DataSet that represents what a deal looks like, extened to help in coding.
    /// </summary>
    public class DSDeal : DSDealBase
    {
        #region Constants

        private const int TABLE_INDEX_DEAL = 0;
        private const int TABLE_INDEX_DATA = 1;

        // Expected XML Data Set Details        
        private const string COL_GUID = "GUID";
        private const string XML_DEAL_TABLE_NAME = "Deal";
        private const string XML_DATA_TABLE_NAME = "Data";

        #endregion

        #region Public Properties

        /// <summary>
        /// The GUID of the batch.  Will be set automatically on creation.
        /// </summary>
        public Guid BTCH_ID { private set; get; }

        /// <summary>
        /// Table that contains the deal details.
        /// </summary>
        public DTDeal Deal
        {
            get
            {
                return base.Tables[TABLE_INDEX_DEAL] as DTDeal;
            }
        }

        /// <summary>
        /// Table that contains the deal data details.
        /// </summary>
        public DTData Data
        {
            get
            {
                return base.Tables[TABLE_INDEX_DATA] as DTData;
            }
        }

        /// <summary>
        /// Messages logged during deal processing.
        /// </summary>
        public OpMsgQueue Messages { set; get; }

#if ENABLE_DEBUG_TIMING
        /// <summary>
        /// XML used to create the DataSet. Feature disabled by default, uncomment as needed.
        /// </summary>
        public string DeubggingXML { set; get; }
#endif

        #endregion

        #region Constructors

        public DSDeal() : this(new OpMsgQueue()) { }
        public DSDeal(OpMsgQueue messages)
            : base()
        {
            Messages = messages ?? (new OpMsgQueue());
        }

        public DSDeal(DataTable deal, DataTable data) : this(deal, data, new OpMsgQueue()) { }
        public DSDeal(DataTable deal, DataTable data, OpMsgQueue messages)
            : this(messages)
        {
#if ENABLE_DEBUG_TIMING
            LogTime.Instance.Log("DSDeal Constructor: Start");
#endif

            Guid btch_id = BTCH_ID = GetBatchGuid(deal, data);
            List<DataColumnConverter> dealConverters = new List<DataColumnConverter>();
            List<DataColumnConverter> dataConverters = new List<DataColumnConverter>();

            var BatchIdConversionFunction = new DataColumnConverter.DataColumnConverterDelegate((sr, sc) =>
            {
                return btch_id;
                /*
                Guid ret;
                    
                if (sr != null && sc != null && Guid.TryParse(String.Format("{0}", sr[sc]), out ret))
                {
                    return ret;
                }
                return Guid.Empty;
                */
            });

            #region Get Deal Column Maps

            if (deal != null && deal.Columns.Count > 0 && deal.Rows.Count > 0)
            {
                dealConverters.Add(GetConverter(deal, this.Deal, "DEALID", DTDeal.ColNm.DEAL_ID, DataColumnConverter.ColumnToIntAction));
                dealConverters.Add(GetConverter(deal, this.Deal, "DEALNBR", DTDeal.ColNm.DEAL_NBR, DataColumnConverter.ColumnToIntAction));
                dealConverters.Add(GetConverter(deal, this.Deal, "BYPASSREDEAL", DTDeal.ColNm.BYPASS_REDEAL, DataColumnConverter.ColumnToBoolAction));
                dealConverters.Add(GetConverter(deal, this.Deal, "INPROCESS", DTDeal.ColNm.IN_PROCESS, DataColumnConverter.ColumnToBoolAction));
                dealConverters.Add(GetConverter(deal, this.Deal, "RETURNPOSITIVE", DTDeal.ColNm.RETURN_POSITIVE, DataColumnConverter.ColumnToBoolAction));
                dealConverters.Add(GetConverter(deal, this.Deal, "RETURNSAVE", DTDeal.ColNm.RETURN_SAVE, DataColumnConverter.ColumnToBoolAction));
                dealConverters.Add(GetConverter(deal, this.Deal, COL_GUID, DTDeal.ColNm.BTCH_ID, BatchIdConversionFunction));

                string[] one_to_one_columns = new string[]
                {
                    DTDeal.ColNm.DEAL_ACTION,
                    DTDeal.ColNm.DEAL_SAVE,
                    DTDeal.ColNm.STAGE,
                    DTDeal.ColNm.WORKFLOW,
                };
                foreach (string cn in one_to_one_columns)
                {
                    dealConverters.Add(GetConverter(deal, this.Deal, cn, cn, null));
                }

                dealConverters = dealConverters
                    .Where(dc => dc != null)
                    .ToList();
            }

            #endregion

            #region Get Data Column Maps

            if (data != null && data.Columns.Count > 0 && data.Rows.Count > 0)
            {
                string[] one_to_one_int_columns = new string[]
                {
                    DTData.ColNm.ATRB_SID,
                    DTData.ColNm.DEAL_ID,
                    DTData.ColNm.DEAL_NBR,
                    DTData.ColNm.GEO_MBR_SID,
                    DTData.ColNm.PRD_MBR_SID,
                    DTData.ColNm.SEG_MBR_SID,
                    DTData.ColNm.LAYER1_SID,
                    DTData.ColNm.LAYER2_SID,
                    DTData.ColNm.LAYER3_SID,
                    DTData.ColNm.LAYER4_SID,
                    DTData.ColNm.LAYER5_SID
                };

                foreach (string cn in one_to_one_int_columns)
                {
                    dataConverters.Add(GetConverter(data, this.Data, cn, cn, DataColumnConverter.ColumnToIntAction));
                }

                string[] one_to_one_text_columns = new string[]
                {
                    DTData.ColNm.DATA_TEXT,
                    DTData.ColNm.ATRB_VAL
                };

                foreach (string cn in one_to_one_text_columns)
                {
                    dataConverters.Add(GetConverter(data, this.Data, cn, cn, null));
                }

                var guid_converter = GetConverter(data, this.Data, COL_GUID, DTData.ColNm.BTCH_ID, BatchIdConversionFunction);
                if (guid_converter != null)
                {
                    // The soruce table must have had a GUID column, great.
                    dataConverters.Add(guid_converter);
                }
                else
                {
                    // Source table did not, but we know we are just going to set the value to the fixed value,
                    // so who cares, just wire it in...
                    dataConverters.Add(new DataColumnConverter(
                            new DataColumn(),
                            this.Data.Columns[DTData.ColNm.BTCH_ID],
                            BatchIdConversionFunction
                            ));
                }


                if (data.Columns.Contains(DTData.ColNm.SRC_CD))
                {
                    // If SRC_CD exists in the souce, just copy it over...
                    dataConverters.Add(GetConverter(data, this.Data,
                        DTData.ColNm.SRC_CD,
                        DTData.ColNm.SRC_CD,
                        null));
                }
                else
                {
                    // A mapper that looks for the column names left over from the ReadXML() into DataSet call
                    // to see what the source of the data was.  In SRC_CD_MAP, the key = seeking column name
                    // and the value = SRC_CD.

                    var SRC_CD_MAP = new Dictionary<string, string>();
                    var SCR_CD_IDX = new SortedDictionary<int, string>();

                    SRC_CD_MAP.Add("ACTIONDATA_ID", "A");
                    SRC_CD_MAP.Add("SAVEDATA_ID", "D");
                    SRC_CD_MAP.Add("PRODUCTS_ID", "P");

                    foreach (var kvp in SRC_CD_MAP.Where(itm => data.Columns.Contains(itm.Key)))
                    {
                        SCR_CD_IDX[data.Columns[kvp.Key].Ordinal] = kvp.Value;
                    }

                    if (SCR_CD_IDX.Count > 0)
                    {
                        dataConverters.Add(new DataColumnConverter(
                            new DataColumn(),
                            this.Data.Columns[DTData.ColNm.SRC_CD],
                            new DataColumnConverter.DataColumnConverterDelegate((sr, sc) =>
                            {
                                if (sr == null) { return null; }

                                foreach (var kvp in SCR_CD_IDX)
                                {
                                    // Possibly TODO: add logic here to classify atrb vs facts

                                    // Check each of the found columns for a value, the first
                                    // one to have a value returns success.
                                    if (!OpServerUtil.IsEmpty(sr[kvp.Key]))
                                    {
                                        return kvp.Value;
                                    }
                                }
                                return null;
                            })));
                    }
                }

                dataConverters = dataConverters
                    .Where(dc => dc != null)
                    .ToList();
            }

            #endregion

#if ENABLE_DEBUG_TIMING
            LogTime.Instance.Log("DSDeal Constructor: Columns Set ({0},{1}), Starting Rows", dealConverters.Count, dataConverters.Count);
#endif

            #region Import Deal Rows
            if (dealConverters.Count > 0)
            {
                this.Deal.BeginLoadData();

                foreach (DataRow dr in deal.Rows)
                {
                    var nr = this.Deal.NewRow() as DRDeal;
                    bool is_success = true;
                    foreach (var cnv in dealConverters)
                    {
                        try
                        {
                            nr[cnv.dest_col] = cnv.Convert(dr);
                        }
                        catch (Exception ex)
                        {
                            // Try to gracefully hand the error so we can send it back to the client.
                            is_success = false;
                            Messages.WriteError(ex);
                        }
                    }
                    if (is_success)
                    {
                        this.Deal.Rows.Add(nr);
                    }
                }

                this.Deal.EndLoadData();
                this.Deal.AcceptChanges();
            }

            #endregion

            #region Import Data Rows

            if (dataConverters.Count > 0)
            {
                this.Data.BeginLoadData();

                foreach (DataRow dr in data.Rows)
                {
                    var nr = this.Data.NewRow() as DRData;
                    bool is_success = true;
                    foreach (var cnv in dataConverters)
                    {
                        try
                        {
                            nr[cnv.dest_col] = cnv.Convert(dr);
                        }
                        catch (Exception ex)
                        {
                            // Try to gracefully hand the error so we can send it back to the client.
                            is_success = false;
                            Messages.WriteError(ex);
                        }
                    }
                    if (is_success)
                    {
                        this.Data.Rows.Add(nr);
                    }
                }

                this.Data.EndLoadData();
                this.Data.AcceptChanges();
            }

            #endregion

#if ENABLE_DEBUG_TIMING
            LogTime.Instance.Log("DSDeal Constructor: Done ({0},{1})", this.Deal.Rows.Count, this.Data.Rows.Count);
#endif
        }

        public static DSDeal Create(DataSet ds)
        {
            return Create(ds, new OpMsgQueue());
        }
        public static DSDeal Create(DataSet ds, OpMsgQueue messages)
        {
            DataTable dtDeal = null;
            DataTable dtData = null;

            if (ds.Tables.Contains(DTDeal.DB_TABLE_NAME))
            {
                dtDeal = ds.Tables[DTDeal.DB_TABLE_NAME];
            }
            else if (ds.Tables.Contains(XML_DEAL_TABLE_NAME))
            {
                dtDeal = ds.Tables[XML_DEAL_TABLE_NAME];
            }

            if (ds.Tables.Contains(DTData.DB_TABLE_NAME))
            {
                dtData = ds.Tables[DTData.DB_TABLE_NAME];
            }
            else if (ds.Tables.Contains(XML_DATA_TABLE_NAME))
            {
                dtData = ds.Tables[XML_DATA_TABLE_NAME];
            }

            return new DSDeal(
                dtDeal,
                dtData
                );
        }
        public static DSDeal Create(ref string xml_data)
        {
            return Create(ref xml_data, new OpMsgQueue());
        }
        public static DSDeal Create(ref string xml_data, OpMsgQueue messages)
        {
            using (DataSet temp_ds = new DataSet())
            {
                using (StringReader sr = new StringReader(xml_data))
                {
                    temp_ds.ReadXml(sr);
                }
#if ENABLE_DEBUG_TIMING
                var ret = Create(temp_ds);
                ret.DeubggingXML = xml_data;
                return ret;
#else
                return Create(temp_ds);
#endif

            }
        }
        public static DSDeal Create(Stream xml_stream)
        {
            return Create(xml_stream, new OpMsgQueue());
        }
        public static DSDeal Create(Stream xml_stream, OpMsgQueue messages)
        {
#if ENABLE_DEBUG_TIMING
            // Slower, but will log out original XML for debugging
            string xml_string = (new StreamReader(xml_stream)).ReadToEnd();
            return Create(ref xml_string, messages);
#else
            using (DataSet temp_ds = new DataSet())
            {
                temp_ds.ReadXml(xml_stream);
                return Create(temp_ds, messages);
            }
#endif
        }

        #endregion

        #region Private Helpers

        // Helper to make getting column converters easier...
        private static DataColumnConverter GetConverter(DataTable src_dt, DataTable dest_dt, string src_col_nm, string dest_col_nm, DataColumnConverter.DataColumnConverterDelegate converter)
        {
            src_col_nm = src_dt.Columns.Contains(src_col_nm) ? src_col_nm : dest_col_nm;

            if (src_dt.Columns.Contains(src_col_nm))
            {
                DataColumn src = src_dt.Columns[src_col_nm];
                DataColumn dest = dest_dt.Columns[dest_col_nm];

                return new DataColumnConverter(
                    src,
                    dest,
                    src.DataType == dest.DataType ? null : converter
                    );
            }

            return null;
        }

        /// <summary>
        /// Get the Guid of the batch extracted from the passed data, looking in deal table first
        /// then data table if necessary
        /// </summary>
        /// <param name="ds"></param>
        /// <param name="guid_column_name"></param>
        /// <returns></returns>
        private static Guid GetBatchGuid(DataTable deal, DataTable data)
        {
            Guid ret = GetBatchGuid(deal, DTDeal.ColNm.BTCH_ID);
            if (ret != Guid.Empty) { return ret; }
            ret = GetBatchGuid(deal, COL_GUID);
            if (ret != Guid.Empty) { return ret; }
            ret = GetBatchGuid(data, DTDeal.ColNm.BTCH_ID);
            if (ret != Guid.Empty) { return ret; }
            ret = GetBatchGuid(data, COL_GUID);
            if (ret != Guid.Empty) { return ret; }
            return Guid.Empty;
        }
        private static Guid GetBatchGuid(DataTable dt, string guid_column_name)
        {
            Guid ret = Guid.Empty;

            if (dt == null || dt.Rows.Count == 0)
            {
                return ret;
            }
            if (!dt.Columns.Contains(guid_column_name))
            {
                return ret;
            }

            foreach (DataRow dr in dt.Rows)
            {
                try
                {
                    string str_guid = String.Format("{0}", dr[guid_column_name]);
                    if (!String.IsNullOrEmpty(str_guid) && Guid.TryParse(str_guid, out ret))
                    {
                        return ret;
                    }
                }
                catch { }
            }

            return ret;
        }

        public override string ToString()
        {
            return String.Format("{0} Deals, {1} Data", Deal.Rows.Count, Data.Rows.Count);
        }

        #endregion

    }

}