using System;
using System.Collections.Generic;
using Intel.MyDeals.DataAccessLib;
using Intel.MyDeals.Entities;
using Intel.Opaque;
using Procs = Intel.MyDeals.DataAccessLib.StoredProcedures.MyDeals;

namespace Intel.MyDeals.DataLibrary
{
    public class OtherDataLib
    {

        /// <summary>
        /// Get Basic DB Details
        /// </summary>
        /// <returns></returns>
        public Dictionary<string, string> PingDbDetails()
        {
            OpLogPerf.Log("PingDbDetails");

            var res = new Dictionary<string, string>();
            const string dtFmtMsk = "{0:M/d/yy h:mm tt}";

            try
            {

                using (var rdr = DataAccess.ExecuteReader(new Procs.dbo.PR_PING_DB()))
                {

                    if (rdr.Read())
                    {
                        DateTime tempDate;
                        try
                        {
                            tempDate = (DateTime)rdr["TimeStamp"];
                            res.Add("DB UTC Time", string.Format(dtFmtMsk, tempDate));
                            res.Add("DB Local Time", string.Format(dtFmtMsk, tempDate.AddMinutes((DateTime.Now - DateTime.UtcNow).TotalMinutes)));
                        }
                        catch (Exception ex)
                        {
                            OpLogPerf.Log(ex);
                        }
                        try
                        {
                            res.Add("DB Server", $"{rdr["DbServer"]}");
                        }
                        catch (Exception ex)
                        {
                            OpLogPerf.Log(ex);
                        }
                        try
                        {
                            res.Add("DB Environment", $"{rdr["DbEnv"]}");
                        }
                        catch (Exception ex)
                        {
                            OpLogPerf.Log(ex);
                        }
                        try
                        {
                            res.Add("CDMS DB Version", $"{rdr["CDMS_DB_VERSION"]}");
                        }
                        catch (Exception ex)
                        {
                            OpLogPerf.Log(ex);
                        }

                        try
                        {
                            if (DateTime.TryParse($"{rdr["DB_RESTORE_FROM_PROD_DATE"]}", out tempDate))
                            {
                                res.Add("Restore From Prod Date",
                                    string.Format(dtFmtMsk, tempDate) + GetDeltaTime(tempDate)
                                    );
                            }
                        }
                        catch (Exception ex)
                        {
                            OpLogPerf.Log(ex);
                        }

                        try
                        {
                            string strDt = $"{rdr["CI_BUILD_END"]}";

                            if (!string.IsNullOrEmpty(strDt))
                            {
                                if (DateTime.TryParse(strDt, out tempDate))
                                {
                                    res.Add("Last CI Build Date",
                                        string.Format(dtFmtMsk, tempDate) + GetDeltaTime(tempDate)
                                        );
                                }
                                else
                                {
                                    res.Add("Last CI Build Date", strDt);
                                }
                            }
                        }
                        catch (Exception ex)
                        {
                            OpLogPerf.Log(ex);
                        }

                    }
                }

                if (res.Count == 0)
                {
                    res = new Dictionary<string, string> {{"ERROR", "Unabled to get database details"}};
                }


            }
            catch (Exception ex)
            {
                OpLogPerf.Log(ex);
                res = new Dictionary<string, string>
                {
                    {"ERROR", $"Error getting database details: {ex.Message}"}
                };
                OpLog.EmailError(ex);
            }

            return res;

        }

        private string GetDeltaTime(DateTime dt)
        {
            if (dt <= (new DateTime(1900, 1, 1))) { return String.Empty; }

            var hh = (int)Math.Floor(Math.Abs((DateTime.Now - dt).TotalHours));
            string txt;

            if (hh == 0)
            {
                txt = "Now";
            }
            else if (hh < 24)
            {
                txt = $"{hh} Hour{(hh == 1 ? "" : "s")} Ago";
            }
            else if (hh > (365 * 24 * 2))
            {
                var yy = (int)Math.Floor((double)hh / (24 * 365));
                txt = $"{yy} Year{(yy == 1 ? "" : "s")} Ago";
            }
            else if (hh > (365 * 24))
            {
                var mm = (int)Math.Floor((double)hh / (24 * 30));
                txt = $"{mm} Month{(mm == 1 ? "" : "s")} Ago";
            }
            else
            {
                var dd = (int)Math.Floor((double)hh / 24);
                txt = $"{dd} Day{(dd == 1 ? "" : "s")} Ago";
            }

            if (!string.IsNullOrEmpty(txt))
            {
                txt = $" ({txt})";
            }

            return txt;
        }


        
    }
}
