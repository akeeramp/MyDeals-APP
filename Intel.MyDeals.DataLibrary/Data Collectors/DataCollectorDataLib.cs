using System;
using System.Collections.Generic;
using Intel.MyDeals.Entities;
using Intel.MyDeals.IDataLibrary;
using Intel.Opaque.Data;


namespace Intel.MyDeals.DataLibrary
{
    public class DataCollectorDataLib : IDataCollectorDataLib
    {

        public MyDealsData GetByIDs(OpDataElementType opDataElementType, IEnumerable<int> ids)
        {
            return GetByIDs(opDataElementType, ids, new List<OpDataElementType> { opDataElementType }, new List<string>());
        }

        public MyDealsData GetByIDs(OpDataElementType opDataElementType, IEnumerable<int> ids, List<OpDataElementType> includeTypes)
        {
            return GetByIDs(opDataElementType, ids, includeTypes, new List<string>());
        }

        public MyDealsData GetByIDs(OpDataElementType opDataElementType, IEnumerable<int> ids, List<OpDataElementType> includeTypes, IEnumerable<string> atrbs)
        {
            // TODO replace this with stored procedure when DB is ready

            // TODO need ability to control returnset attributes (like one dim attributes from Pricing Tables for UpperContract calls

            MyDealsData data = new MyDealsData
            {
                [OpDataElementType.Contract] = new OpDataPacket<OpDataElementType>
                {
                    Data =
                    {
                        [123] = new OpDataCollector
                        {
                            DcID = 123,
                            DcAltID = 0,
                            DcType = OpDataElementType.Contract.ToString(),
                            DataElements = new List<OpDataElement>
                            {
                                new OpDataElement
                                {
                                    AtrbID = 125,
                                    AtrbCd = "CUST_NM",
                                    AtrbValue = "HPI",
                                    DcID = 123,
                                    DcAltID = 0
                                },
                                new OpDataElement
                                {
                                    AtrbID = 124,
                                    AtrbCd = "TITLE",
                                    AtrbValue = "Intel-HP Worldwide Commercial DT and NB Agreement FQ2’16 to FQ1’17",
                                    DcID = 123,
                                    DcAltID = 0
                                },
                                new OpDataElement
                                {
                                    AtrbID = 123,
                                    AtrbCd = "START_DT",
                                    AtrbValue = "1/2/2016",
                                    DcID = 123,
                                    DcAltID = 0
                                },
                                new OpDataElement
                                {
                                    AtrbID = 133,
                                    AtrbCd = "END_DT",
                                    AtrbValue = "12/2/2016",
                                    DcID = 123,
                                    DcAltID = 0
                                },
                                new OpDataElement
                                {
                                    AtrbID = 144,
                                    AtrbCd = "CUST_ACCEPTED",
                                    AtrbValue = true,
                                    DcID = 123,
                                    DcAltID = 0
                                },
                                new OpDataElement
                                {
                                    AtrbID = 145,
                                    AtrbCd = "C2A_REF",
                                    AtrbValue = "14237564",
                                    DcID = 123,
                                    DcAltID = 0
                                },
                                new OpDataElement
                                {
                                    AtrbID = 143,
                                    AtrbCd = "DEAL_STG_CD",
                                    AtrbValue = "Requested",
                                    DcID = 123,
                                    DcAltID = 0
                                },
                                new OpDataElement
                                {
                                    AtrbID = 143,
                                    AtrbCd = "NUM_TIERS",
                                    AtrbValue = 3,
                                    DcID = 123,
                                    DcAltID = 0
                                }
                            }
                        }
                    }
                },
                [OpDataElementType.PricingStrategy] = new OpDataPacket<OpDataElementType>
                {
                    Data =
                    {
                        [201] = new OpDataCollector
                        {
                            DcID = 201,
                            DcAltID = 123,
                            DcType = OpDataElementType.PricingStrategy.ToString(),
                            DataElements = new List<OpDataElement>
                            {
                                new OpDataElement
                                {
                                    AtrbID = 123,
                                    AtrbCd = "TITLE",
                                    AtrbValue = "Worldwide Notebook MMCP Tiers – FQ2’16 to FQ1’17",
                                    DcID = 201,
                                    DcAltID = 123
                                },
                                new OpDataElement
                                {
                                    AtrbID = 143,
                                    AtrbCd = "TERMS",
                                    AtrbValue = "<ol><li>Price Effective Dates: February 1st, 2016 through January 31st, 2017</li><li>Volume rebates eligible for Spectre AN00, B(600), P(800), W(Z), M(900), 700, and 1000 Series vPro enabled Platforms only – reported by HP</li><li>vPro Eligible Systems must be configured w vPro eligible CPU, Chipset, WLAN component and the appropriate Intel AMT FM enabled</li><li>Table 1 rebates not eligible for X4 5Y71, Quad Core CPUs(xxxxMX / MQ / HQ), and Transactional Core M5, M7, i3, i5, i7</li><li>Intel agrees to adjust geo / segment tiers for FQ4’16 / FQ1’17 to account for changes greater or less than a +/ -3pt change in IDC’s current YoY market growth forecast.Intel will use the same tier setting methodology for the mid-year reset process as the initial framework</li></ul>",
                                    DcID = 201,
                                    DcAltID = 123
                                }
                            }
                        },
                        [202] = new OpDataCollector
                        {
                            DcID = 202,
                            DcAltID = 123,
                            DcType = OpDataElementType.PricingStrategy.ToString(),
                            DataElements = new List<OpDataElement>
                            {
                                new OpDataElement
                                {
                                    AtrbID = 123,
                                    AtrbCd = "TITLE",
                                    AtrbValue = "HPA Desktop CPU ECAPs",
                                    DcID = 201,
                                    DcAltID = 123
                                },
                                new OpDataElement
                                {
                                    AtrbID = 143,
                                    AtrbCd = "TERMS",
                                    AtrbValue = "<b>Additional Discount Requirements:</b><ol><li>Price Effective Dates: February 1st, 2016 through January 31st, 2017</li><li>CPU ECAP rebates are not eligible for Workstations</li></ol><b>Discount Requirements</b><ol><li>Price Effective Dates: February 1st, 2016 through January 31st, 2017</li><li>Eligible platforms: BPC, RPOS, WGBU(Z230 / Z240, Z1 Gen 2 / 3), and Thin Clients</li><li>In addition to the HPA CPU ECAP pricing, Intel agrees to offer an additional $7 per unit for Haswell / Skylake i5 / i7 Desktop processors excluding i5 - 44xx, i5 - 64xx",                                    DcID = 201,
                                    DcAltID = 123
                                }
                            }
                        },
                        [203] = new OpDataCollector
                        {
                            DcID = 203,
                            DcAltID = 123,
                            DcType = OpDataElementType.PricingStrategy.ToString(),
                            DataElements = new List<OpDataElement>
                            {
                                new OpDataElement
                                {
                                    AtrbID = 123,
                                    AtrbCd = "TITLE",
                                    AtrbValue = "Pippin HP 260 G1 Pricing",
                                    DcID = 202,
                                    DcAltID = 123
                                },
                                new OpDataElement
                                {
                                    AtrbID = 133,
                                    AtrbCd = "TERMS",
                                    AtrbValue = "<ul><li>Eligible discounts for the Pippin HP 260 G1/G2 platform only</li><li>Volume not eligible for any other discounts</li><li>For this agreement rebates on Qualifying Intel Products are eligible when integrated into the desktop form factor(Pippin HP 260 G1 / G2 product only)</li><li>Mobile Market Segment T & Cs apply - See Terms and Conditions for additional details</li><li>Qualifying Intel Products are not eligible for ECAP pricing when shipped into Large Enterprise customers</li></ul>",
                                    DcID = 202,
                                    DcAltID = 123
                                }
                            }
                        }
                    }
                },
                [OpDataElementType.PricingTable] = new OpDataPacket<OpDataElementType>
                {
                    Data =
                    {
                        [301] = new OpDataCollector
                        {
                            DcID = 301,
                            DcAltID = 201,
                            DcType = OpDataElementType.PricingTable.ToString(),
                            DataElements = new List<OpDataElement>
                            {
                                new OpDataElement
                                {
                                    AtrbID = 123,
                                    AtrbCd = "TITLE",
                                    AtrbValue = "MMCP Tiers Table 1",
                                    DcID = 201,
                                    DcAltID = 201
                                },
                                new OpDataElement
                                {
                                    AtrbID = 123,
                                    AtrbCd = "OBJSET_TYPE_CD",
                                    AtrbValue = "VOLTIER",
                                    DcID = 201,
                                    DcAltID = 201
                                },
                                new OpDataElement
                                {
                                    AtrbID = 123,
                                    AtrbCd = "PCT_RESULT",
                                    AtrbValue = "INCOMPLETE",
                                    DcID = 202,
                                    DcAltID = 202
                                }
                            }
                        },
                        [302] = new OpDataCollector
                        {
                            DcID = 302,
                            DcAltID = 201,
                            DcType = OpDataElementType.PricingTable.ToString(),
                            DataElements = new List<OpDataElement>
                            {
                                new OpDataElement
                                {
                                    AtrbID = 123,
                                    AtrbCd = "TITLE",
                                    AtrbValue = "MMCP Tiers Table 2",
                                    DcID = 202,
                                    DcAltID = 202
                                },
                                new OpDataElement
                                {
                                    AtrbID = 123,
                                    AtrbCd = "OBJSET_TYPE_CD",
                                    AtrbValue = "VOLTIER",
                                    DcID = 202,
                                    DcAltID = 202
                                },
                                new OpDataElement
                                {
                                    AtrbID = 123,
                                    AtrbCd = "PCT_RESULT",
                                    AtrbValue = "NA",
                                    DcID = 202,
                                    DcAltID = 202
                                }
                            }
                        },
                        [3021] = new OpDataCollector
                        {
                            DcID = 3021,
                            DcAltID = 202,
                            DcType = OpDataElementType.PricingTable.ToString(),
                            DataElements = new List<OpDataElement>
                            {
                                new OpDataElement
                                {
                                    AtrbID = 123,
                                    AtrbCd = "TITLE",
                                    AtrbValue = "HPA Desktop CPU ECAPs",
                                    DcID = 202,
                                    DcAltID = 202
                                },
                                new OpDataElement
                                {
                                    AtrbID = 123,
                                    AtrbCd = "OBJSET_TYPE_CD",
                                    AtrbValue = "ECAP",
                                    DcID = 202,
                                    DcAltID = 202
                                },
                                new OpDataElement
                                {
                                    AtrbID = 123,
                                    AtrbCd = "PCT_RESULT",
                                    AtrbValue = "PASS",
                                    DcID = 202,
                                    DcAltID = 202
                                }
                            }
                        },
                        [303] = new OpDataCollector
                        {
                            DcID = 303,
                            DcAltID = 203,
                            DcType = OpDataElementType.PricingTable.ToString(),
                            DataElements = new List<OpDataElement>
                            {
                                new OpDataElement
                                {
                                    AtrbID = 123,
                                    AtrbCd = "TITLE",
                                    AtrbValue = "Pippin HP 260 G1 Pricing",
                                    DcID = 203,
                                    DcAltID = 203
                                },
                                new OpDataElement
                                {
                                    AtrbID = 123,
                                    AtrbCd = "OBJSET_TYPE_CD",
                                    AtrbValue = "ECAP",
                                    DcID = 203,
                                    DcAltID = 203
                                },
                                new OpDataElement
                                {
                                    AtrbID = 123,
                                    AtrbCd = "PCT_RESULT",
                                    AtrbValue = "FAIL",
                                    DcID = 202,
                                    DcAltID = 202
                                }
                            }
                        }
                    }
                }
            };

            return data;

            ////string strInc = "*";
            ////string searchGroup = opDataElementType.ToString();

            ////if (includeTypes != null && includeTypes.Any())
            ////{
            ////    strInc = string.Join(",", includeTypes.Select(OpDataElementTypeConverter.ToString).Distinct());
            ////}


            ////// TODO change SP to match naming conventions
            ////// --'CNTRCT, PRC_ST, PRCNG, WIP_DEAL, DEAL'
            ////strInc = strInc.Replace(OpDataElementType.Contract.ToString(), "CNTRCT");
            ////strInc = strInc.Replace(OpDataElementType.PricingStrategy.ToString(), "PRC_ST");
            ////strInc = strInc.Replace(OpDataElementType.PricingTable.ToString(), "PRCNG");
            ////strInc = strInc.Replace(OpDataElementType.WipDeals.ToString(), "WIP_DEAL");
            ////strInc = strInc.Replace(OpDataElementType.Deals.ToString(), "DEAL");

            ////searchGroup = searchGroup.Replace(OpDataElementType.Contract.ToString(), "CNTRCT");
            ////searchGroup = searchGroup.Replace(OpDataElementType.PricingStrategy.ToString(), "PRC_ST");
            ////searchGroup = searchGroup.Replace(OpDataElementType.PricingTable.ToString(), "PRCNG");
            ////searchGroup = searchGroup.Replace(OpDataElementType.WipDeals.ToString(), "WIP_DEAL");
            ////searchGroup = searchGroup.Replace(OpDataElementType.Deals.ToString(), "DEAL");


            ////var cmd = new Procs.deal.PR_GET_DEALS_BY_SIDS
            ////{
            ////    //EMP_WWID = applySecurity ? OpUserStack.MyOpUserToken.Usr.WWID : 0,
            ////    //APPLY_SECURITY = applySecurity,
            ////    INCLUDE_GROUPS = strInc,
            ////    SRCH_GRP = searchGroup,
            ////    SRCH_SIDS = new type_int_list(ids.ToArray())
            ////};


            //////string[] aAtrbs = atrbs as string[] ?? atrbs.ToArray();
            //////if (atrbs != null && aAtrbs.Any())
            //////{
            //////    cmd.DEAL_SIDS = new type_list(aAtrbs.ToArray());
            //////}
            //////cmd.CONTRACT_SIDS = new type_int_list(ids.ContainsKey(OpDataElementType.Contract.ToString()) ? ids[OpDataElementType.Contract.ToString()].ToArray() : new int[] {});
            //////cmd.STRATEGY_SIDS = new type_int_list(ids.ContainsKey(OpDataElementType.PricingStrategy.ToString()) ? ids[OpDataElementType.PricingStrategy.ToString()].ToArray() : new int[] { });
            //////cmd.PRICETABLE_SIDS = new type_int_list(ids.ContainsKey(OpDataElementType.PricingTable.ToString()) ? ids[OpDataElementType.PricingTable.ToString()].ToArray() : new int[] { });
            //////cmd.WIP_DEAL_SIDS = new type_int_list(ids.ContainsKey(OpDataElementType.WipDeals.ToString()) ? ids[OpDataElementType.WipDeals.ToString()].ToArray() : new int[] { });
            //////cmd.DEAL_SIDS = new type_int_list(ids.ContainsKey(OpDataElementType.Deals.ToString()) ? ids[OpDataElementType.Deals.ToString()].ToArray() : new int[] { });

            ////MyDealsData odcs;
            ////using (var rdr = DataAccess.ExecuteReader(cmd))
            ////{
            ////    odcs = ReaderToDataCollectors(rdr, true);
            ////}

            ////// Add in the negative IDs now

            ////if (odcs == null) odcs = new MyDealsData(); // We might have to initialize other things in odcs

            ////foreach (int id in ids.Where(c => c < 0))
            ////{
            ////    // We have a negative number, so stub in a new contract for that number...
            ////    if (!odcs.ContainsKey(opDataElementType))
            ////    {
            ////        odcs[opDataElementType] = new OpDataPacket<OpDataElementType>
            ////        {
            ////            PacketType = opDataElementType,
            ////            GroupID = id
            ////        };
            ////    }
            ////    odcs[opDataElementType].Data[id] = GetDataCollectorFromTemplate(opDataElementType, id, 0);
            ////    // Populate this according to the template

            ////}


            ////return odcs;
        }



        public TemplateWrapper GetTemplateData(DateTime lastCacheDate)
        {
            return new TemplateWrapper
            {
                TemplateDict = ConvertDealTemplateDataGramsToOpDataElementUIs(null)
            };
            ////lock (LOCK_OBJECT)
            ////{
            ////    if (_getTemplateData != null) { return _getTemplateData; }
            ////}

            ////if (lastCacheDate < OpaqueConst.SQL_MIN_DATE)
            ////{
            ////    lastCacheDate = OpaqueConst.SQL_MIN_DATE;
            ////}

            ////var ret = new TemplateWrapper();

            ////using (var rdr = DataAccess.ExecuteReader(new Procs.app.PR_GET_NEW_DEAL { CACHE_DATE = lastCacheDate }))
            ////{
            ////    if (rdr.HasRows) // Will be false if cache condition is met...
            ////    {
            ////        // Result 1 = Tempates
            ////        ret.TemplateData = DealTemplateDataGramFromReader(rdr);
            ////        rdr.NextResult();

            ////        // Result 2 = Customer Calendars
            ////        ret.CalendarData = CustomerCalendarFromReader(rdr);
            ////        rdr.NextResult();

            ////        // Result 3 = Deal Types
            ////        ret.DealTypeData = DealTypeFromReader(rdr);
            ////    }
            ////}

            ////ret.TemplateDict = ConvertDealTemplateDataGramsToOpDataElementUIs(ret.TemplateData);

            ////lock (LOCK_OBJECT)
            ////{
            ////    _getTemplateData = ret;
            ////    return ret;
            ////}

        }
        private static TemplateWrapper _getTemplateData;


        
        private OpDataElementUITemplates ConvertDealTemplateDataGramsToOpDataElementUIs(List<DealTemplateDataGram> templateData)
        {
            // TODO replace with proper DB call

            return new OpDataElementUITemplates
            {
                [OpDataElementType.Contract.ToString()] = new OpDataElementUITemplate
                {
                    new OpDataElementUI
                    {
                        AtrbID = 11,
                        AtrbCd = "dc_id",
                        AtrbValue = "",
                        DcID = 0,
                        DcAltID = 0
                    },
                    new OpDataElementUI
                    {
                        AtrbID = 12,
                        AtrbCd = "dc_parent_id",
                        AtrbValue = "",
                        DcID = 0,
                        DcAltID = 0
                    },
                    new OpDataElementUI
                    {
                        AtrbID = 2,
                        AtrbCd = "START_DT",
                        AtrbValue = "",
                        DcID = 0,
                        DcAltID = 0
                    },
                    new OpDataElementUI
                    {
                        AtrbID = 3,
                        AtrbCd = "END_DT",
                        AtrbValue = "",
                        DcID = 0,
                        DcAltID = 0
                    },
                    new OpDataElementUI
                    {
                        AtrbID = 4,
                        AtrbCd = "DEAL_STG_CD",
                        AtrbValue = "",
                        DcID = 0,
                        DcAltID = 0
                    },
                    new OpDataElementUI
                    {
                        AtrbID = 5,
                        AtrbCd = "OBJSET_TYPE_CD",
                        AtrbValue = "",
                        DcID = 0,
                        DcAltID = 0
                    },
                    new OpDataElementUI
                    {
                        AtrbID = 6,
                        AtrbCd = "CUST_NM",
                        AtrbValue = "",
                        DcID = 0,
                        DcAltID = 0
                    },
                    new OpDataElementUI
                    {
                        AtrbID = 7,
                        AtrbCd = "TITLE",
                        AtrbValue = "",
                        DcID = 0,
                        DcAltID = 0
                    },
                    new OpDataElementUI
                    {
                        AtrbID = 8,
                        AtrbCd = "CUST_ACCEPTED",
                        AtrbValue = "",
                        DcID = 0,
                        DcAltID = 0
                    },
                    new OpDataElementUI
                    {
                        AtrbID = 9,
                        AtrbCd = "C2A_REF",
                        AtrbValue = "",
                        DcID = 0,
                        DcAltID = 0
                    },
                    new OpDataElementUI
                    {
                        AtrbID = 9,
                        AtrbCd = "NUM_TIERS",
                        AtrbValue = 1,
                        DcID = 0,
                        DcAltID = 0
                    }
                },
                [OpDataElementType.PricingStrategy.ToString()] = new OpDataElementUITemplate
                {
                    new OpDataElementUI
                    {
                        AtrbID = 11,
                        AtrbCd = "dc_id",
                        AtrbValue = "",
                        DcID = 0,
                        DcAltID = 0
                    },
                    new OpDataElementUI
                    {
                        AtrbID = 12,
                        AtrbCd = "dc_parent_id",
                        AtrbValue = "",
                        DcID = 0,
                        DcAltID = 0
                    },
                    new OpDataElementUI
                    {
                        AtrbID = 13,
                        AtrbCd = "START_DT",
                        AtrbValue = "",
                        DcID = 0,
                        DcAltID = 0
                    },
                    new OpDataElementUI
                    {
                        AtrbID = 14,
                        AtrbCd = "END_DT",
                        AtrbValue = "",
                        DcID = 0,
                        DcAltID = 0
                    },
                    new OpDataElementUI
                    {
                        AtrbID = 15,
                        AtrbCd = "TITLE",
                        AtrbValue = "",
                        DcID = 0,
                        DcAltID = 0
                    },
                    new OpDataElementUI
                    {
                        AtrbID = 16,
                        AtrbCd = "TERMS",
                        AtrbValue = "",
                        DcID = 0,
                        DcAltID = 0
                    },
                    new OpDataElementUI
                    {
                        AtrbID = 17,
                        AtrbCd = "OBJSET_TYPE",
                        AtrbValue = "",
                        DcID = 0,
                        DcAltID = 0
                    }
                }
            };


////            Dictionary<string, List<OpDataElementUI>> ret = new Dictionary<string, List<OpDataElementUI>>();

////            AttributeCollection atrb_mstr = DataCollections.GetAttributeData();
////            foreach (var dd in templateData)
////            {
////                MyDealsAttribute atrb = null;
////                if (!atrb_mstr.TryGetValue(dd.ATRB_SID ?? -1, out atrb))
////                {
////#if DEBUG
////                    System.Diagnostics.Debug.WriteLine(string.Format("DcsDealLibClient.GetTemplates: Error resolving Attribute ID: {0}", dd.ATRB_SID));
////#endif
////                    continue;
////                }


////                List<OpDataElementUI> coll;
////                if (!ret.TryGetValue(dd.DEAL_TYPE_CD, out coll))
////                {
////                    ret[dd.DEAL_TYPE_CD] = coll = new List<OpDataElementUI>();
////                }


////                // Get the value from the database...
////                var value = OpUtilities.Coalesce
////                    (
////                        dd.ATRB_VAL_INT,
////                        dd.ATRB_VAL_CHAR,
////                        dd.ATRB_VAL_MONEY,
////                        dd.ATRB_VAL_DTM,
////                        dd.ATRB_VAL_CHAR_MAX
////                    );

////                if (value != null)
////                {
////                    // A Bit hackish, but this was the only way I could think to do this.
////                    // conver to switch as needed if we add more types.
////                    if (atrb.DOT_NET_DATA_TYPE == "System.Boolean")
////                    {
////                        value = OpTypeConverter.StringToNullableBool(value) ?? false;
////                    }
////                }

////                // TODO: Fully resolve dim Key.

////                // Create the data element from the db values...
////                var ode = new OpDataElementUI(false)
////                {
////                    AtrbID = atrb.ATRB_SID,
////                    AtrbValue = value,
////                    DcID = dd.DEAL_ID ?? 0,
////                    DimKey = dd.DEAL_ATRB_MTX_HASH,
////                    OrigAtrbValue = value,
////                    PrevAtrbValue = value,
////                    DefaultValue = string.Format("{0}", value),
////                    DataType = atrb.DOT_NET_DATA_TYPE,
////                    AtrbCd = atrb.ATRB_CD,
////                    Description = atrb.ATRB_DESC,
////                    Label = atrb.ATRB_LBL,
////                    Order = dd.ATRB_ORDER ?? 0,
////                    SectionCD = dd.ATRB_SCTN_CD,
////                    SectionDesc = dd.ATRB_SCTN_DESC,
////                    SectionOrder = dd.ATRB_SCTN_ORDER ?? 0,
////                    State = OpDataElementState.Unchanged,
////                    UITypeCD = atrb.UI_TYPE_CD,
////                    Source = OpSourceLocation.Template,
////                    StringFormatMask = atrb.FMT_MSK
////                };

////                if (dd.PLI_GUID != null)
////                {
////                    ode.ExtraDimKey.Add(
////                        AttributeCodes.PLI_GUID,
////                        OpAtrbMap.NOT_SET_TAG
////                        );
////                }

////                if (dd.AGRMNT_GUID != null)
////                {
////                    ode.ExtraDimKey.Add(
////                        AttributeCodes.AGRMNT_GUID,
////                        OpAtrbMap.NOT_SET_TAG
////                        );
////                }

////                // Try to fully resolve the dim key
////                if (ode.DimKey != null && ode.DimKey.Count > 0)
////                {
////                    foreach (var di in ode.DimKey)
////                    {
////                        // See if we have master data for it...
////                        var mstr_item = atrb_mstr.LookupGet(di.AtrbID, di.AtrbItemId);
////                        if (mstr_item == null)
////                        {
////                            // If not, just try to get the ATRB_CD
////                            MyDealsAttribute odk_atrb;
////                            if (atrb_mstr.TryGetValue(di.AtrbID, out odk_atrb))
////                            {
////                                di.AtrbCd = odk_atrb.ATRB_CD;
////                            }
////                            continue;
////                        }

////                        // Else set values
////                        di.AtrbCd = mstr_item.AtrbCd;
////                        di.AtrbItemValue = mstr_item.AtrbItemValue;
////                    }
////                }

////                coll.Add(ode);
////            }

////            return ret;
        }


    }

}
