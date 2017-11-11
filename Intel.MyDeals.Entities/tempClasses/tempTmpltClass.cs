using System;
using System.Collections.Generic;
using System.Linq;

namespace Intel.MyDeals.Entities
{


    //-------------------------------------------------------------------------------------------

    namespace DCSAtrbLookup
    {

        ///<summary>
        /// ATRB_SID: 3004
        ///</summary>
        public static class DEAL_TYPE_CD_SID_VAL
        {
            ///<summary>
            /// ID: 1
            ///</summary>
            public const string ALL_DEALS = @"All Deals";
            ///<summary>
            /// ID: 2
            ///</summary>
            public const string TENDER = @"TENDER";
            ///<summary>
            /// ID: 6
            ///</summary>
            public const string KIT = @"KIT";
            ///<summary>
            /// ID: 3
            ///</summary>
            public const string ECAP = @"ECAP";
            ///<summary>
            /// ID: 4
            ///</summary>
            public const string PROGRAM = @"PROGRAM";
            ///<summary>
            /// ID: 5
            ///</summary>
            public const string VOL_TIER = @"VOL TIER";

            ///<summary>
            /// All values associated with this lookup
            ///</summary>
            public static readonly string[] Values = { @"All Deals", @"TENDER", @"KIT", @"ECAP", @"PROGRAM", @"VOL TIER" };

            ///<summary>
            /// Keyed values associated with the lookup
            ///</summary>
            public static readonly Dictionary<int, string> Dict = new Dictionary<int, string>(){
                {1, @"All Deals"},
                {2, @"TENDER"},
                {6, @"KIT"},
                {3, @"ECAP"},
                {4, @"PROGRAM"},
                {5, @"VOL TIER"}
            };

            ///<summary>
            /// Try to get named value from an ID, or String.Empty on error
            ///</summary>
            public static string TryGetValue(int id)
            {
                string ret;
                if (Dict.TryGetValue(id, out ret))
                {
                    return ret;
                }
                return String.Empty;
            }

            ///<summary>
            /// Try to get and ID from a name (case insensitive), or null on error.
            ///</summary>
            public static int? TryGetId(string value)
            {
                var v = value.Trim().ToLower();
                foreach (var kvp in Dict.Where(itm => itm.Value.Trim().ToLower() == v))
                {
                    return kvp.Key;
                }
                return null;
            }

        }

        ///<summary>
        /// ATRB_SID: 3628
        ///</summary>
        public static class RPU_CALC_TYPE_VAL
        {
            ///<summary>
            /// ID: 1
            ///</summary>
            public const string SPIFF = @"SPIFF";
            ///<summary>
            /// ID: 2
            ///</summary>
            public const string VIP = @"VIP";

            ///<summary>
            /// All values associated with this lookup
            ///</summary>
            public static readonly string[] Values = { @"SPIFF", @"VIP" };

            ///<summary>
            /// Keyed values associated with the lookup
            ///</summary>
            public static readonly Dictionary<int, string> Dict = new Dictionary<int, string>(){
                {1, @"SPIFF"},
                {2, @"VIP"}
            };

            ///<summary>
            /// Try to get named value from an ID, or String.Empty on error
            ///</summary>
            public static string TryGetValue(int id)
            {
                string ret;
                if (Dict.TryGetValue(id, out ret))
                {
                    return ret;
                }
                return String.Empty;
            }

            ///<summary>
            /// Try to get and ID from a name (case insensitive), or null on error.
            ///</summary>
            public static int? TryGetId(string value)
            {
                var v = value.Trim().ToLower();
                foreach (var kvp in Dict.Where(itm => itm.Value.Trim().ToLower() == v))
                {
                    return kvp.Key;
                }
                return null;
            }

        }

        ///<summary>
        /// ATRB_SID: 3632
        ///</summary>
        public static class PLI_CAP_TYPE_VAL
        {
            ///<summary>
            /// ID: 1
            ///</summary>
            public const string BUY_THROUGH_ODM = @"Buy through ODM";

            ///<summary>
            /// All values associated with this lookup
            ///</summary>
            public static readonly string[] Values = { @"Buy through ODM" };

            ///<summary>
            /// Keyed values associated with the lookup
            ///</summary>
            public static readonly Dictionary<int, string> Dict = new Dictionary<int, string>(){
                {1, @"Buy through ODM"}
            };

            ///<summary>
            /// Try to get named value from an ID, or String.Empty on error
            ///</summary>
            public static string TryGetValue(int id)
            {
                string ret;
                if (Dict.TryGetValue(id, out ret))
                {
                    return ret;
                }
                return String.Empty;
            }

            ///<summary>
            /// Try to get and ID from a name (case insensitive), or null on error.
            ///</summary>
            public static int? TryGetId(string value)
            {
                var v = value.Trim().ToLower();
                foreach (var kvp in Dict.Where(itm => itm.Value.Trim().ToLower() == v))
                {
                    return kvp.Key;
                }
                return null;
            }

        }

        ///<summary>
        /// ATRB_SID: 5001
        ///</summary>
        public static class SEG_MBR_SID_VAL
        {
            ///<summary>
            /// ID: 10
            ///</summary>
            public const string ALL = @"All";
            ///<summary>
            /// ID: 9
            ///</summary>
            public const string BLENDED = @"Blended";
            ///<summary>
            /// ID: 15
            ///</summary>
            public const string COMMUNICATIONS = @"Communications";
            ///<summary>
            /// ID: 2
            ///</summary>
            public const string CONSUMER = @"Consumer";
            ///<summary>
            /// ID: 16
            ///</summary>
            public const string CONSUMER_ELECTRONICS_SPD = @"Consumer Electronics(SPD)";
            ///<summary>
            /// ID: 12
            ///</summary>
            public const string CONSUMER_NO_PULL = @"Consumer No Pull";
            ///<summary>
            /// ID: 13
            ///</summary>
            public const string CONSUMER_RETAIL_PULL = @"Consumer Retail Pull";
            ///<summary>
            /// ID: 3
            ///</summary>
            public const string CORP = @"Corp";
            ///<summary>
            /// ID: 8
            ///</summary>
            public const string EDUCATION = @"Education";
            ///<summary>
            /// ID: 6
            ///</summary>
            public const string EMBEDDED = @"Embedded";
            ///<summary>
            /// ID: 7
            ///</summary>
            public const string GOVERNMENT = @"Government";
            ///<summary>
            /// ID: 11
            ///</summary>
            public const string LAD = @"LAD";
            ///<summary>
            /// ID: 4
            ///</summary>
            public const string RETAIL = @"Retail";
            ///<summary>
            /// ID: 5
            ///</summary>
            public const string SMB = @"SMB";
            ///<summary>
            /// ID: 14
            ///</summary>
            public const string STORAGE = @"Storage";

            ///<summary>
            /// All values associated with this lookup
            ///</summary>
            public static readonly string[] Values = { @"All", @"Blended", @"Communications", @"Consumer", @"Consumer Electronics(SPD)", @"Consumer No Pull", @"Consumer Retail Pull", @"Corp", @"Education", @"Embedded", @"Government", @"LAD", @"Retail", @"SMB", @"Storage" };

            ///<summary>
            /// Keyed values associated with the lookup
            ///</summary>
            public static readonly Dictionary<int, string> Dict = new Dictionary<int, string>(){
                {10, @"All"},
                {9, @"Blended"},
                {15, @"Communications"},
                {2, @"Consumer"},
                {16, @"Consumer Electronics(SPD)"},
                {12, @"Consumer No Pull"},
                {13, @"Consumer Retail Pull"},
                {3, @"Corp"},
                {8, @"Education"},
                {6, @"Embedded"},
                {7, @"Government"},
                {11, @"LAD"},
                {4, @"Retail"},
                {5, @"SMB"},
                {14, @"Storage"}
            };

            ///<summary>
            /// Try to get named value from an ID, or String.Empty on error
            ///</summary>
            public static string TryGetValue(int id)
            {
                string ret;
                if (Dict.TryGetValue(id, out ret))
                {
                    return ret;
                }
                return String.Empty;
            }

            ///<summary>
            /// Try to get and ID from a name (case insensitive), or null on error.
            ///</summary>
            public static int? TryGetId(string value)
            {
                var v = value.Trim().ToLower();
                foreach (var kvp in Dict.Where(itm => itm.Value.Trim().ToLower() == v))
                {
                    return kvp.Key;
                }
                return null;
            }

        }

        ///<summary>
        /// ATRB_SID: 5002
        ///</summary>
        public static class GEO_MBR_SID_VAL
        {
            ///<summary>
            /// ID: 7
            ///</summary>
            public const string APAC = @"APAC";
            ///<summary>
            /// ID: 6
            ///</summary>
            public const string ASMO = @"ASMO";
            ///<summary>
            /// ID: 5
            ///</summary>
            public const string EMEA = @"EMEA";
            ///<summary>
            /// ID: 2
            ///</summary>
            public const string IJKK = @"IJKK";
            ///<summary>
            /// ID: 3
            ///</summary>
            public const string OTHER = @"Other";
            ///<summary>
            /// ID: 4
            ///</summary>
            public const string PRC = @"PRC";
            ///<summary>
            /// ID: 1
            ///</summary>
            public const string WORLDWIDE = @"Worldwide";

            ///<summary>
            /// All values associated with this lookup
            ///</summary>
            public static readonly string[] Values = { @"APAC", @"ASMO", @"EMEA", @"IJKK", @"Other", @"PRC", @"Worldwide" };

            ///<summary>
            /// Keyed values associated with the lookup
            ///</summary>
            public static readonly Dictionary<int, string> Dict = new Dictionary<int, string>(){
                {7, @"APAC"},
                {6, @"ASMO"},
                {5, @"EMEA"},
                {2, @"IJKK"},
                {3, @"Other"},
                {4, @"PRC"},
                {1, @"Worldwide"}
            };

            ///<summary>
            /// Try to get named value from an ID, or String.Empty on error
            ///</summary>
            public static string TryGetValue(int id)
            {
                string ret;
                if (Dict.TryGetValue(id, out ret))
                {
                    return ret;
                }
                return String.Empty;
            }

            ///<summary>
            /// Try to get and ID from a name (case insensitive), or null on error.
            ///</summary>
            public static int? TryGetId(string value)
            {
                var v = value.Trim().ToLower();
                foreach (var kvp in Dict.Where(itm => itm.Value.Trim().ToLower() == v))
                {
                    return kvp.Key;
                }
                return null;
            }

        }

        ///<summary>
        /// ATRB_SID: 10 // Used to be 5003
        ///</summary>
        public static class PRD_BUCKT_SID_VAL
        {
            ///<summary>
            /// ID: -1
            ///</summary>
            public const string KIT = @"KIT";
            ///<summary>
            /// ID: 0
            ///</summary>
            public const string PRIMARY = @"Primary";
            ///<summary>
            /// ID: 1
            ///</summary>
            public const string SECONDARY1 = @"Secondary1";
            ///<summary>
            /// ID: 2
            ///</summary>
            public const string SECONDARY2 = @"Secondary2";
            ///<summary>
            /// ID: 3
            ///</summary>
            public const string SECONDARY3 = @"Secondary3";
            ///<summary>
            /// ID: 4
            ///</summary>
            public const string SECONDARY4 = @"Secondary4";

            ///<summary>
            /// All values associated with this lookup
            ///</summary>
            public static readonly string[] Values = { @"KIT", @"Primary", @"Secondary1", @"Secondary2", @"Secondary3", @"Secondary4" };

            ///<summary>
            /// Keyed values associated with the lookup
            ///</summary>
            public static readonly Dictionary<int, string> Dict = new Dictionary<int, string>(){
                {-1, @"KIT"},
                {0, @"Primary"},
                {1, @"Secondary1"},
                {2, @"Secondary2"},
                {3, @"Secondary3"},
                {4, @"Secondary4"}
            };

            ///<summary>
            /// Try to get named value from an ID, or String.Empty on error
            ///</summary>
            public static string TryGetValue(int id)
            {
                string ret;
                if (Dict.TryGetValue(id, out ret))
                {
                    return ret;
                }
                return String.Empty;
            }

            ///<summary>
            /// Try to get and ID from a name (case insensitive), or null on error.
            ///</summary>
            public static int? TryGetId(string value)
            {
                var v = value.Trim().ToLower();
                foreach (var kvp in Dict.Where(itm => itm.Value.Trim().ToLower() == v))
                {
                    return kvp.Key;
                }
                return null;
            }

        }

        ///<summary>
        /// ATRB_SID: 5004
        ///</summary>
        public static class PGM_TYPE_SID_VAL
        {
            ///<summary>
            /// ID: 9
            ///</summary>
            public const string CHAMP = @"CHAMP";
            ///<summary>
            /// ID: 2
            ///</summary>
            public const string DEBIT_MEMO = @"Debit Memo";
            ///<summary>
            /// ID: 1
            ///</summary>
            public const string ECAP_ADJ = @"ECAP Adj";
            ///<summary>
            /// ID: 8
            ///</summary>
            public const string MCP = @"MCP";
            ///<summary>
            /// ID: 4
            ///</summary>
            public const string MDF = @"MDF";
            ///<summary>
            /// ID: 5
            ///</summary>
            public const string NRE = @"NRE";
            ///<summary>
            /// ID: 3
            ///</summary>
            public const string OTHER = @"Other";
            ///<summary>
            /// ID: 7
            ///</summary>
            public const string SEED = @"SEED";
            ///<summary>
            /// ID: 6
            ///</summary>
            public const string TENDER = @"Tender";

            ///<summary>
            /// All values associated with this lookup
            ///</summary>
            public static readonly string[] Values = { @"CHAMP", @"Debit Memo", @"ECAP Adj", @"MCP", @"MDF", @"NRE", @"Other", @"SEED", @"Tender" };

            ///<summary>
            /// Keyed values associated with the lookup
            ///</summary>
            public static readonly Dictionary<int, string> Dict = new Dictionary<int, string>(){
                {9, @"CHAMP"},
                {2, @"Debit Memo"},
                {1, @"ECAP Adj"},
                {8, @"MCP"},
                {4, @"MDF"},
                {5, @"NRE"},
                {3, @"Other"},
                {7, @"SEED"},
                {6, @"Tender"}
            };

            ///<summary>
            /// Try to get named value from an ID, or String.Empty on error
            ///</summary>
            public static string TryGetValue(int id)
            {
                string ret;
                if (Dict.TryGetValue(id, out ret))
                {
                    return ret;
                }
                return String.Empty;
            }

            ///<summary>
            /// Try to get and ID from a name (case insensitive), or null on error.
            ///</summary>
            public static int? TryGetId(string value)
            {
                var v = value.Trim().ToLower();
                foreach (var kvp in Dict.Where(itm => itm.Value.Trim().ToLower() == v))
                {
                    return kvp.Key;
                }
                return null;
            }

        }

        ///<summary>
        /// ATRB_SID: 5006
        ///</summary>
        public static class PRD_ATRB_SID_VAL
        {
            ///<summary>
            /// ID: 1
            ///</summary>
            public const string ALL_PRODUCT_ATTRIBUTES = @"All Product Attributes";
            ///<summary>
            /// ID: 2
            ///</summary>
            public const string CORE = @"Core";
            ///<summary>
            /// ID: 3
            ///</summary>
            public const string DP = @"DP";
            ///<summary>
            /// ID: 4
            ///</summary>
            public const string DT = @"DT";
            ///<summary>
            /// ID: 5
            ///</summary>
            public const string IPF = @"IPF";
            ///<summary>
            /// ID: 6
            ///</summary>
            public const string LCIA = @"LCIA";
            ///<summary>
            /// ID: 7
            ///</summary>
            public const string LPIA = @"LPIA";
            ///<summary>
            /// ID: 8
            ///</summary>
            public const string MB = @"Mb";
            ///<summary>
            /// ID: 9
            ///</summary>
            public const string MP = @"MP";
            ///<summary>
            /// ID: 10
            ///</summary>
            public const string SVRWS = @"SvrWS";
            ///<summary>
            /// ID: 11
            ///</summary>
            public const string UP = @"UP";

            ///<summary>
            /// All values associated with this lookup
            ///</summary>
            public static readonly string[] Values = { @"All Product Attributes", @"Core", @"DP", @"DT", @"IPF", @"LCIA", @"LPIA", @"Mb", @"MP", @"SvrWS", @"UP" };

            ///<summary>
            /// Keyed values associated with the lookup
            ///</summary>
            public static readonly Dictionary<int, string> Dict = new Dictionary<int, string>(){
                {1, @"All Product Attributes"},
                {2, @"Core"},
                {3, @"DP"},
                {4, @"DT"},
                {5, @"IPF"},
                {6, @"LCIA"},
                {7, @"LPIA"},
                {8, @"Mb"},
                {9, @"MP"},
                {10, @"SvrWS"},
                {11, @"UP"}
            };

            ///<summary>
            /// Try to get named value from an ID, or String.Empty on error
            ///</summary>
            public static string TryGetValue(int id)
            {
                string ret;
                if (Dict.TryGetValue(id, out ret))
                {
                    return ret;
                }
                return String.Empty;
            }

            ///<summary>
            /// Try to get and ID from a name (case insensitive), or null on error.
            ///</summary>
            public static int? TryGetId(string value)
            {
                var v = value.Trim().ToLower();
                foreach (var kvp in Dict.Where(itm => itm.Value.Trim().ToLower() == v))
                {
                    return kvp.Key;
                }
                return null;
            }

        }

        ///<summary>
        /// ATRB_SID: 5007
        ///</summary>
        public static class EMB_SEG_MBR_SID_VAL
        {
            ///<summary>
            /// ID: 8
            ///</summary>
            public const string DSS = @"DSS";
            ///<summary>
            /// ID: 10
            ///</summary>
            public const string EBM_EMBEDDED_BOARD_MANUFACTURER = @"EBM (Embedded Board Manufacturer)";
            ///<summary>
            /// ID: 13
            ///</summary>
            public const string ENERGY = @"Energy";
            ///<summary>
            /// ID: 2
            ///</summary>
            public const string GAMING = @"Gaming";
            ///<summary>
            /// ID: 3
            ///</summary>
            public const string INDUSTRIAL = @"Industrial";
            ///<summary>
            /// ID: 6
            ///</summary>
            public const string MAG_MILITARY_AEROSPACE_GOVT = @"MAG (Military Aerospace Govt)";
            ///<summary>
            /// ID: 11
            ///</summary>
            public const string MEDIA_PHONES = @"Media Phones";
            ///<summary>
            /// ID: 5
            ///</summary>
            public const string MEDICAL = @"Medical";
            ///<summary>
            /// ID: 14
            ///</summary>
            public const string OTHER = @"Other";
            ///<summary>
            /// ID: 1
            ///</summary>
            public const string PRINT_IMAGING = @"Print Imaging";
            ///<summary>
            /// ID: 12
            ///</summary>
            public const string THIN_CLIENT = @"Thin Client";
            ///<summary>
            /// ID: 7
            ///</summary>
            public const string TRANSACTIONAL_RETAIL = @"Transactional Retail";
            ///<summary>
            /// ID: 4
            ///</summary>
            public const string TRANSPORTATION = @"Transportation";
            ///<summary>
            /// ID: 9
            ///</summary>
            public const string VISUAL_RETAIL = @"Visual Retail";

            ///<summary>
            /// All values associated with this lookup
            ///</summary>
            public static readonly string[] Values = { @"DSS", @"EBM (Embedded Board Manufacturer)", @"Energy", @"Gaming", @"Industrial", @"MAG (Military Aerospace Govt)", @"Media Phones", @"Medical", @"Other", @"Print Imaging", @"Thin Client", @"Transactional Retail", @"Transportation", @"Visual Retail" };

            ///<summary>
            /// Keyed values associated with the lookup
            ///</summary>
            public static readonly Dictionary<int, string> Dict = new Dictionary<int, string>(){
                {8, @"DSS"},
                {10, @"EBM (Embedded Board Manufacturer)"},
                {13, @"Energy"},
                {2, @"Gaming"},
                {3, @"Industrial"},
                {6, @"MAG (Military Aerospace Govt)"},
                {11, @"Media Phones"},
                {5, @"Medical"},
                {14, @"Other"},
                {1, @"Print Imaging"},
                {12, @"Thin Client"},
                {7, @"Transactional Retail"},
                {4, @"Transportation"},
                {9, @"Visual Retail"}
            };

            ///<summary>
            /// Try to get named value from an ID, or String.Empty on error
            ///</summary>
            public static string TryGetValue(int id)
            {
                string ret;
                if (Dict.TryGetValue(id, out ret))
                {
                    return ret;
                }
                return String.Empty;
            }

            ///<summary>
            /// Try to get and ID from a name (case insensitive), or null on error.
            ///</summary>
            public static int? TryGetId(string value)
            {
                var v = value.Trim().ToLower();
                foreach (var kvp in Dict.Where(itm => itm.Value.Trim().ToLower() == v))
                {
                    return kvp.Key;
                }
                return null;
            }

        }

        ///<summary>
        /// ATRB_SID: 7002
        ///</summary>
        public static class DEAL_PRD_TYPE_VAL
        {
            ///<summary>
            /// ID: 7516
            ///</summary>
            public const string CABLE_MODEM = @"Cable Modem";
            ///<summary>
            /// ID: 3
            ///</summary>
            public const string CPU = @"CPU";
            ///<summary>
            /// ID: 4
            ///</summary>
            public const string CS = @"CS";
            ///<summary>
            /// ID: 7505
            ///</summary>
            public const string DHG_SPD = @"DHG/SPD";
            ///<summary>
            /// ID: 7508
            ///</summary>
            public const string ECG = @"ECG";
            ///<summary>
            /// ID: 7504
            ///</summary>
            public const string ECPD_EMD = @"ECPD EMD";
            ///<summary>
            /// ID: 5
            ///</summary>
            public const string EIA_CPU = @"EIA CPU";
            ///<summary>
            /// ID: 7502
            ///</summary>
            public const string EIA_CS = @"EIA CS";
            ///<summary>
            /// ID: 7503
            ///</summary>
            public const string EIA_MISC = @"EIA MISC";
            ///<summary>
            /// ID: 7500
            ///</summary>
            public const string EPSD = @"EPSD";
            ///<summary>
            /// ID: 7509
            ///</summary>
            public const string FMG = @"FMG";
            ///<summary>
            /// ID: 7514
            ///</summary>
            public const string IA_SW_SERVICE = @"IA SW/Service";
            ///<summary>
            /// ID: 7511
            ///</summary>
            public const string IMC = @"IMC";
            ///<summary>
            /// ID: 6
            ///</summary>
            public const string LAD = @"LAD";
            ///<summary>
            /// ID: 7517
            ///</summary>
            public const string LOM = @"LOM";
            ///<summary>
            /// ID: 7507
            ///</summary>
            public const string NAND = @"NAND";
            ///<summary>
            /// ID: 7
            ///</summary>
            public const string NAND_SSD = @"NAND (SSD)";
            ///<summary>
            /// ID: 7518
            ///</summary>
            public const string NIC = @"NIC";
            ///<summary>
            /// ID: 7510
            ///</summary>
            public const string OTHER = @"Other";
            ///<summary>
            /// ID: 7506
            ///</summary>
            public const string PCG_MISC = @"PCG MISC";
            ///<summary>
            /// ID: 2
            ///</summary>
            public const string PLATFORM_KIT = @"PLATFORM_KIT";
            ///<summary>
            /// ID: 7512
            ///</summary>
            public const string SMART_PHONE = @"SMART PHONE";
            ///<summary>
            /// ID: 7513
            ///</summary>
            public const string TCD = @"TCD";
            ///<summary>
            /// ID: 7501
            ///</summary>
            public const string UPSD = @"UPSD";
            ///<summary>
            /// ID: 8
            ///</summary>
            public const string WC = @"WC";
            ///<summary>
            /// ID: 7515
            ///</summary>
            public const string WORLD_AHEAD = @"World Ahead";

            ///<summary>
            /// All values associated with this lookup
            ///</summary>
            public static readonly string[] Values = { @"Cable Modem", @"CPU", @"CS", @"DHG/SPD", @"ECG", @"ECPD EMD", @"EIA CPU", @"EIA CS", @"EIA MISC", @"EPSD", @"FMG", @"IA SW/Service", @"IMC", @"LAD", @"LOM", @"NAND", @"NAND (SSD)", @"NIC", @"Other", @"PCG MISC", @"PLATFORM_KIT", @"SMART PHONE", @"TCD", @"UPSD", @"WC", @"World Ahead" };

            ///<summary>
            /// Keyed values associated with the lookup
            ///</summary>
            public static readonly Dictionary<int, string> Dict = new Dictionary<int, string>(){
                {7516, @"Cable Modem"},
                {3, @"CPU"},
                {4, @"CS"},
                {7505, @"DHG/SPD"},
                {7508, @"ECG"},
                {7504, @"ECPD EMD"},
                {5, @"EIA CPU"},
                {7502, @"EIA CS"},
                {7503, @"EIA MISC"},
                {7500, @"EPSD"},
                {7509, @"FMG"},
                {7514, @"IA SW/Service"},
                {7511, @"IMC"},
                {6, @"LAD"},
                {7517, @"LOM"},
                {7507, @"NAND"},
                {7, @"NAND (SSD)"},
                {7518, @"NIC"},
                {7510, @"Other"},
                {7506, @"PCG MISC"},
                {2, @"PLATFORM_KIT"},
                {7512, @"SMART PHONE"},
                {7513, @"TCD"},
                {7501, @"UPSD"},
                {8, @"WC"},
                {7515, @"World Ahead"}
            };

            ///<summary>
            /// Try to get named value from an ID, or String.Empty on error
            ///</summary>
            public static string TryGetValue(int id)
            {
                string ret;
                if (Dict.TryGetValue(id, out ret))
                {
                    return ret;
                }
                return String.Empty;
            }

            ///<summary>
            /// Try to get and ID from a name (case insensitive), or null on error.
            ///</summary>
            public static int? TryGetId(string value)
            {
                var v = value.Trim().ToLower();
                foreach (var kvp in Dict.Where(itm => itm.Value.Trim().ToLower() == v))
                {
                    return kvp.Key;
                }
                return null;
            }

        }

        ///<summary>
        /// ATRB_SID: 7003
        ///</summary>
        public static class PRD_CATGRY_NM_VAL
        {
            ///<summary>
            /// ID: 7616
            ///</summary>
            public const string CABLE_MODEM = @"Cable Modem";
            ///<summary>
            /// ID: 12
            ///</summary>
            public const string CS = @"CS";
            ///<summary>
            /// ID: 7605
            ///</summary>
            public const string DHG_SPD = @"DHG/SPD";
            ///<summary>
            /// ID: 9
            ///</summary>
            public const string DT = @"DT";
            ///<summary>
            /// ID: 7608
            ///</summary>
            public const string ECG = @"ECG";
            ///<summary>
            /// ID: 7604
            ///</summary>
            public const string ECPD_EMD = @"ECPD EMD";
            ///<summary>
            /// ID: 13
            ///</summary>
            public const string EIA_CPU = @"EIA CPU";
            ///<summary>
            /// ID: 7602
            ///</summary>
            public const string EIA_CS = @"EIA CS";
            ///<summary>
            /// ID: 7603
            ///</summary>
            public const string EIA_MISC = @"EIA MISC";
            ///<summary>
            /// ID: 7600
            ///</summary>
            public const string EPSD = @"EPSD";
            ///<summary>
            /// ID: 7609
            ///</summary>
            public const string FMG = @"FMG";
            ///<summary>
            /// ID: 7614
            ///</summary>
            public const string IA_SW_SERVICE = @"IA SW/Service";
            ///<summary>
            /// ID: 7611
            ///</summary>
            public const string IMC = @"IMC";
            ///<summary>
            /// ID: 14
            ///</summary>
            public const string LAD = @"LAD";
            ///<summary>
            /// ID: 7617
            ///</summary>
            public const string LOM = @"LOM";
            ///<summary>
            /// ID: 10
            ///</summary>
            public const string MB = @"Mb";
            ///<summary>
            /// ID: 7607
            ///</summary>
            public const string NAND = @"NAND";
            ///<summary>
            /// ID: 15
            ///</summary>
            public const string NAND_SSD = @"NAND (SSD)";
            ///<summary>
            /// ID: 7618
            ///</summary>
            public const string NIC = @"NIC";
            ///<summary>
            /// ID: 7610
            ///</summary>
            public const string OTHER = @"Other";
            ///<summary>
            /// ID: 7606
            ///</summary>
            public const string PCG_MISC = @"PCG MISC";
            ///<summary>
            /// ID: 7612
            ///</summary>
            public const string SMART_PHONE = @"SMART PHONE";
            ///<summary>
            /// ID: 11
            ///</summary>
            public const string SVRWS = @"SvrWS";
            ///<summary>
            /// ID: 7613
            ///</summary>
            public const string TCD = @"TCD";
            ///<summary>
            /// ID: 7601
            ///</summary>
            public const string UPSD = @"UPSD";
            ///<summary>
            /// ID: 16
            ///</summary>
            public const string WC = @"WC";
            ///<summary>
            /// ID: 7615
            ///</summary>
            public const string WORLD_AHEAD = @"World Ahead";

            ///<summary>
            /// All values associated with this lookup
            ///</summary>
            public static readonly string[] Values = { @"Cable Modem", @"CS", @"DHG/SPD", @"DT", @"ECG", @"ECPD EMD", @"EIA CPU", @"EIA CS", @"EIA MISC", @"EPSD", @"FMG", @"IA SW/Service", @"IMC", @"LAD", @"LOM", @"Mb", @"NAND", @"NAND (SSD)", @"NIC", @"Other", @"PCG MISC", @"SMART PHONE", @"SvrWS", @"TCD", @"UPSD", @"WC", @"World Ahead" };

            ///<summary>
            /// Keyed values associated with the lookup
            ///</summary>
            public static readonly Dictionary<int, string> Dict = new Dictionary<int, string>(){
                {7616, @"Cable Modem"},
                {12, @"CS"},
                {7605, @"DHG/SPD"},
                {9, @"DT"},
                {7608, @"ECG"},
                {7604, @"ECPD EMD"},
                {13, @"EIA CPU"},
                {7602, @"EIA CS"},
                {7603, @"EIA MISC"},
                {7600, @"EPSD"},
                {7609, @"FMG"},
                {7614, @"IA SW/Service"},
                {7611, @"IMC"},
                {14, @"LAD"},
                {7617, @"LOM"},
                {10, @"Mb"},
                {7607, @"NAND"},
                {15, @"NAND (SSD)"},
                {7618, @"NIC"},
                {7610, @"Other"},
                {7606, @"PCG MISC"},
                {7612, @"SMART PHONE"},
                {11, @"SvrWS"},
                {7613, @"TCD"},
                {7601, @"UPSD"},
                {16, @"WC"},
                {7615, @"World Ahead"}
            };

            ///<summary>
            /// Try to get named value from an ID, or String.Empty on error
            ///</summary>
            public static string TryGetValue(int id)
            {
                string ret;
                if (Dict.TryGetValue(id, out ret))
                {
                    return ret;
                }
                return String.Empty;
            }

            ///<summary>
            /// Try to get and ID from a name (case insensitive), or null on error.
            ///</summary>
            public static int? TryGetId(string value)
            {
                var v = value.Trim().ToLower();
                foreach (var kvp in Dict.Where(itm => itm.Value.Trim().ToLower() == v))
                {
                    return kvp.Key;
                }
                return null;
            }

        }

        ///<summary>
        /// ATRB_SID: 99001
        ///</summary>
        public static class ROLE_TIER_CD_VAL
        {
            ///<summary>
            /// ID: 1
            ///</summary>
            public const string TIER_0 = @"Tier_0";
            ///<summary>
            /// ID: 2
            ///</summary>
            public const string TIER_1 = @"Tier_1";
            ///<summary>
            /// ID: 3
            ///</summary>
            public const string TIER_2 = @"Tier_2";
            ///<summary>
            /// ID: 4
            ///</summary>
            public const string TIER_3 = @"Tier_3";
            ///<summary>
            /// ID: 5
            ///</summary>
            public const string TIER_4 = @"Tier_4";

            ///<summary>
            /// All values associated with this lookup
            ///</summary>
            public static readonly string[] Values = { @"Tier_0", @"Tier_1", @"Tier_2", @"Tier_3", @"Tier_4" };

            ///<summary>
            /// Keyed values associated with the lookup
            ///</summary>
            public static readonly Dictionary<int, string> Dict = new Dictionary<int, string>(){
                {1, @"Tier_0"},
                {2, @"Tier_1"},
                {3, @"Tier_2"},
                {4, @"Tier_3"},
                {5, @"Tier_4"}
            };

            ///<summary>
            /// Try to get named value from an ID, or String.Empty on error
            ///</summary>
            public static string TryGetValue(int id)
            {
                string ret;
                if (Dict.TryGetValue(id, out ret))
                {
                    return ret;
                }
                return String.Empty;
            }

            ///<summary>
            /// Try to get and ID from a name (case insensitive), or null on error.
            ///</summary>
            public static int? TryGetId(string value)
            {
                var v = value.Trim().ToLower();
                foreach (var kvp in Dict.Where(itm => itm.Value.Trim().ToLower() == v))
                {
                    return kvp.Key;
                }
                return null;
            }

        }

        ///<summary>
        /// ATRB_SID: 99002
        ///</summary>
        public static class WFSTG_ACTN_CD_VAL
        {
            ///<summary>
            /// ID: 6
            ///</summary>
            public const string APPROVE = @"Approve";
            ///<summary>
            /// ID: 7
            ///</summary>
            public const string CANCEL = @"Cancel";
            ///<summary>
            /// ID: 45
            ///</summary>
            public const string FAST_TRACK = @"Fast Track";
            ///<summary>
            /// ID: 46
            ///</summary>
            public const string REDEAL = @"Redeal";
            ///<summary>
            /// ID: 8
            ///</summary>
            public const string REJECT = @"Reject";

            ///<summary>
            /// All values associated with this lookup
            ///</summary>
            public static readonly string[] Values = { @"Approve", @"Cancel", @"Fast Track", @"Redeal", @"Reject" };

            ///<summary>
            /// Keyed values associated with the lookup
            ///</summary>
            public static readonly Dictionary<int, string> Dict = new Dictionary<int, string>(){
                {6, @"Approve"},
                {7, @"Cancel"},
                {45, @"Fast Track"},
                {46, @"Redeal"},
                {8, @"Reject"}
            };

            ///<summary>
            /// Try to get named value from an ID, or String.Empty on error
            ///</summary>
            public static string TryGetValue(int id)
            {
                string ret;
                if (Dict.TryGetValue(id, out ret))
                {
                    return ret;
                }
                return String.Empty;
            }

            ///<summary>
            /// Try to get and ID from a name (case insensitive), or null on error.
            ///</summary>
            public static int? TryGetId(string value)
            {
                var v = value.Trim().ToLower();
                foreach (var kvp in Dict.Where(itm => itm.Value.Trim().ToLower() == v))
                {
                    return kvp.Key;
                }
                return null;
            }

        }

        ///<summary>
        /// ATRB_SID: 99004
        ///</summary>
        public static class WFSTG_LOC_CD_LKUP_VAL
        {
            ///<summary>
            /// ID: 9
            ///</summary>
            public const string LEFT = @"Left";
            ///<summary>
            /// ID: 10
            ///</summary>
            public const string RIGHT = @"Right";
            ///<summary>
            /// ID: 11
            ///</summary>
            public const string TOP = @"Top";

            ///<summary>
            /// All values associated with this lookup
            ///</summary>
            public static readonly string[] Values = { @"Left", @"Right", @"Top" };

            ///<summary>
            /// Keyed values associated with the lookup
            ///</summary>
            public static readonly Dictionary<int, string> Dict = new Dictionary<int, string>(){
                {9, @"Left"},
                {10, @"Right"},
                {11, @"Top"}
            };

            ///<summary>
            /// Try to get named value from an ID, or String.Empty on error
            ///</summary>
            public static string TryGetValue(int id)
            {
                string ret;
                if (Dict.TryGetValue(id, out ret))
                {
                    return ret;
                }
                return String.Empty;
            }

            ///<summary>
            /// Try to get and ID from a name (case insensitive), or null on error.
            ///</summary>
            public static int? TryGetId(string value)
            {
                var v = value.Trim().ToLower();
                foreach (var kvp in Dict.Where(itm => itm.Value.Trim().ToLower() == v))
                {
                    return kvp.Key;
                }
                return null;
            }

        }

        ///<summary>
        /// ATRB_SID: 99005
        ///</summary>
        public static class WFSTG_STS_CD_LKUP_VAL
        {
            ///<summary>
            /// ID: 12
            ///</summary>
            public const string CLOSED = @"Closed";
            ///<summary>
            /// ID: 13
            ///</summary>
            public const string OPEN = @"Open";
            ///<summary>
            /// ID: 14
            ///</summary>
            public const string PENDING = @"Pending";

            ///<summary>
            /// All values associated with this lookup
            ///</summary>
            public static readonly string[] Values = { @"Closed", @"Open", @"Pending" };

            ///<summary>
            /// Keyed values associated with the lookup
            ///</summary>
            public static readonly Dictionary<int, string> Dict = new Dictionary<int, string>(){
                {12, @"Closed"},
                {13, @"Open"},
                {14, @"Pending"}
            };

            ///<summary>
            /// Try to get named value from an ID, or String.Empty on error
            ///</summary>
            public static string TryGetValue(int id)
            {
                string ret;
                if (Dict.TryGetValue(id, out ret))
                {
                    return ret;
                }
                return String.Empty;
            }

            ///<summary>
            /// Try to get and ID from a name (case insensitive), or null on error.
            ///</summary>
            public static int? TryGetId(string value)
            {
                var v = value.Trim().ToLower();
                foreach (var kvp in Dict.Where(itm => itm.Value.Trim().ToLower() == v))
                {
                    return kvp.Key;
                }
                return null;
            }

        }

        ///<summary>
        /// ATRB_SID: 99006
        ///</summary>
        public static class WF_NAME_VAL
        {
            ///<summary>
            /// ID: 15
            ///</summary>
            public const string GENERAL_WF = @"General WF";

            ///<summary>
            /// All values associated with this lookup
            ///</summary>
            public static readonly string[] Values = { @"General WF" };

            ///<summary>
            /// Keyed values associated with the lookup
            ///</summary>
            public static readonly Dictionary<int, string> Dict = new Dictionary<int, string>(){
                {15, @"General WF"}
            };

            ///<summary>
            /// Try to get named value from an ID, or String.Empty on error
            ///</summary>
            public static string TryGetValue(int id)
            {
                string ret;
                if (Dict.TryGetValue(id, out ret))
                {
                    return ret;
                }
                return String.Empty;
            }

            ///<summary>
            /// Try to get and ID from a name (case insensitive), or null on error.
            ///</summary>
            public static int? TryGetId(string value)
            {
                var v = value.Trim().ToLower();
                foreach (var kvp in Dict.Where(itm => itm.Value.Trim().ToLower() == v))
                {
                    return kvp.Key;
                }
                return null;
            }

        }

        ///<summary>
        /// ATRB_SID: 99007
        ///</summary>
        public static class ACTN_CATGRY_CD_VAL
        {
            ///<summary>
            /// ID: 16
            ///</summary>
            public const string ACCOUNT = @"Account";
            ///<summary>
            /// ID: 17
            ///</summary>
            public const string ADMIN = @"Admin";
            ///<summary>
            /// ID: 18
            ///</summary>
            public const string ATTRIBUTE = @"Attribute";
            ///<summary>
            /// ID: 19
            ///</summary>
            public const string DEAL = @"Deal";
            ///<summary>
            /// ID: 20
            ///</summary>
            public const string MENU = @"Menu";
            ///<summary>
            /// ID: 21
            ///</summary>
            public const string SYSTEM = @"System";

            ///<summary>
            /// All values associated with this lookup
            ///</summary>
            public static readonly string[] Values = { @"Account", @"Admin", @"Attribute", @"Deal", @"Menu", @"System" };

            ///<summary>
            /// Keyed values associated with the lookup
            ///</summary>
            public static readonly Dictionary<int, string> Dict = new Dictionary<int, string>(){
                {16, @"Account"},
                {17, @"Admin"},
                {18, @"Attribute"},
                {19, @"Deal"},
                {20, @"Menu"},
                {21, @"System"}
            };

            ///<summary>
            /// Try to get named value from an ID, or String.Empty on error
            ///</summary>
            public static string TryGetValue(int id)
            {
                string ret;
                if (Dict.TryGetValue(id, out ret))
                {
                    return ret;
                }
                return String.Empty;
            }

            ///<summary>
            /// Try to get and ID from a name (case insensitive), or null on error.
            ///</summary>
            public static int? TryGetId(string value)
            {
                var v = value.Trim().ToLower();
                foreach (var kvp in Dict.Where(itm => itm.Value.Trim().ToLower() == v))
                {
                    return kvp.Key;
                }
                return null;
            }

        }

        ///<summary>
        /// ATRB_SID: 99008
        ///</summary>
        public static class PGM_TYPE_LKUP_VAL
        {
            ///<summary>
            /// ID: 9
            ///</summary>
            public const string CHAMP = @"CHAMP";
            ///<summary>
            /// ID: 2
            ///</summary>
            public const string DEBIT_MEMO = @"Debit Memo";
            ///<summary>
            /// ID: 1
            ///</summary>
            public const string ECAP_ADJ = @"ECAP Adj";
            ///<summary>
            /// ID: 8
            ///</summary>
            public const string MCP = @"MCP";
            ///<summary>
            /// ID: 4
            ///</summary>
            public const string MDF = @"MDF";
            ///<summary>
            /// ID: 5
            ///</summary>
            public const string NRE = @"NRE";
            ///<summary>
            /// ID: 3
            ///</summary>
            public const string OTHER = @"Other";
            ///<summary>
            /// ID: 7
            ///</summary>
            public const string SEED = @"SEED";
            ///<summary>
            /// ID: 6
            ///</summary>
            public const string TENDER = @"Tender";

            ///<summary>
            /// All values associated with this lookup
            ///</summary>
            public static readonly string[] Values = { @"CHAMP", @"Debit Memo", @"ECAP Adj", @"MCP", @"MDF", @"NRE", @"Other", @"SEED", @"Tender" };

            ///<summary>
            /// Keyed values associated with the lookup
            ///</summary>
            public static readonly Dictionary<int, string> Dict = new Dictionary<int, string>(){
                {9, @"CHAMP"},
                {2, @"Debit Memo"},
                {1, @"ECAP Adj"},
                {8, @"MCP"},
                {4, @"MDF"},
                {5, @"NRE"},
                {3, @"Other"},
                {7, @"SEED"},
                {6, @"Tender"}
            };

            ///<summary>
            /// Try to get named value from an ID, or String.Empty on error
            ///</summary>
            public static string TryGetValue(int id)
            {
                string ret;
                if (Dict.TryGetValue(id, out ret))
                {
                    return ret;
                }
                return String.Empty;
            }

            ///<summary>
            /// Try to get and ID from a name (case insensitive), or null on error.
            ///</summary>
            public static int? TryGetId(string value)
            {
                var v = value.Trim().ToLower();
                foreach (var kvp in Dict.Where(itm => itm.Value.Trim().ToLower() == v))
                {
                    return kvp.Key;
                }
                return null;
            }

        }

        ///<summary>
        /// ATRB_SID: 99009
        ///</summary>
        public static class ATRB_SCTN_LKUP_VAL
        {
            ///<summary>
            /// ID: 50
            ///</summary>
            public const string C2A_DATA = @"C2A Data";
            ///<summary>
            /// ID: 40
            ///</summary>
            public const string COMMENTS = @"COMMENTS";
            ///<summary>
            /// ID: 41
            ///</summary>
            public const string FILE_ATTCH = @"FILE_ATTCH";
            ///<summary>
            /// ID: 51
            ///</summary>
            public const string INVISIBLE = @"INVISIBLE";
            ///<summary>
            /// ID: 30
            ///</summary>
            public const string LEGAL_FOLDER = @"LEGAL_FOLDER";
            ///<summary>
            /// ID: 31
            ///</summary>
            public const string LINE_ITM = @"LINE_ITM";
            ///<summary>
            /// ID: 32
            ///</summary>
            public const string OVERLAPPING_DEALS = @"OVERLAPPING_DEALS";
            ///<summary>
            /// ID: 42
            ///</summary>
            public const string QUESTION = @"QUESTION";
            ///<summary>
            /// ID: 33
            ///</summary>
            public const string REB_BMT_APPROVED = @"REB_BMT_APPROVED";
            ///<summary>
            /// ID: 34
            ///</summary>
            public const string REB_COMMENTS_ATTACHMENTS = @"REB_COMMENTS_ATTACHMENTS";
            ///<summary>
            /// ID: 35
            ///</summary>
            public const string REB_COMPETITIVE = @"REB_COMPETITIVE";
            ///<summary>
            /// ID: 36
            ///</summary>
            public const string REB_GEN = @"REB_GEN";
            ///<summary>
            /// ID: 37
            ///</summary>
            public const string REB_MMBP_APPROVED = @"REB_MMBP_APPROVED";
            ///<summary>
            /// ID: 43
            ///</summary>
            public const string REB_PAYMENTS = @"REB_PAYMENTS";
            ///<summary>
            /// ID: 44
            ///</summary>
            public const string REB_PNL_SPLIT = @"REB_PNL_SPLIT";
            ///<summary>
            /// ID: 38
            ///</summary>
            public const string REB_TRGT_REG = @"REB_TRGT_REG";
            ///<summary>
            /// ID: 39
            ///</summary>
            public const string SCHD = @"SCHD";

            ///<summary>
            /// All values associated with this lookup
            ///</summary>
            public static readonly string[] Values = { @"C2A Data", @"COMMENTS", @"FILE_ATTCH", @"INVISIBLE", @"LEGAL_FOLDER", @"LINE_ITM", @"OVERLAPPING_DEALS", @"QUESTION", @"REB_BMT_APPROVED", @"REB_COMMENTS_ATTACHMENTS", @"REB_COMPETITIVE", @"REB_GEN", @"REB_MMBP_APPROVED", @"REB_PAYMENTS", @"REB_PNL_SPLIT", @"REB_TRGT_REG", @"SCHD" };

            ///<summary>
            /// Keyed values associated with the lookup
            ///</summary>
            public static readonly Dictionary<int, string> Dict = new Dictionary<int, string>(){
                {50, @"C2A Data"},
                {40, @"COMMENTS"},
                {41, @"FILE_ATTCH"},
                {51, @"INVISIBLE"},
                {30, @"LEGAL_FOLDER"},
                {31, @"LINE_ITM"},
                {32, @"OVERLAPPING_DEALS"},
                {42, @"QUESTION"},
                {33, @"REB_BMT_APPROVED"},
                {34, @"REB_COMMENTS_ATTACHMENTS"},
                {35, @"REB_COMPETITIVE"},
                {36, @"REB_GEN"},
                {37, @"REB_MMBP_APPROVED"},
                {43, @"REB_PAYMENTS"},
                {44, @"REB_PNL_SPLIT"},
                {38, @"REB_TRGT_REG"},
                {39, @"SCHD"}
            };

            ///<summary>
            /// Try to get named value from an ID, or String.Empty on error
            ///</summary>
            public static string TryGetValue(int id)
            {
                string ret;
                if (Dict.TryGetValue(id, out ret))
                {
                    return ret;
                }
                return String.Empty;
            }

            ///<summary>
            /// Try to get and ID from a name (case insensitive), or null on error.
            ///</summary>
            public static int? TryGetId(string value)
            {
                var v = value.Trim().ToLower();
                foreach (var kvp in Dict.Where(itm => itm.Value.Trim().ToLower() == v))
                {
                    return kvp.Key;
                }
                return null;
            }

        }

        ///<summary>
        /// ATRB_SID: 99013
        ///</summary>
        public static class NAND_SSD_QSTN_VAL
        {
            ///<summary>
            /// ID: 86
            ///</summary>
            public const string CLIENT = @"Client";
            ///<summary>
            /// ID: 87
            ///</summary>
            public const string DATA_CENTER = @"Data Center";

            ///<summary>
            /// All values associated with this lookup
            ///</summary>
            public static readonly string[] Values = { @"Client", @"Data Center" };

            ///<summary>
            /// Keyed values associated with the lookup
            ///</summary>
            public static readonly Dictionary<int, string> Dict = new Dictionary<int, string>(){
                {86, @"Client"},
                {87, @"Data Center"}
            };

            ///<summary>
            /// Try to get named value from an ID, or String.Empty on error
            ///</summary>
            public static string TryGetValue(int id)
            {
                string ret;
                if (Dict.TryGetValue(id, out ret))
                {
                    return ret;
                }
                return String.Empty;
            }

            ///<summary>
            /// Try to get and ID from a name (case insensitive), or null on error.
            ///</summary>
            public static int? TryGetId(string value)
            {
                var v = value.Trim().ToLower();
                foreach (var kvp in Dict.Where(itm => itm.Value.Trim().ToLower() == v))
                {
                    return kvp.Key;
                }
                return null;
            }

        }

        ///<summary>
        /// ATRB_SID: 99014
        ///</summary>
        public static class MEET_COMP_PRICE_QSTN_DDWN_VAL
        {
            ///<summary>
            /// ID: 89
            ///</summary>
            public const string PRICE_PERFORMANCE = @"Price / Performance";
            ///<summary>
            /// ID: 88
            ///</summary>
            public const string PRICE_ONLY = @"Price Only";

            ///<summary>
            /// All values associated with this lookup
            ///</summary>
            public static readonly string[] Values = { @"Price / Performance", @"Price Only" };

            ///<summary>
            /// Keyed values associated with the lookup
            ///</summary>
            public static readonly Dictionary<int, string> Dict = new Dictionary<int, string>(){
                {89, @"Price / Performance"},
                {88, @"Price Only"}
            };

            ///<summary>
            /// Try to get named value from an ID, or String.Empty on error
            ///</summary>
            public static string TryGetValue(int id)
            {
                string ret;
                if (Dict.TryGetValue(id, out ret))
                {
                    return ret;
                }
                return String.Empty;
            }

            ///<summary>
            /// Try to get and ID from a name (case insensitive), or null on error.
            ///</summary>
            public static int? TryGetId(string value)
            {
                var v = value.Trim().ToLower();
                foreach (var kvp in Dict.Where(itm => itm.Value.Trim().ToLower() == v))
                {
                    return kvp.Key;
                }
                return null;
            }

        }
    }

    //-------------------------------------------------------------------------------------------




    public class DcsAttributeHelper
    {
        private struct PVT_MSK_CONST
        {
            public const int tdeal_PRD_LINE_AGRMNT_ATRB_PVT = 1;
            public const int tdeal_DEAL_PREP_ATRB_PVT = 2;
            public const int tdeal_DEAL_ATRB_PVT = 4;
            public const int tdeal_DEAL_ATRB_PVT_SNAPSHOT = 8;
            public const int tdeal_DEAL_ATRB_PVT_ARCHV = 16;
            public const int tdeal_DEAL_ATRB_MTX = 64;
        };
        public static readonly Dictionary<int, string> ATTRIBUTE_PIVOT_MASK_MAP = new Dictionary<int, string>
        {
            {PVT_MSK_CONST.tdeal_PRD_LINE_AGRMNT_ATRB_PVT,"tdeal_PRD_LINE_AGRMNT_ATRB_PVT"},
            {PVT_MSK_CONST.tdeal_DEAL_PREP_ATRB_PVT,"tdeal_DEAL_PREP_ATRB_PVT"},
            {PVT_MSK_CONST.tdeal_DEAL_ATRB_PVT,"tdeal_DEAL_ATRB_PVT"},
            {PVT_MSK_CONST.tdeal_DEAL_ATRB_PVT_SNAPSHOT,"tdeal_DEAL_ATRB_PVT_SNAPSHOT"},
            {PVT_MSK_CONST.tdeal_DEAL_ATRB_PVT_ARCHV,"tdeal_DEAL_ATRB_PVT_ARCHV"},
            {PVT_MSK_CONST.tdeal_DEAL_ATRB_MTX,"tdeal_DEAL_ATRB_MTX"}
        };
    }
}
