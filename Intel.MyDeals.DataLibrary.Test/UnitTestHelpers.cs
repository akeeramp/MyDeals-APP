using System.Collections.Generic;
using System.Linq;
using Intel.MyDeals.Entities;
using Intel.Opaque.Data;

namespace Intel.MyDeals.DataLibrary.Test
{
    public static class UnitTestHelpers
    {
        public static void SetDbConnection()
        {
            Dictionary<string, string> jmsConnectionInformation = new Dictionary<string, string>();
            jmsConnectionInformation["jmsServer"] = "tcp://consems1.intel.com:7222"; // Sap Cons Pipe
            jmsConnectionInformation["jmsQueue"] = "JMS_Pricing1_Sender"; // Sap Cons Queue
            jmsConnectionInformation["jmsUID"] = "sys_pricing"; // Sap Cons User
            jmsConnectionInformation["jmsPWD"] = "pr1cing!"; // Sap Cons Pass
            jmsConnectionInformation["jmsResponseDir"] = "\\\\sapfc0fd.fm.intel.com\\fd\\510\\pri\\bu"; // Sap Cons Response Path '\\sapfc0fd.fm.intel.com\fd\510\pri\bu'

            DataLibrary.InitializeDataAccessLib("Server=EG1RDMDBDEV01.amr.corp.intel.com\\DEALSDEV,3180;Database=MyDeals;integrated security=SSPI;MultipleActiveResultSets=true;", "DEV", jmsConnectionInformation);
        }



        public static object SetDataElement(this OpDataCollector dc, MyDealsAttribute atrb, object val, OpAtrbMapCollection dimKey = null)
        {
            return dc.SetDataElement(new OpDeTestItem(atrb, val, dimKey));
        }

        public static object SetDataElement(this OpDataCollector dc, OpDeTestItem opDeTestItem)
        {
            IOpDataElement de = opDeTestItem.DimKey != null
                ? dc.GetDataElementByDim(opDeTestItem.Atrb.ATRB_COL_NM, opDeTestItem.DimKey)
                : dc.GetDataElement(opDeTestItem.Atrb.ATRB_COL_NM);

            if (de != null)
            {
                de.AtrbValue = opDeTestItem.Val;
            }
            else
            {
                dc.DataElements.Add(new OpDataElement
                {
                    DcID = dc.DcID,
                    AtrbID = opDeTestItem.Atrb.ATRB_SID,
                    AtrbCd = opDeTestItem.Atrb.ATRB_COL_NM,
                    DataType = opDeTestItem.Atrb.DOT_NET_DATA_TYPE,
                    AtrbValue = opDeTestItem.Val,
                    DimKey = opDeTestItem.DimKey
                });
            }
            return opDeTestItem.Val;
        }

        public static void SetDataElements(this OpDataCollector dc, List<OpDeTestItem> atrbs)
        {
            foreach (OpDeTestItem opDeTestItem in atrbs)
            {
                dc.SetDataElement(opDeTestItem);
            }
        }

        public static MyDealsData InitMyDealsData()
        {
            return new MyDealsData();
        }

        public static OpDataCollector CreateContract(this MyDealsData myDealsData, int id, List<OpDeTestItem> data = null)
        {
            OpDataCollector dc = new OpDataCollector
            {
                DcParentID = 0,
                DcParentType = "ALL_OBJ_TYPE",
                DcID = id,
                DcType = OpDataElementType.CNTRCT.ToString()
            };

            // always start with the base data.  It can always be over-written
            dc.SetDataElements(new List<OpDeTestItem>
            {
                new OpDeTestItem(Attributes.TITLE, "Unit Test Contract"),
                new OpDeTestItem(Attributes.WF_STG_CD, WorkFlowStages.InComplete),
                new OpDeTestItem(Attributes.HAS_ATTACHED_FILES, "0"),
                new OpDeTestItem(Attributes.OBJ_SET_TYPE_CD, "ALL_TYPES"),
                new OpDeTestItem(Attributes.CUST_MBR_SID, 498),
                new OpDeTestItem(Attributes.START_DT, "7/1/2018"),
                new OpDeTestItem(Attributes.END_DT, "10/1/2018"),
                new OpDeTestItem(Attributes.C2A_DATA_C2A_ID, ""),
                new OpDeTestItem(Attributes.CUST_ACCNT_DIV, ""),
                new OpDeTestItem(Attributes.CUST_ACCPT, "Pending"),
                new OpDeTestItem(Attributes.IS_TENDER, "0")
            });

            // if data is passed... override the base data
            if (data != null)
            {
                dc.SetDataElements(data);
            }

            if (!myDealsData.ContainsKey(OpDataElementType.CNTRCT))
                myDealsData[OpDataElementType.CNTRCT] = new OpDataPacket<OpDataElementType>();

            myDealsData[OpDataElementType.CNTRCT].Data.Add(dc);

            //MyDealsData primaryMyDealsData = OpDataElementType.CNTRCT.GetByIDs(
            //    new List<int> {6751}, 
            //    new List<OpDataElementType> {OpDataElementType.CNTRCT},
            //    null, 
            //    new SavePacket());

            return dc;
        }

        public static OpDataCollector CreatePricingStrategy(this MyDealsData myDealsData, int cntrctId, int id, List<OpDeTestItem> data = null)
        {
            OpDataCollector dcContract = myDealsData[OpDataElementType.CNTRCT].AllDataCollectors.FirstOrDefault(c => c.DcID == id);
            return myDealsData.CreatePricingStrategy(dcContract, id, data);
        }

        public static OpDataCollector CreatePricingStrategy(this MyDealsData myDealsData, OpDataCollector dcContract, int id, List<OpDeTestItem> data = null)
        {
            OpDataCollector dc = new OpDataCollector
            {
                DcParentID = dcContract.DcID,
                DcParentType = OpDataElementType.CNTRCT.ToString(),
                DcID = id,
                DcType = OpDataElementType.PRC_ST.ToString()
            };

            // always start with the base data.  It can always be over-written
            dc.SetDataElements(new List<OpDeTestItem>
            {
                new OpDeTestItem(Attributes.TITLE, $"Unit Test Pricing Strategy {id}"),
                new OpDeTestItem(Attributes.WF_STG_CD, WorkFlowStages.Requested),
                new OpDeTestItem(Attributes.OBJ_SET_TYPE_CD, "ALL_TYPES"),
                new OpDeTestItem(Attributes.START_DT, dcContract.GetDataElementValue(AttributeCodes.START_DT)),
                new OpDeTestItem(Attributes.END_DT, dcContract.GetDataElementValue(AttributeCodes.END_DT))
            });

            // if data is passed... override the base data
            if (data != null)
            {
                dc.SetDataElements(data);
            }

            if (!myDealsData.ContainsKey(OpDataElementType.PRC_ST))
                myDealsData[OpDataElementType.PRC_ST] = new OpDataPacket<OpDataElementType>();

            myDealsData[OpDataElementType.PRC_ST].Data.Add(dc);

            return dc;
        }

        public static OpDataCollector CreatePricingTable(this MyDealsData myDealsData, OpDataCollector dcPs, int id, List<OpDeTestItem> data = null)
        {
            OpDataCollector dc = new OpDataCollector
            {
                DcParentID = dcPs.DcID,
                DcParentType = OpDataElementType.PRC_ST.ToString(),
                DcID = id,
                DcType = OpDataElementType.PRC_TBL.ToString()
            };

            // always start with the base data.  It can always be over-written
            dc.SetDataElements(new List<OpDeTestItem>
            {
                new OpDeTestItem(Attributes.TITLE, $"Unit Test Pricing Table {id}"),
                new OpDeTestItem(Attributes.OBJ_SET_TYPE_CD, "ECAP"),
                new OpDeTestItem(Attributes.START_DT, dcPs.GetDataElementValue(AttributeCodes.START_DT)),
                new OpDeTestItem(Attributes.END_DT, dcPs.GetDataElementValue(AttributeCodes.END_DT)),
                new OpDeTestItem(Attributes.REBATE_TYPE, "MCP"),
                new OpDeTestItem(Attributes.PAYOUT_BASED_ON, "Consumption"),
                new OpDeTestItem(Attributes.PS_WF_STG_CD, "Requested"),
                new OpDeTestItem(Attributes.MRKT_SEG, "All Direct Market Segments"),
                new OpDeTestItem(Attributes.PROGRAM_PAYMENT, "Backend"),
                new OpDeTestItem(Attributes.GEO_COMBINED, "Worldwide"),
                new OpDeTestItem(Attributes.PROD_INCLDS, "Tray")
            });

            // if data is passed... override the base data
            if (data != null)
            {
                dc.SetDataElements(data);
            }

            if (!myDealsData.ContainsKey(OpDataElementType.PRC_TBL))
                myDealsData[OpDataElementType.PRC_TBL] = new OpDataPacket<OpDataElementType>();

            myDealsData[OpDataElementType.PRC_TBL].Data.Add(dc);

            return dc;
        }

        public static OpDataCollector CreatePricingTableRow(this MyDealsData myDealsData, OpDataCollector dcPt, int id, List<OpDeTestItem> data = null)
        {
            OpDataCollector dc = new OpDataCollector
            {
                DcParentID = dcPt.DcID,
                DcParentType = OpDataElementType.PRC_TBL.ToString(),
                DcID = id,
                DcType = OpDataElementType.PRC_TBL_ROW.ToString()
            };

            // always start with the base data.  It can always be over-written
            dc.SetDataElements(new List<OpDeTestItem>
            {
                new OpDeTestItem(Attributes.START_DT, dcPt.GetDataElementValue(AttributeCodes.START_DT)),
                new OpDeTestItem(Attributes.END_DT, dcPt.GetDataElementValue(AttributeCodes.END_DT)),
                new OpDeTestItem(Attributes.PS_WF_STG_CD, "Requested"),
                new OpDeTestItem(Attributes.CUST_MBR_SID, myDealsData[OpDataElementType.CNTRCT].AllDataCollectors.FirstOrDefault().GetDataElementValue(AttributeCodes.CUST_MBR_SID)),
                new OpDeTestItem(Attributes.PAYOUT_BASED_ON, dcPt.GetDataElementValue(AttributeCodes.PAYOUT_BASED_ON)),
                new OpDeTestItem(Attributes.MRKT_SEG, dcPt.GetDataElementValue(AttributeCodes.MRKT_SEG)),
                new OpDeTestItem(Attributes.PROGRAM_PAYMENT, dcPt.GetDataElementValue(AttributeCodes.PROGRAM_PAYMENT)),
                new OpDeTestItem(Attributes.GEO_COMBINED, dcPt.GetDataElementValue(AttributeCodes.GEO_COMBINED))
            });

            // if data is passed... override the base data
            if (data != null)
            {
                dc.SetDataElements(data);
            }

            if (!myDealsData.ContainsKey(OpDataElementType.PRC_TBL_ROW))
                myDealsData[OpDataElementType.PRC_TBL_ROW] = new OpDataPacket<OpDataElementType>();

            myDealsData[OpDataElementType.PRC_TBL_ROW].Data.Add(dc);

            return dc;
        }

        public static OpDataCollector CreatePricingTableRowEcap(this MyDealsData myDealsData, OpDataCollector dcPt, int id, List<OpDeTestItem> data = null)
        {
            OpDataCollector dc = myDealsData.CreatePricingTableRow(dcPt, id, data);
            dc.SetDataElements(new List<OpDeTestItem>
            {
                new OpDeTestItem(Attributes.ECAP_PRICE, "5"),
                new OpDeTestItem(Attributes.REBATE_TYPE, "MCP"),
                new OpDeTestItem(Attributes.TITLE, "JS29F08G08AANC1"),
                new OpDeTestItem(Attributes.OBJ_SET_TYPE_CD, "ECAP"),
                new OpDeTestItem(Attributes.PTR_USER_PRD, "29F02T2AOCMG2,29F64B2AMCMG4,JS29F08G08AANC1"),
                new OpDeTestItem(Attributes.PTR_SYS_PRD, "{\"29F02T2AOCMG2\":[{\"BRND_NM\":\"NA\",\"CAP\":\"96.00\",\"CAP_END\":\"12/31/9999\",\"CAP_START\":\"2/22/2017\",\"DEAL_PRD_NM\":\"29F02T2AOCMG2\",\"DEAL_PRD_TYPE\":\"NAND\",\"DERIVED_USR_INPUT\":\"29F02T2AOCMG2\",\"FMLY_NM\":\"NA\",\"HAS_L1\":0,\"HAS_L2\":0,\"HIER_NM_HASH\":\"NAND NAND NA NA NA 29F02T2AOCMG2 \",\"HIER_VAL_NM\":\"29F02T2AOCMG2\",\"MM_MEDIA_CD\":\"\",\"MTRL_ID\":\"\",\"PCSR_NBR\":\"NA\",\"PRD_ATRB_SID\":7007,\"PRD_CAT_NM\":\"NAND\",\"PRD_END_DTM\":\"12/31/9999\",\"PRD_MBR_SID\":71242,\"PRD_STRT_DTM\":\"12/4/2015\",\"USR_INPUT\":\"29F02T2AOCMG2\",\"YCS2\":\"No YCS2\",\"YCS2_END\":\"1/1/1900\",\"YCS2_START\":\"1/1/1900\",\"EXCLUDE\":false}],\"29F64B2AMCMG4\":[{\"BRND_NM\":\"NA\",\"CAP\":\"96.00\",\"CAP_END\":\"12/31/9999\",\"CAP_START\":\"11/15/2017\",\"DEAL_PRD_NM\":\"29F64B2AMCMG4\",\"DEAL_PRD_TYPE\":\"NAND\",\"DERIVED_USR_INPUT\":\"29F64B2AMCMG4\",\"FMLY_NM\":\"NA\",\"HAS_L1\":0,\"HAS_L2\":0,\"HIER_NM_HASH\":\"NAND NAND NA NA NA 29F64B2AMCMG4 \",\"HIER_VAL_NM\":\"29F64B2AMCMG4\",\"MM_MEDIA_CD\":\"\",\"MTRL_ID\":\"\",\"PCSR_NBR\":\"NA\",\"PRD_ATRB_SID\":7007,\"PRD_CAT_NM\":\"NAND\",\"PRD_END_DTM\":\"12/31/9999\",\"PRD_MBR_SID\":71932,\"PRD_STRT_DTM\":\"1/14/2016\",\"USR_INPUT\":\"29F64B2AMCMG4\",\"YCS2\":\"No YCS2\",\"YCS2_END\":\"1/1/1900\",\"YCS2_START\":\"1/1/1900\",\"EXCLUDE\":false}],\"JS29F08G08AANC1\":[{\"BRND_NM\":\"NA\",\"CAP\":\"6.00\",\"CAP_END\":\"12/31/9999\",\"CAP_START\":\"10/26/2008\",\"DEAL_PRD_NM\":\"JS29F08G08AANC1\",\"DEAL_PRD_TYPE\":\"NAND\",\"DERIVED_USR_INPUT\":\"JS29F08G08AANC1\",\"FMLY_NM\":\"NA\",\"HAS_L1\":0,\"HAS_L2\":0,\"HIER_NM_HASH\":\"NAND NAND NA NA NA JS29F08G08AANC1 \",\"HIER_VAL_NM\":\"JS29F08G08AANC1\",\"MM_MEDIA_CD\":\"\",\"MTRL_ID\":\"\",\"PCSR_NBR\":\"NA\",\"PRD_ATRB_SID\":7007,\"PRD_CAT_NM\":\"NAND\",\"PRD_END_DTM\":\"12/31/9999\",\"PRD_MBR_SID\":15650,\"PRD_STRT_DTM\":\"10/15/2010\",\"USR_INPUT\":\"JS29F08G08AANC1\",\"YCS2\":\"No YCS2\",\"YCS2_END\":\"1/1/1900\",\"YCS2_START\":\"1/1/1900\",\"EXCLUDE\":false}]}"),
                new OpDeTestItem(Attributes.PROD_INCLDS, "Tray")
            });

            return dc;
        }

        public static OpDataCollector CreatePricingTableRowVolTier(this MyDealsData myDealsData, OpDataCollector dcPt, int id, List<OpDeTestItem> data = null)
        {
            OpDataCollector dc = myDealsData.CreatePricingTableRow(dcPt, id, data);
            dc.SetDataElements(new List<OpDeTestItem>
            {
                new OpDeTestItem(Attributes.REBATE_TYPE, "MCP"),
                new OpDeTestItem(Attributes.TITLE, "JS29F08G08AANC1"),
                new OpDeTestItem(Attributes.OBJ_SET_TYPE_CD, "VOL_TIER"),
                new OpDeTestItem(Attributes.PTR_USER_PRD, "29F02T2AOCMG2,29F64B2AMCMG4,JS29F08G08AANC1"),
                new OpDeTestItem(Attributes.PTR_SYS_PRD, "{\"29F02T2AOCMG2\":[{\"BRND_NM\":\"NA\",\"CAP\":\"96.00\",\"CAP_END\":\"12/31/9999\",\"CAP_START\":\"2/22/2017\",\"DEAL_PRD_NM\":\"29F02T2AOCMG2\",\"DEAL_PRD_TYPE\":\"NAND\",\"DERIVED_USR_INPUT\":\"29F02T2AOCMG2\",\"FMLY_NM\":\"NA\",\"HAS_L1\":0,\"HAS_L2\":0,\"HIER_NM_HASH\":\"NAND NAND NA NA NA 29F02T2AOCMG2 \",\"HIER_VAL_NM\":\"29F02T2AOCMG2\",\"MM_MEDIA_CD\":\"\",\"MTRL_ID\":\"\",\"PCSR_NBR\":\"NA\",\"PRD_ATRB_SID\":7007,\"PRD_CAT_NM\":\"NAND\",\"PRD_END_DTM\":\"12/31/9999\",\"PRD_MBR_SID\":71242,\"PRD_STRT_DTM\":\"12/4/2015\",\"USR_INPUT\":\"29F02T2AOCMG2\",\"YCS2\":\"No YCS2\",\"YCS2_END\":\"1/1/1900\",\"YCS2_START\":\"1/1/1900\",\"EXCLUDE\":false}],\"29F64B2AMCMG4\":[{\"BRND_NM\":\"NA\",\"CAP\":\"96.00\",\"CAP_END\":\"12/31/9999\",\"CAP_START\":\"11/15/2017\",\"DEAL_PRD_NM\":\"29F64B2AMCMG4\",\"DEAL_PRD_TYPE\":\"NAND\",\"DERIVED_USR_INPUT\":\"29F64B2AMCMG4\",\"FMLY_NM\":\"NA\",\"HAS_L1\":0,\"HAS_L2\":0,\"HIER_NM_HASH\":\"NAND NAND NA NA NA 29F64B2AMCMG4 \",\"HIER_VAL_NM\":\"29F64B2AMCMG4\",\"MM_MEDIA_CD\":\"\",\"MTRL_ID\":\"\",\"PCSR_NBR\":\"NA\",\"PRD_ATRB_SID\":7007,\"PRD_CAT_NM\":\"NAND\",\"PRD_END_DTM\":\"12/31/9999\",\"PRD_MBR_SID\":71932,\"PRD_STRT_DTM\":\"1/14/2016\",\"USR_INPUT\":\"29F64B2AMCMG4\",\"YCS2\":\"No YCS2\",\"YCS2_END\":\"1/1/1900\",\"YCS2_START\":\"1/1/1900\",\"EXCLUDE\":false}],\"JS29F08G08AANC1\":[{\"BRND_NM\":\"NA\",\"CAP\":\"6.00\",\"CAP_END\":\"12/31/9999\",\"CAP_START\":\"10/26/2008\",\"DEAL_PRD_NM\":\"JS29F08G08AANC1\",\"DEAL_PRD_TYPE\":\"NAND\",\"DERIVED_USR_INPUT\":\"JS29F08G08AANC1\",\"FMLY_NM\":\"NA\",\"HAS_L1\":0,\"HAS_L2\":0,\"HIER_NM_HASH\":\"NAND NAND NA NA NA JS29F08G08AANC1 \",\"HIER_VAL_NM\":\"JS29F08G08AANC1\",\"MM_MEDIA_CD\":\"\",\"MTRL_ID\":\"\",\"PCSR_NBR\":\"NA\",\"PRD_ATRB_SID\":7007,\"PRD_CAT_NM\":\"NAND\",\"PRD_END_DTM\":\"12/31/9999\",\"PRD_MBR_SID\":15650,\"PRD_STRT_DTM\":\"10/15/2010\",\"USR_INPUT\":\"JS29F08G08AANC1\",\"YCS2\":\"No YCS2\",\"YCS2_END\":\"1/1/1900\",\"YCS2_START\":\"1/1/1900\",\"EXCLUDE\":false}]}"),
                new OpDeTestItem(Attributes.PROD_INCLDS, "Tray")
            });

            return dc;
        }

        public static OpDataCollector CreatePricingTableRowProgram(this MyDealsData myDealsData, OpDataCollector dcPt, int id, List<OpDeTestItem> data = null)
        {
            OpDataCollector dc = myDealsData.CreatePricingTableRow(dcPt, id, data);
            dc.SetDataElements(new List<OpDeTestItem>
            {
                new OpDeTestItem(Attributes.REBATE_TYPE, "MCP"),
                new OpDeTestItem(Attributes.TITLE, "JS29F08G08AANC1"),
                new OpDeTestItem(Attributes.OBJ_SET_TYPE_CD, "PROGRAM"),
                new OpDeTestItem(Attributes.PTR_USER_PRD, "29F02T2AOCMG2,29F64B2AMCMG4,JS29F08G08AANC1"),
                new OpDeTestItem(Attributes.PTR_SYS_PRD, "{\"29F02T2AOCMG2\":[{\"BRND_NM\":\"NA\",\"CAP\":\"96.00\",\"CAP_END\":\"12/31/9999\",\"CAP_START\":\"2/22/2017\",\"DEAL_PRD_NM\":\"29F02T2AOCMG2\",\"DEAL_PRD_TYPE\":\"NAND\",\"DERIVED_USR_INPUT\":\"29F02T2AOCMG2\",\"FMLY_NM\":\"NA\",\"HAS_L1\":0,\"HAS_L2\":0,\"HIER_NM_HASH\":\"NAND NAND NA NA NA 29F02T2AOCMG2 \",\"HIER_VAL_NM\":\"29F02T2AOCMG2\",\"MM_MEDIA_CD\":\"\",\"MTRL_ID\":\"\",\"PCSR_NBR\":\"NA\",\"PRD_ATRB_SID\":7007,\"PRD_CAT_NM\":\"NAND\",\"PRD_END_DTM\":\"12/31/9999\",\"PRD_MBR_SID\":71242,\"PRD_STRT_DTM\":\"12/4/2015\",\"USR_INPUT\":\"29F02T2AOCMG2\",\"YCS2\":\"No YCS2\",\"YCS2_END\":\"1/1/1900\",\"YCS2_START\":\"1/1/1900\",\"EXCLUDE\":false}],\"29F64B2AMCMG4\":[{\"BRND_NM\":\"NA\",\"CAP\":\"96.00\",\"CAP_END\":\"12/31/9999\",\"CAP_START\":\"11/15/2017\",\"DEAL_PRD_NM\":\"29F64B2AMCMG4\",\"DEAL_PRD_TYPE\":\"NAND\",\"DERIVED_USR_INPUT\":\"29F64B2AMCMG4\",\"FMLY_NM\":\"NA\",\"HAS_L1\":0,\"HAS_L2\":0,\"HIER_NM_HASH\":\"NAND NAND NA NA NA 29F64B2AMCMG4 \",\"HIER_VAL_NM\":\"29F64B2AMCMG4\",\"MM_MEDIA_CD\":\"\",\"MTRL_ID\":\"\",\"PCSR_NBR\":\"NA\",\"PRD_ATRB_SID\":7007,\"PRD_CAT_NM\":\"NAND\",\"PRD_END_DTM\":\"12/31/9999\",\"PRD_MBR_SID\":71932,\"PRD_STRT_DTM\":\"1/14/2016\",\"USR_INPUT\":\"29F64B2AMCMG4\",\"YCS2\":\"No YCS2\",\"YCS2_END\":\"1/1/1900\",\"YCS2_START\":\"1/1/1900\",\"EXCLUDE\":false}],\"JS29F08G08AANC1\":[{\"BRND_NM\":\"NA\",\"CAP\":\"6.00\",\"CAP_END\":\"12/31/9999\",\"CAP_START\":\"10/26/2008\",\"DEAL_PRD_NM\":\"JS29F08G08AANC1\",\"DEAL_PRD_TYPE\":\"NAND\",\"DERIVED_USR_INPUT\":\"JS29F08G08AANC1\",\"FMLY_NM\":\"NA\",\"HAS_L1\":0,\"HAS_L2\":0,\"HIER_NM_HASH\":\"NAND NAND NA NA NA JS29F08G08AANC1 \",\"HIER_VAL_NM\":\"JS29F08G08AANC1\",\"MM_MEDIA_CD\":\"\",\"MTRL_ID\":\"\",\"PCSR_NBR\":\"NA\",\"PRD_ATRB_SID\":7007,\"PRD_CAT_NM\":\"NAND\",\"PRD_END_DTM\":\"12/31/9999\",\"PRD_MBR_SID\":15650,\"PRD_STRT_DTM\":\"10/15/2010\",\"USR_INPUT\":\"JS29F08G08AANC1\",\"YCS2\":\"No YCS2\",\"YCS2_END\":\"1/1/1900\",\"YCS2_START\":\"1/1/1900\",\"EXCLUDE\":false}]}"),
                new OpDeTestItem(Attributes.PROD_INCLDS, "Tray")
            });

            return dc;
        }

        public static OpDataCollector CreatePricingTableRowKit(this MyDealsData myDealsData, OpDataCollector dcPt, int id, List<OpDeTestItem> data = null)
        {
            OpDataCollector dc = myDealsData.CreatePricingTableRow(dcPt, id, data);
            dc.SetDataElements(new List<OpDeTestItem>
            {
                new OpDeTestItem(Attributes.REBATE_TYPE, "MCP"),
                new OpDeTestItem(Attributes.TITLE, "JS29F08G08AANC1"),
                new OpDeTestItem(Attributes.OBJ_SET_TYPE_CD, "KIT"),
                new OpDeTestItem(Attributes.PTR_USER_PRD, "29F02T2AOCMG2,29F64B2AMCMG4,JS29F08G08AANC1"),
                new OpDeTestItem(Attributes.PTR_SYS_PRD, "{\"29F02T2AOCMG2\":[{\"BRND_NM\":\"NA\",\"CAP\":\"96.00\",\"CAP_END\":\"12/31/9999\",\"CAP_START\":\"2/22/2017\",\"DEAL_PRD_NM\":\"29F02T2AOCMG2\",\"DEAL_PRD_TYPE\":\"NAND\",\"DERIVED_USR_INPUT\":\"29F02T2AOCMG2\",\"FMLY_NM\":\"NA\",\"HAS_L1\":0,\"HAS_L2\":0,\"HIER_NM_HASH\":\"NAND NAND NA NA NA 29F02T2AOCMG2 \",\"HIER_VAL_NM\":\"29F02T2AOCMG2\",\"MM_MEDIA_CD\":\"\",\"MTRL_ID\":\"\",\"PCSR_NBR\":\"NA\",\"PRD_ATRB_SID\":7007,\"PRD_CAT_NM\":\"NAND\",\"PRD_END_DTM\":\"12/31/9999\",\"PRD_MBR_SID\":71242,\"PRD_STRT_DTM\":\"12/4/2015\",\"USR_INPUT\":\"29F02T2AOCMG2\",\"YCS2\":\"No YCS2\",\"YCS2_END\":\"1/1/1900\",\"YCS2_START\":\"1/1/1900\",\"EXCLUDE\":false}],\"29F64B2AMCMG4\":[{\"BRND_NM\":\"NA\",\"CAP\":\"96.00\",\"CAP_END\":\"12/31/9999\",\"CAP_START\":\"11/15/2017\",\"DEAL_PRD_NM\":\"29F64B2AMCMG4\",\"DEAL_PRD_TYPE\":\"NAND\",\"DERIVED_USR_INPUT\":\"29F64B2AMCMG4\",\"FMLY_NM\":\"NA\",\"HAS_L1\":0,\"HAS_L2\":0,\"HIER_NM_HASH\":\"NAND NAND NA NA NA 29F64B2AMCMG4 \",\"HIER_VAL_NM\":\"29F64B2AMCMG4\",\"MM_MEDIA_CD\":\"\",\"MTRL_ID\":\"\",\"PCSR_NBR\":\"NA\",\"PRD_ATRB_SID\":7007,\"PRD_CAT_NM\":\"NAND\",\"PRD_END_DTM\":\"12/31/9999\",\"PRD_MBR_SID\":71932,\"PRD_STRT_DTM\":\"1/14/2016\",\"USR_INPUT\":\"29F64B2AMCMG4\",\"YCS2\":\"No YCS2\",\"YCS2_END\":\"1/1/1900\",\"YCS2_START\":\"1/1/1900\",\"EXCLUDE\":false}],\"JS29F08G08AANC1\":[{\"BRND_NM\":\"NA\",\"CAP\":\"6.00\",\"CAP_END\":\"12/31/9999\",\"CAP_START\":\"10/26/2008\",\"DEAL_PRD_NM\":\"JS29F08G08AANC1\",\"DEAL_PRD_TYPE\":\"NAND\",\"DERIVED_USR_INPUT\":\"JS29F08G08AANC1\",\"FMLY_NM\":\"NA\",\"HAS_L1\":0,\"HAS_L2\":0,\"HIER_NM_HASH\":\"NAND NAND NA NA NA JS29F08G08AANC1 \",\"HIER_VAL_NM\":\"JS29F08G08AANC1\",\"MM_MEDIA_CD\":\"\",\"MTRL_ID\":\"\",\"PCSR_NBR\":\"NA\",\"PRD_ATRB_SID\":7007,\"PRD_CAT_NM\":\"NAND\",\"PRD_END_DTM\":\"12/31/9999\",\"PRD_MBR_SID\":15650,\"PRD_STRT_DTM\":\"10/15/2010\",\"USR_INPUT\":\"JS29F08G08AANC1\",\"YCS2\":\"No YCS2\",\"YCS2_END\":\"1/1/1900\",\"YCS2_START\":\"1/1/1900\",\"EXCLUDE\":false}]}"),
                new OpDeTestItem(Attributes.PROD_INCLDS, "Tray")
            });

            return dc;
        }

        public static OpDataCollector CreateWipDeal(this MyDealsData myDealsData, OpDataCollector dcPtr, int id, List<OpDeTestItem> data = null)
        {
            OpDataCollector dc = new OpDataCollector
            {
                DcParentID = dcPtr.DcID,
                DcParentType = OpDataElementType.PRC_TBL_ROW.ToString(),
                DcID = id,
                DcType = OpDataElementType.WIP_DEAL.ToString()
            };

            // always start with the base data.  It can always be over-written
            dc.SetDataElements(new List<OpDeTestItem>
            {
                new OpDeTestItem(Attributes.PS_WF_STG_CD, "Requested"),
                new OpDeTestItem(Attributes.WF_STG_CD, "Draft"),
                new OpDeTestItem(Attributes.OBJ_SET_TYPE_CD, "ECAP"),
                new OpDeTestItem(Attributes.ECAP_PRICE, "5"),
                new OpDeTestItem(Attributes.TITLE, "JS29F08G08AANC1"),
                new OpDeTestItem(Attributes.REBATE_TYPE, dcPtr.GetDataElementValue(AttributeCodes.REBATE_TYPE)),
                new OpDeTestItem(Attributes.START_DT, dcPtr.GetDataElementValue(AttributeCodes.START_DT)),
                new OpDeTestItem(Attributes.END_DT, dcPtr.GetDataElementValue(AttributeCodes.END_DT)),
                new OpDeTestItem(Attributes.CUST_MBR_SID, dcPtr.GetDataElementValue(AttributeCodes.CUST_MBR_SID)),
                new OpDeTestItem(Attributes.PAYOUT_BASED_ON, dcPtr.GetDataElementValue(AttributeCodes.PAYOUT_BASED_ON)),
                new OpDeTestItem(Attributes.MRKT_SEG, dcPtr.GetDataElementValue(AttributeCodes.MRKT_SEG)),
                new OpDeTestItem(Attributes.PROGRAM_PAYMENT, dcPtr.GetDataElementValue(AttributeCodes.PROGRAM_PAYMENT)),
                new OpDeTestItem(Attributes.GEO_COMBINED, dcPtr.GetDataElementValue(AttributeCodes.GEO_COMBINED)),
                new OpDeTestItem(Attributes.CUST_MBR_SID, myDealsData[OpDataElementType.CNTRCT].AllDataCollectors.FirstOrDefault().GetDataElementValue(AttributeCodes.CUST_MBR_SID))
            });

            // if data is passed... override the base data
            if (data != null)
            {
                dc.SetDataElements(data);
            }

            if (!myDealsData.ContainsKey(OpDataElementType.WIP_DEAL))
                myDealsData[OpDataElementType.WIP_DEAL] = new OpDataPacket<OpDataElementType>();

            myDealsData[OpDataElementType.WIP_DEAL].Data.Add(dc);

            return dc;
        }

        public static OpDataCollector CreateWipDealEcap(this MyDealsData myDealsData, OpDataCollector dcPtr, int id, List<OpDeTestItem> data = null)
        {
            OpDataCollector dc = myDealsData.CreateWipDeal(dcPtr, id, data);
            dc.SetDataElements(new List<OpDeTestItem>
            {
                new OpDeTestItem(Attributes.OBJ_SET_TYPE_CD, "ECAP"),
                new OpDeTestItem(Attributes.ECAP_PRICE, "5"),
                new OpDeTestItem(Attributes.TITLE, "JS29F08G08AANC1")
            });

            return dc;
        }

        public static OpDataCollector CreateWipDealVolTier(this MyDealsData myDealsData, OpDataCollector dcPtr, int id, List<OpDeTestItem> data = null)
        {
            //MyDealsData primaryMyDealsData = OpDataElementType.PRC_TBL.GetByIDs(
            //    new List<int> { 551604 },
            //    new List<OpDataElementType> { OpDataElementType.PRC_TBL_ROW, OpDataElementType.WIP_DEAL },
            //    null,
            //    new SavePacket());


            OpDataCollector dc = myDealsData.CreateWipDeal(dcPtr, id, data);
            dc.SetDataElements(new List<OpDeTestItem>
            {
                new OpDeTestItem(Attributes.NUM_OF_TIERS, 1),
                new OpDeTestItem(Attributes.OBJ_SET_TYPE_CD, "VOL_TIER"),
                new OpDeTestItem(Attributes.TITLE, "JS29F08G08AANC1"),
                new OpDeTestItem(Attributes.TIER_NBR, 1, new OpAtrbMapCollection(new OpAtrbMap(10,1))),
                new OpDeTestItem(Attributes.STRT_VOL, 0, new OpAtrbMapCollection(new OpAtrbMap(10,1))),
                new OpDeTestItem(Attributes.END_VOL, 100, new OpAtrbMapCollection(new OpAtrbMap(10,1))),
                new OpDeTestItem(Attributes.RATE, 5, new OpAtrbMapCollection(new OpAtrbMap(10,1))),
            });

            return dc;
        }

        public static OpDataCollector CreateWipDealProgram(this MyDealsData myDealsData, OpDataCollector dcPtr, int id, List<OpDeTestItem> data = null)
        {
            OpDataCollector dc = myDealsData.CreateWipDeal(dcPtr, id, data);
            dc.SetDataElements(new List<OpDeTestItem>
            {
                new OpDeTestItem(Attributes.OBJ_SET_TYPE_CD, "PROGRAM"),
                new OpDeTestItem(Attributes.TITLE, "JS29F08G08AANC1")
            });

            return dc;
        }

        public static OpDataCollector CreateWipDealKit(this MyDealsData myDealsData, OpDataCollector dcPtr, int id, List<OpDeTestItem> data = null)
        {
            OpDataCollector dc = myDealsData.CreateWipDeal(dcPtr, id, data);
            dc.SetDataElements(new List<OpDeTestItem>
            {
                new OpDeTestItem(Attributes.OBJ_SET_TYPE_CD, "KIT"),
                new OpDeTestItem(Attributes.ECAP_PRICE, "5"),
                new OpDeTestItem(Attributes.TITLE, "JS29F08G08AANC1")
            });

            return dc;
        }



        public static MyDealsData BuildSimpleContract()
        {
            int id = 1;
            MyDealsData myDealsData = InitMyDealsData();

            OpDataCollector dcContract1 = myDealsData.CreateContract(1);

            // ECAP
            OpDataCollector dcPsE1 = myDealsData.CreatePricingStrategy(dcContract1, id++);
            OpDataCollector dcPtE1 = myDealsData.CreatePricingTable(dcPsE1, id++);
            OpDataCollector dcPtrE1 = myDealsData.CreatePricingTableRowEcap(dcPtE1, id++, new List<OpDeTestItem>
            {
                new OpDeTestItem(Attributes.TITLE, "29F02T2AOCMG2,29F64B2AMCMG4"),
                new OpDeTestItem(Attributes.PTR_USER_PRD, "29F02T2AOCMG2,29F64B2AMCMG4"),
                new OpDeTestItem(Attributes.PTR_SYS_PRD, "{\"29F02T2AOCMG2\":[{\"BRND_NM\":\"NA\",\"CAP\":\"96.00\",\"CAP_END\":\"12/31/9999\",\"CAP_START\":\"2/22/2017\",\"DEAL_PRD_NM\":\"29F02T2AOCMG2\",\"DEAL_PRD_TYPE\":\"NAND\",\"DERIVED_USR_INPUT\":\"29F02T2AOCMG2\",\"FMLY_NM\":\"NA\",\"HAS_L1\":0,\"HAS_L2\":0,\"HIER_NM_HASH\":\"NAND NAND NA NA NA 29F02T2AOCMG2 \",\"HIER_VAL_NM\":\"29F02T2AOCMG2\",\"MM_MEDIA_CD\":\"\",\"MTRL_ID\":\"\",\"PCSR_NBR\":\"NA\",\"PRD_ATRB_SID\":7007,\"PRD_CAT_NM\":\"NAND\",\"PRD_END_DTM\":\"12/31/9999\",\"PRD_MBR_SID\":71242,\"PRD_STRT_DTM\":\"12/4/2015\",\"USR_INPUT\":\"29F02T2AOCMG2\",\"YCS2\":\"No YCS2\",\"YCS2_END\":\"1/1/1900\",\"YCS2_START\":\"1/1/1900\",\"EXCLUDE\":false}],\"29F64B2AMCMG4\":[{\"BRND_NM\":\"NA\",\"CAP\":\"96.00\",\"CAP_END\":\"11/31/9999\",\"CAP_START\":\"11/15/2017\",\"DEAL_PRD_NM\":\"29F64B2AMCMG4\",\"DEAL_PRD_TYPE\":\"NAND\",\"DERIVED_USR_INPUT\":\"29F64B2AMCMG4\",\"FMLY_NM\":\"NA\",\"HAS_L1\":1,\"HAS_L2\":1,\"HIER_NM_HASH\":\"NAND NAND NA NA NA 29F64B2AMCMG4 \",\"HIER_VAL_NM\":\"29F64B2AMCMG4\",\"MM_MEDIA_CD\":\"\",\"MTRL_ID\":\"\",\"PCSR_NBR\":\"NA\",\"PRD_ATRB_SID\":7007,\"PRD_CAT_NM\":\"NAND\",\"PRD_END_DTM\":\"12/31/9999\",\"PRD_MBR_SID\":71932,\"PRD_STRT_DTM\":\"1/14/2016\",\"USR_INPUT\":\"29F64B2AMCMG4\",\"YCS2\":\"No YCS2\",\"YCS2_END\":\"1/1/1900\",\"YCS2_START\":\"1/1/1900\",\"EXCLUDE\":false}]}")
            });
            OpDataCollector dcWipE1 = myDealsData.CreateWipDealEcap(dcPtrE1, id++, new List<OpDeTestItem>
            {
                new OpDeTestItem(Attributes.TITLE, "29F02T2AOCMG2")
            });
            OpDataCollector dcWipE2 = myDealsData.CreateWipDealEcap(dcPtrE1, id++, new List<OpDeTestItem>
            {
                new OpDeTestItem(Attributes.TITLE, "29F64B2AMCMG4")
            });
            OpDataCollector dcPtrE3 = myDealsData.CreatePricingTableRowEcap(dcPtE1, id++, new List<OpDeTestItem>
            {
                new OpDeTestItem(Attributes.GEO_COMBINED, "APAC,EMEA"),
                new OpDeTestItem(Attributes.MRKT_SEG, "Communications, Corp"),
                new OpDeTestItem(Attributes.TITLE, "29F02T2AOCMG2")
            });

            // VOL
            OpDataCollector dcPsV1 = myDealsData.CreatePricingStrategy(dcContract1, id++);
            OpDataCollector dcPtV1 = myDealsData.CreatePricingTable(dcPsV1, id++);
            OpDataCollector dcPtrV1 = myDealsData.CreatePricingTableRowVolTier(dcPtV1, id++, new List<OpDeTestItem>
            {
                new OpDeTestItem(Attributes.TITLE, "29F02T2AOCMG2,29F64B2AMCMG4"),
                new OpDeTestItem(Attributes.PTR_USER_PRD, "29F02T2AOCMG2,29F64B2AMCMG4"),
                new OpDeTestItem(Attributes.PTR_SYS_PRD, "{\"29F02T2AOCMG2\":[{\"BRND_NM\":\"NA\",\"CAP\":\"96.00\",\"CAP_END\":\"12/31/9999\",\"CAP_START\":\"2/22/2017\",\"DEAL_PRD_NM\":\"29F02T2AOCMG2\",\"DEAL_PRD_TYPE\":\"NAND\",\"DERIVED_USR_INPUT\":\"29F02T2AOCMG2\",\"FMLY_NM\":\"NA\",\"HAS_L1\":0,\"HAS_L2\":0,\"HIER_NM_HASH\":\"NAND NAND NA NA NA 29F02T2AOCMG2 \",\"HIER_VAL_NM\":\"29F02T2AOCMG2\",\"MM_MEDIA_CD\":\"\",\"MTRL_ID\":\"\",\"PCSR_NBR\":\"NA\",\"PRD_ATRB_SID\":7007,\"PRD_CAT_NM\":\"NAND\",\"PRD_END_DTM\":\"12/31/9999\",\"PRD_MBR_SID\":71242,\"PRD_STRT_DTM\":\"12/4/2015\",\"USR_INPUT\":\"29F02T2AOCMG2\",\"YCS2\":\"No YCS2\",\"YCS2_END\":\"1/1/1900\",\"YCS2_START\":\"1/1/1900\",\"EXCLUDE\":false}],\"29F64B2AMCMG4\":[{\"BRND_NM\":\"NA\",\"CAP\":\"96.00\",\"CAP_END\":\"11/31/9999\",\"CAP_START\":\"11/15/2017\",\"DEAL_PRD_NM\":\"29F64B2AMCMG4\",\"DEAL_PRD_TYPE\":\"NAND\",\"DERIVED_USR_INPUT\":\"29F64B2AMCMG4\",\"FMLY_NM\":\"NA\",\"HAS_L1\":1,\"HAS_L2\":1,\"HIER_NM_HASH\":\"NAND NAND NA NA NA 29F64B2AMCMG4 \",\"HIER_VAL_NM\":\"29F64B2AMCMG4\",\"MM_MEDIA_CD\":\"\",\"MTRL_ID\":\"\",\"PCSR_NBR\":\"NA\",\"PRD_ATRB_SID\":7007,\"PRD_CAT_NM\":\"NAND\",\"PRD_END_DTM\":\"12/31/9999\",\"PRD_MBR_SID\":71932,\"PRD_STRT_DTM\":\"1/14/2016\",\"USR_INPUT\":\"29F64B2AMCMG4\",\"YCS2\":\"No YCS2\",\"YCS2_END\":\"1/1/1900\",\"YCS2_START\":\"1/1/1900\",\"EXCLUDE\":false}]}")
            });
            OpDataCollector dcWipV1 = myDealsData.CreateWipDealVolTier(dcPtrV1, id++, new List<OpDeTestItem>
            {
                new OpDeTestItem(Attributes.NUM_OF_TIERS, "3"),
                new OpDeTestItem(Attributes.TIER_NBR, 1, new OpAtrbMapCollection(new OpAtrbMap(10,1))),
                new OpDeTestItem(Attributes.STRT_VOL, 0, new OpAtrbMapCollection(new OpAtrbMap(10,1))),
                new OpDeTestItem(Attributes.END_VOL, 100, new OpAtrbMapCollection(new OpAtrbMap(10,1))),
                new OpDeTestItem(Attributes.RATE, 5, new OpAtrbMapCollection(new OpAtrbMap(10,1))),
                new OpDeTestItem(Attributes.TIER_NBR, 2, new OpAtrbMapCollection(new OpAtrbMap(10,2))),
                new OpDeTestItem(Attributes.STRT_VOL, 101, new OpAtrbMapCollection(new OpAtrbMap(10,2))),
                new OpDeTestItem(Attributes.END_VOL, 200, new OpAtrbMapCollection(new OpAtrbMap(10,2))),
                new OpDeTestItem(Attributes.RATE, 4, new OpAtrbMapCollection(new OpAtrbMap(10,2))),
                new OpDeTestItem(Attributes.TIER_NBR, 3, new OpAtrbMapCollection(new OpAtrbMap(10,3))),
                new OpDeTestItem(Attributes.STRT_VOL, 201, new OpAtrbMapCollection(new OpAtrbMap(10,3))),
                new OpDeTestItem(Attributes.END_VOL, 300, new OpAtrbMapCollection(new OpAtrbMap(10,3))),
                new OpDeTestItem(Attributes.RATE, 3, new OpAtrbMapCollection(new OpAtrbMap(10,3))),
            });

            OpDataCollector dcPtrV2 = myDealsData.CreatePricingTableRowVolTier(dcPtV1, id++, new List<OpDeTestItem>
            {
                new OpDeTestItem(Attributes.GEO_COMBINED, "APAC,EMEA"),
                new OpDeTestItem(Attributes.MRKT_SEG, "Communications, Corp"),
                new OpDeTestItem(Attributes.TITLE, "29F02T2AOCMG2"),
                new OpDeTestItem(Attributes.PTR_USER_PRD, "29F02T2AOCMG2"),
                new OpDeTestItem(Attributes.PTR_SYS_PRD, "{\"29F02T2AOCMG2\":[{\"BRND_NM\":\"NA\",\"CAP\":\"96.00\",\"CAP_END\":\"12/31/9999\",\"CAP_START\":\"2/22/2017\",\"DEAL_PRD_NM\":\"29F02T2AOCMG2\",\"DEAL_PRD_TYPE\":\"NAND\",\"DERIVED_USR_INPUT\":\"29F02T2AOCMG2\",\"FMLY_NM\":\"NA\",\"HAS_L1\":0,\"HAS_L2\":0,\"HIER_NM_HASH\":\"NAND NAND NA NA NA 29F02T2AOCMG2 \",\"HIER_VAL_NM\":\"29F02T2AOCMG2\",\"MM_MEDIA_CD\":\"\",\"MTRL_ID\":\"\",\"PCSR_NBR\":\"NA\",\"PRD_ATRB_SID\":7007,\"PRD_CAT_NM\":\"NAND\",\"PRD_END_DTM\":\"12/31/9999\",\"PRD_MBR_SID\":71242,\"PRD_STRT_DTM\":\"12/4/2015\",\"USR_INPUT\":\"29F02T2AOCMG2\",\"YCS2\":\"No YCS2\",\"YCS2_END\":\"1/1/1900\",\"YCS2_START\":\"1/1/1900\",\"EXCLUDE\":false}]}")
            });
            OpDataCollector dcWipV2 = myDealsData.CreateWipDealVolTier(dcPtrV2, id++);

            // Program
            OpDataCollector dcPsP1 = myDealsData.CreatePricingStrategy(dcContract1, id++);
            OpDataCollector dcPtP1 = myDealsData.CreatePricingTable(dcPsP1, id++);
            OpDataCollector dcPtrP1 = myDealsData.CreatePricingTableRowProgram(dcPtP1, id++, new List<OpDeTestItem>
            {
                new OpDeTestItem(Attributes.TITLE, "29F02T2AOCMG2,29F64B2AMCMG4"),
                new OpDeTestItem(Attributes.PTR_USER_PRD, "29F02T2AOCMG2,29F64B2AMCMG4"),
                new OpDeTestItem(Attributes.PTR_SYS_PRD, "{\"29F02T2AOCMG2\":[{\"BRND_NM\":\"NA\",\"CAP\":\"96.00\",\"CAP_END\":\"12/31/9999\",\"CAP_START\":\"2/22/2017\",\"DEAL_PRD_NM\":\"29F02T2AOCMG2\",\"DEAL_PRD_TYPE\":\"NAND\",\"DERIVED_USR_INPUT\":\"29F02T2AOCMG2\",\"FMLY_NM\":\"NA\",\"HAS_L1\":0,\"HAS_L2\":0,\"HIER_NM_HASH\":\"NAND NAND NA NA NA 29F02T2AOCMG2 \",\"HIER_VAL_NM\":\"29F02T2AOCMG2\",\"MM_MEDIA_CD\":\"\",\"MTRL_ID\":\"\",\"PCSR_NBR\":\"NA\",\"PRD_ATRB_SID\":7007,\"PRD_CAT_NM\":\"NAND\",\"PRD_END_DTM\":\"12/31/9999\",\"PRD_MBR_SID\":71242,\"PRD_STRT_DTM\":\"12/4/2015\",\"USR_INPUT\":\"29F02T2AOCMG2\",\"YCS2\":\"No YCS2\",\"YCS2_END\":\"1/1/1900\",\"YCS2_START\":\"1/1/1900\",\"EXCLUDE\":false}],\"29F64B2AMCMG4\":[{\"BRND_NM\":\"NA\",\"CAP\":\"96.00\",\"CAP_END\":\"11/31/9999\",\"CAP_START\":\"11/15/2017\",\"DEAL_PRD_NM\":\"29F64B2AMCMG4\",\"DEAL_PRD_TYPE\":\"NAND\",\"DERIVED_USR_INPUT\":\"29F64B2AMCMG4\",\"FMLY_NM\":\"NA\",\"HAS_L1\":1,\"HAS_L2\":1,\"HIER_NM_HASH\":\"NAND NAND NA NA NA 29F64B2AMCMG4 \",\"HIER_VAL_NM\":\"29F64B2AMCMG4\",\"MM_MEDIA_CD\":\"\",\"MTRL_ID\":\"\",\"PCSR_NBR\":\"NA\",\"PRD_ATRB_SID\":7007,\"PRD_CAT_NM\":\"NAND\",\"PRD_END_DTM\":\"12/31/9999\",\"PRD_MBR_SID\":71932,\"PRD_STRT_DTM\":\"1/14/2016\",\"USR_INPUT\":\"29F64B2AMCMG4\",\"YCS2\":\"No YCS2\",\"YCS2_END\":\"1/1/1900\",\"YCS2_START\":\"1/1/1900\",\"EXCLUDE\":false}]}")
            });
            OpDataCollector dcPtrP2 = myDealsData.CreatePricingTableRowProgram(dcPtP1, id++, new List<OpDeTestItem>
            {
                new OpDeTestItem(Attributes.GEO_COMBINED, "APAC,EMEA"),
                new OpDeTestItem(Attributes.MRKT_SEG, "Communications, Corp"),
                new OpDeTestItem(Attributes.TITLE, "29F02T2AOCMG2"),
                new OpDeTestItem(Attributes.PTR_USER_PRD, "29F02T2AOCMG2"),
                new OpDeTestItem(Attributes.PTR_SYS_PRD, "{\"29F02T2AOCMG2\":[{\"BRND_NM\":\"NA\",\"CAP\":\"96.00\",\"CAP_END\":\"12/31/9999\",\"CAP_START\":\"2/22/2017\",\"DEAL_PRD_NM\":\"29F02T2AOCMG2\",\"DEAL_PRD_TYPE\":\"NAND\",\"DERIVED_USR_INPUT\":\"29F02T2AOCMG2\",\"FMLY_NM\":\"NA\",\"HAS_L1\":0,\"HAS_L2\":0,\"HIER_NM_HASH\":\"NAND NAND NA NA NA 29F02T2AOCMG2 \",\"HIER_VAL_NM\":\"29F02T2AOCMG2\",\"MM_MEDIA_CD\":\"\",\"MTRL_ID\":\"\",\"PCSR_NBR\":\"NA\",\"PRD_ATRB_SID\":7007,\"PRD_CAT_NM\":\"NAND\",\"PRD_END_DTM\":\"12/31/9999\",\"PRD_MBR_SID\":71242,\"PRD_STRT_DTM\":\"12/4/2015\",\"USR_INPUT\":\"29F02T2AOCMG2\",\"YCS2\":\"No YCS2\",\"YCS2_END\":\"1/1/1900\",\"YCS2_START\":\"1/1/1900\",\"EXCLUDE\":false}]}")
            });

            // Kit
            OpDataCollector dcPsK1 = myDealsData.CreatePricingStrategy(dcContract1, id++);
            OpDataCollector dcPtK1 = myDealsData.CreatePricingTable(dcPsK1, id++);
            OpDataCollector dcPtrK1 = myDealsData.CreatePricingTableRowKit(dcPtK1, id++, new List<OpDeTestItem>
            {
                new OpDeTestItem(Attributes.TITLE, "29F02T2AOCMG2,29F64B2AMCMG4"),
                new OpDeTestItem(Attributes.PTR_USER_PRD, "29F02T2AOCMG2,29F64B2AMCMG4"),
                new OpDeTestItem(Attributes.PTR_SYS_PRD, "{\"29F02T2AOCMG2\":[{\"BRND_NM\":\"NA\",\"CAP\":\"96.00\",\"CAP_END\":\"12/31/9999\",\"CAP_START\":\"2/22/2017\",\"DEAL_PRD_NM\":\"29F02T2AOCMG2\",\"DEAL_PRD_TYPE\":\"NAND\",\"DERIVED_USR_INPUT\":\"29F02T2AOCMG2\",\"FMLY_NM\":\"NA\",\"HAS_L1\":0,\"HAS_L2\":0,\"HIER_NM_HASH\":\"NAND NAND NA NA NA 29F02T2AOCMG2 \",\"HIER_VAL_NM\":\"29F02T2AOCMG2\",\"MM_MEDIA_CD\":\"\",\"MTRL_ID\":\"\",\"PCSR_NBR\":\"NA\",\"PRD_ATRB_SID\":7007,\"PRD_CAT_NM\":\"NAND\",\"PRD_END_DTM\":\"12/31/9999\",\"PRD_MBR_SID\":71242,\"PRD_STRT_DTM\":\"12/4/2015\",\"USR_INPUT\":\"29F02T2AOCMG2\",\"YCS2\":\"No YCS2\",\"YCS2_END\":\"1/1/1900\",\"YCS2_START\":\"1/1/1900\",\"EXCLUDE\":false}],\"29F64B2AMCMG4\":[{\"BRND_NM\":\"NA\",\"CAP\":\"96.00\",\"CAP_END\":\"11/31/9999\",\"CAP_START\":\"11/15/2017\",\"DEAL_PRD_NM\":\"29F64B2AMCMG4\",\"DEAL_PRD_TYPE\":\"NAND\",\"DERIVED_USR_INPUT\":\"29F64B2AMCMG4\",\"FMLY_NM\":\"NA\",\"HAS_L1\":1,\"HAS_L2\":1,\"HIER_NM_HASH\":\"NAND NAND NA NA NA 29F64B2AMCMG4 \",\"HIER_VAL_NM\":\"29F64B2AMCMG4\",\"MM_MEDIA_CD\":\"\",\"MTRL_ID\":\"\",\"PCSR_NBR\":\"NA\",\"PRD_ATRB_SID\":7007,\"PRD_CAT_NM\":\"NAND\",\"PRD_END_DTM\":\"12/31/9999\",\"PRD_MBR_SID\":71932,\"PRD_STRT_DTM\":\"1/14/2016\",\"USR_INPUT\":\"29F64B2AMCMG4\",\"YCS2\":\"No YCS2\",\"YCS2_END\":\"1/1/1900\",\"YCS2_START\":\"1/1/1900\",\"EXCLUDE\":false}]}")
            });
            OpDataCollector dcPtrK2 = myDealsData.CreatePricingTableRowKit(dcPtK1, id++, new List<OpDeTestItem>
            {
                new OpDeTestItem(Attributes.GEO_COMBINED, "APAC,EMEA"),
                new OpDeTestItem(Attributes.MRKT_SEG, "Communications, Corp"),
                new OpDeTestItem(Attributes.TITLE, "29F02T2AOCMG2"),
                new OpDeTestItem(Attributes.PTR_USER_PRD, "29F02T2AOCMG2"),
                new OpDeTestItem(Attributes.PTR_SYS_PRD, "{\"29F02T2AOCMG2\":[{\"BRND_NM\":\"NA\",\"CAP\":\"96.00\",\"CAP_END\":\"12/31/9999\",\"CAP_START\":\"2/22/2017\",\"DEAL_PRD_NM\":\"29F02T2AOCMG2\",\"DEAL_PRD_TYPE\":\"NAND\",\"DERIVED_USR_INPUT\":\"29F02T2AOCMG2\",\"FMLY_NM\":\"NA\",\"HAS_L1\":0,\"HAS_L2\":0,\"HIER_NM_HASH\":\"NAND NAND NA NA NA 29F02T2AOCMG2 \",\"HIER_VAL_NM\":\"29F02T2AOCMG2\",\"MM_MEDIA_CD\":\"\",\"MTRL_ID\":\"\",\"PCSR_NBR\":\"NA\",\"PRD_ATRB_SID\":7007,\"PRD_CAT_NM\":\"NAND\",\"PRD_END_DTM\":\"12/31/9999\",\"PRD_MBR_SID\":71242,\"PRD_STRT_DTM\":\"12/4/2015\",\"USR_INPUT\":\"29F02T2AOCMG2\",\"YCS2\":\"No YCS2\",\"YCS2_END\":\"1/1/1900\",\"YCS2_START\":\"1/1/1900\",\"EXCLUDE\":false}]}")
            });

            return myDealsData;
        }
    }
}
