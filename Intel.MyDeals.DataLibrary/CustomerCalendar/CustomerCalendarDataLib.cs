using System;
using Intel.MyDeals.DataAccessLib;
using Intel.MyDeals.Entities;
using Intel.Opaque.DBAccess;
using Procs = Intel.MyDeals.DataAccessLib.StoredProcedures.MyDeals;
using Intel.MyDeals.IDataLibrary;

namespace Intel.MyDeals.DataLibrary
{
    /// <summary>
    /// Data library to fetch the customer calendar
    /// Customers like Dell, HPI and HPE follow different calendar.
    /// </summary>
    public class CustomerCalendarDataLib : ICustomerCalendarDataLib
    {
        /// <summary>
        /// GetCustomerQuarterDetails
        /// </summary>
        /// <param name="customerMemberSid"></param>
        /// <param name="dayInQuarter"></param>
        /// <param name="year"></param>
        /// <param name="quarterNo"></param>
        /// <returns></returns>
        public CustomerQuarterDetails GetCustomerQuarterDetails(int? customerMemberSid
                                                                , DateTime? dayInQuarter
                                                                , short? year
                                                                , short? quarterNo)
        {
            var cmd = new Procs.dbo.PR_MYDL_GET_CUST_CLNDR_QTR();

            if (customerMemberSid != null && customerMemberSid > 0)
            {
                cmd.CUST_MBR_SID = (int)customerMemberSid;
            }

            if (dayInQuarter != null && dayInQuarter > Intel.Opaque.Tools.OpaqueConst.SQL_MIN_DATE)
            {
                cmd.DTM = (DateTime)dayInQuarter;
            }
            else if (year != null && year > 0 && quarterNo != null && quarterNo > 0)
            {
                cmd.YR_NBR = (short)year;
                cmd.QTR_NBR = (short)quarterNo;
            }

            //This helper method is template generated.
            //Refer to that template for details to modify this code.

            using (var rdr = DataAccess.ExecuteReader(cmd))
            {
                int IDX_CUST_MBR_SID = DB.GetReaderOrdinal(rdr, "CUST_MBR_SID");
                int IDX_MIN_END = DB.GetReaderOrdinal(rdr, "MIN_END");
                int IDX_MIN_STRT = DB.GetReaderOrdinal(rdr, "MIN_STRT");
                int IDX_QTR_END = DB.GetReaderOrdinal(rdr, "QTR_END");
                int IDX_QTR_NBR = DB.GetReaderOrdinal(rdr, "QTR_NBR");
                int IDX_QTR_STRT = DB.GetReaderOrdinal(rdr, "QTR_STRT");
                int IDX_YR_NBR = DB.GetReaderOrdinal(rdr, "YR_NBR");

                while (rdr.Read())
                {
                    return new CustomerQuarterDetails
                    {
                        CUST_MBR_SID = (IDX_CUST_MBR_SID < 0 || rdr.IsDBNull(IDX_CUST_MBR_SID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_CUST_MBR_SID),
                        MIN_END = (IDX_MIN_END < 0 || rdr.IsDBNull(IDX_MIN_END)) ? default(System.DateTime) : rdr.GetFieldValue<System.DateTime>(IDX_MIN_END),
                        MIN_STRT = (IDX_MIN_STRT < 0 || rdr.IsDBNull(IDX_MIN_STRT)) ? default(System.DateTime) : rdr.GetFieldValue<System.DateTime>(IDX_MIN_STRT),
                        QTR_END = (IDX_QTR_END < 0 || rdr.IsDBNull(IDX_QTR_END)) ? default(System.DateTime) : rdr.GetFieldValue<System.DateTime>(IDX_QTR_END),
                        QTR_NBR = (IDX_QTR_NBR < 0 || rdr.IsDBNull(IDX_QTR_NBR)) ? default(System.Int16) : rdr.GetFieldValue<System.Int16>(IDX_QTR_NBR),
                        QTR_STRT = (IDX_QTR_STRT < 0 || rdr.IsDBNull(IDX_QTR_STRT)) ? default(System.DateTime) : rdr.GetFieldValue<System.DateTime>(IDX_QTR_STRT),
                        YR_NBR = (IDX_YR_NBR < 0 || rdr.IsDBNull(IDX_YR_NBR)) ? default(System.Int16) : rdr.GetFieldValue<System.Int16>(IDX_YR_NBR)
                    };
                } // while
            }

            return null;
        }
    }
}