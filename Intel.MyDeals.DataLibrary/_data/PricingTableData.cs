using System.Collections.Generic;
using Intel.MyDeals.Entities;
using Intel.Opaque.Data;

namespace Intel.MyDeals.DataLibrary
{
    public static class PricingTableData
    {
        private static Dictionary<int, MyDealsData> Data { get; set; }

        public static void SaveData(int id, MyDealsData data)
        {
            Data[id] = data;
        }

        public static MyDealsData GetData(int id)
        {
            if (Data == null) Data = new Dictionary<int, MyDealsData>();

            // TODO replace with DB call
            if (!Data.ContainsKey(id))
            {
                
                if (id < 110)
                {
                    return new MyDealsData
                    {
                        [OpDataElementType.PRC_TBL] = new OpDataPacket<OpDataElementType>
                        {
                            Data =
                            {
                                [id] = new OpDataCollector
                                {
                                    DcID = id,
                                    DcParentID = 0,
                                    DcParentType = OpDataElementType.CNTRCT.ToString(),
                                    DcType = OpDataElementType.PRC_TBL.ToString(),
                                    DataElements = new List<OpDataElement>()
                                }
                            }
                        },
                        [OpDataElementType.WIP_DEAL] = new OpDataPacket<OpDataElementType>
                        {
                            Data =
                            {
                                [id] = new OpDataCollector
                                {
                                    DcID = id,
                                    DcParentID = 0,
                                    DcParentType = OpDataElementType.PRC_TBL.ToString(),
                                    DcType = OpDataElementType.WIP_DEAL.ToString(),
                                    DataElements = new List<OpDataElement>()
                                }
                            }
                        }
                    };
                }


                // TODO replace with DB call
                MyDealsData data = new MyDealsData
                {
                    [OpDataElementType.PRC_TBL] = new OpDataPacket<OpDataElementType>
                    {
                        Data =
                        {
                            [1] = new OpDataCollector
                            {
                                DcID = 1,
                                DcParentID = 0,
                                DcParentType = OpDataElementType.PRC_ST.ToString(),
                                DcType = OpDataElementType.PRC_TBL.ToString(),
                                DataElements = new List<OpDataElement>
                                {
                                    new OpDataElement
                                    {
                                        AtrbID = 126,
                                        AtrbCd = "TEXT",
                                        AtrbValue = "Hello World",
                                        DcID = -300,
                                        DcType = OpDataElementType.PRC_TBL.ToId(),
                                        DcParentID = 1,
                                        DcParentType = OpDataElementType.PRC_ST.ToId()
                                    },
                                    new OpDataElement
                                    {
                                        AtrbID = 125,
                                        AtrbCd = "TITLE",
                                        AtrbValue = "Kit",
                                        DcID = -300,
                                        DcType = OpDataElementType.PRC_TBL.ToId(),
                                        DcParentID = 1,
                                        DcParentType = OpDataElementType.PRC_ST.ToId(),
                                        DimID = 1
                                    },
                                    new OpDataElement
                                    {
                                        AtrbID = 126,
                                        AtrbCd = "TEXT",
                                        AtrbValue = "Hello World 1",
                                        DcID = -300,
                                        DcType = OpDataElementType.PRC_TBL.ToId(),
                                        DcParentID = 1,
                                        DcParentType = OpDataElementType.PRC_ST.ToId(),
                                        DimID = 1
                                    },
                                    new OpDataElement
                                    {
                                        AtrbID = 127,
                                        AtrbCd = "INT",
                                        AtrbValue = 1231,
                                        DcID = -300,
                                        DcType = OpDataElementType.PRC_TBL.ToId(),
                                        DcParentID = 1,
                                        DcParentType = OpDataElementType.PRC_ST.ToId(),
                                        DimID = 1
                                    },
                                    new OpDataElement
                                    {
                                        AtrbID = 128,
                                        AtrbCd = "DATE",
                                        AtrbValue = "2/1/2017",
                                        DcID = -300,
                                        DcType = OpDataElementType.PRC_TBL.ToId(),
                                        DcParentID = 1,
                                        DcParentType = OpDataElementType.PRC_ST.ToId(),
                                        DimID = 1
                                    },
                                    new OpDataElement
                                    {
                                        AtrbID = 129,
                                        AtrbCd = "data",
                                        AtrbValue = "Deal Type",
                                        DcID = -300,
                                        DcType = OpDataElementType.PRC_TBL.ToId(),
                                        DcParentID = 1,
                                        DcParentType = OpDataElementType.PRC_ST.ToId(),
                                        DimID = 1
                                    },
                                    new OpDataElement
                                    {
                                        AtrbID = 125,
                                        AtrbCd = "TITLE",
                                        AtrbValue = "Primary",
                                        DcID = -300,
                                        DcType = OpDataElementType.PRC_TBL.ToId(),
                                        DcParentID = 1,
                                        DcParentType = OpDataElementType.PRC_ST.ToId(),
                                        DimID = 2
                                    },
                                    new OpDataElement
                                    {
                                        AtrbID = 126,
                                        AtrbCd = "TEXT",
                                        AtrbValue = "Hello World 2",
                                        DcID = -300,
                                        DcType = OpDataElementType.PRC_TBL.ToId(),
                                        DcParentID = 1,
                                        DcParentType = OpDataElementType.PRC_ST.ToId(),
                                        DimID = 2
                                    },
                                    new OpDataElement
                                    {
                                        AtrbID = 127,
                                        AtrbCd = "INT",
                                        AtrbValue = 1232,
                                        DcID = -300,
                                        DcType = OpDataElementType.PRC_TBL.ToId(),
                                        DcParentID = 1,
                                        DcParentType = OpDataElementType.PRC_ST.ToId(),
                                        DimID = 2
                                    },
                                    new OpDataElement
                                    {
                                        AtrbID = 128,
                                        AtrbCd = "DATE",
                                        AtrbValue = "2/2/2017",
                                        DcID = -300,
                                        DcType = OpDataElementType.PRC_TBL.ToId(),
                                        DcParentID = 1,
                                        DcParentType = OpDataElementType.PRC_ST.ToId(),
                                        DimID = 2
                                    },
                                    new OpDataElement
                                    {
                                        AtrbID = 129,
                                        AtrbCd = "data",
                                        AtrbValue = "Deal Type",
                                        DcID = -300,
                                        DcType = OpDataElementType.PRC_TBL.ToId(),
                                        DcParentID = 1,
                                        DcParentType = OpDataElementType.PRC_ST.ToId(),
                                        DimID = 2
                                    },
                                    new OpDataElement
                                    {
                                        AtrbID = 125,
                                        AtrbCd = "TITLE",
                                        AtrbValue = "Secondary 1",
                                        DcID = -300,
                                        DcType = OpDataElementType.PRC_TBL.ToId(),
                                        DcParentID = 1,
                                        DcParentType = OpDataElementType.PRC_ST.ToId(),
                                        DimID = 3
                                    },
                                    new OpDataElement
                                    {
                                        AtrbID = 126,
                                        AtrbCd = "TEXT",
                                        AtrbValue = "Hello World 3",
                                        DcID = -300,
                                        DcType = OpDataElementType.PRC_TBL.ToId(),
                                        DcParentID = 1,
                                        DcParentType = OpDataElementType.PRC_ST.ToId(),
                                        DimID = 3
                                    },
                                    new OpDataElement
                                    {
                                        AtrbID = 127,
                                        AtrbCd = "INT",
                                        AtrbValue = 1233,
                                        DcID = -300,
                                        DcType = OpDataElementType.PRC_TBL.ToId(),
                                        DcParentID = 1,
                                        DcParentType = OpDataElementType.PRC_ST.ToId(),
                                        DimID = 3
                                    },
                                    new OpDataElement
                                    {
                                        AtrbID = 128,
                                        AtrbCd = "DATE",
                                        AtrbValue = "2/3/2017",
                                        DcID = -300,
                                        DcType = OpDataElementType.PRC_TBL.ToId(),
                                        DcParentID = 1,
                                        DcParentType = OpDataElementType.PRC_ST.ToId(),
                                        DimID = 3
                                    },
                                    new OpDataElement
                                    {
                                        AtrbID = 129,
                                        AtrbCd = "data",
                                        AtrbValue = "Deal Type",
                                        DcID = -300,
                                        DcType = OpDataElementType.PRC_TBL.ToId(),
                                        DcParentID = 1,
                                        DcParentType = OpDataElementType.PRC_ST.ToId(),
                                        DimID = 3
                                    }
                                }
                            }
                        }
                    },
                    [OpDataElementType.WIP_DEAL] = new OpDataPacket<OpDataElementType>
                    {
                        Data =
                        {
                            [1] = new OpDataCollector
                            {
                                DcID = 1,
                                DcParentID = 1,
                                DcParentType = OpDataElementType.PRC_TBL.ToString(),
                                DcType = OpDataElementType.WIP_DEAL.ToString(),
                                DataElements = new List<OpDataElement>
                                {
                                    new OpDataElement
                                    {
                                        AtrbID = 126,
                                        AtrbCd = "TEXT",
                                        AtrbValue = "Hello World 1",
                                        DcID = -300,
                                        DcParentID = 1,
                                        DcParentType = OpDataElementType.PRC_TBL.ToId(),
                                        DcType = OpDataElementType.WIP_DEAL.ToId()
                                    },
                                    new OpDataElement
                                    {
                                        AtrbID = 127,
                                        AtrbCd = "INT",
                                        AtrbValue = 1231,
                                        DcID = -300,
                                        DcParentID = 1,
                                        DcParentType = OpDataElementType.PRC_TBL.ToId(),
                                        DcType = OpDataElementType.WIP_DEAL.ToId()
                                    },
                                    new OpDataElement
                                    {
                                        AtrbID = 128,
                                        AtrbCd = "DATE",
                                        AtrbValue = "2/1/2017",
                                        DcID = -300,
                                        DcParentID = 1,
                                        DcParentType = OpDataElementType.PRC_TBL.ToId(),
                                        DcType = OpDataElementType.WIP_DEAL.ToId()
                                    },
                                    new OpDataElement
                                    {
                                        AtrbID = 129,
                                        AtrbCd = "DROPDOWN",
                                        AtrbValue = "DROPDOWN 3",
                                        DcID = -300,
                                        DcParentID = 1,
                                        DcParentType = OpDataElementType.PRC_TBL.ToId(),
                                        DcType = OpDataElementType.WIP_DEAL.ToId()
                                    },
                                    new OpDataElement
                                    {
                                        AtrbID = 125,
                                        AtrbCd = "COMBOBOX",
                                        AtrbValue = "COMBOBOX 2",
                                        DcID = -300,
                                        DcParentID = 1,
                                        DcParentType = OpDataElementType.PRC_TBL.ToId(),
                                        DcType = OpDataElementType.WIP_DEAL.ToId()
                                    },


                                    new OpDataElement
                                    {
                                        AtrbID = 1250,
                                        AtrbCd = "TITLE",
                                        AtrbValue = "Kit",
                                        DcID = -300,
                                        DcParentID = 1,
                                        DcParentType = OpDataElementType.PRC_TBL.ToId(),
                                        DcType = OpDataElementType.WIP_DEAL.ToId(),
                                        DimID = 1
                                    },
                                    new OpDataElement
                                    {
                                        AtrbID = 126,
                                        AtrbCd = "TEXT",
                                        AtrbValue = "Hello World 1",
                                        DcID = -300,
                                        DcParentID = 1,
                                        DcParentType = OpDataElementType.PRC_TBL.ToId(),
                                        DcType = OpDataElementType.WIP_DEAL.ToId(),
                                        DimID = 1
                                    },
                                    new OpDataElement
                                    {
                                        AtrbID = 127,
                                        AtrbCd = "INT",
                                        AtrbValue = 1231,
                                        DcID = -300,
                                        DcParentID = 1,
                                        DcParentType = OpDataElementType.PRC_TBL.ToId(),
                                        DcType = OpDataElementType.WIP_DEAL.ToId(),
                                        DimID = 1
                                    },
                                    new OpDataElement
                                    {
                                        AtrbID = 128,
                                        AtrbCd = "DATE",
                                        AtrbValue = "2/1/2017",
                                        DcID = -300,
                                        DcParentID = 1,
                                        DcParentType = OpDataElementType.PRC_TBL.ToId(),
                                        DcType = OpDataElementType.WIP_DEAL.ToId(),
                                        DimID = 1
                                    },
                                    new OpDataElement
                                    {
                                        AtrbID = 129,
                                        AtrbCd = "DROPDOWN",
                                        AtrbValue = "DROPDOWN 3",
                                        DcID = -300,
                                        DcParentID = 1,
                                        DcParentType = OpDataElementType.PRC_TBL.ToId(),
                                        DcType = OpDataElementType.WIP_DEAL.ToId(),
                                        DimID = 1
                                    },
                                    new OpDataElement
                                    {
                                        AtrbID = 125,
                                        AtrbCd = "COMBOBOX",
                                        AtrbValue = "COMBOBOX 2",
                                        DcID = -300,
                                        DcParentID = 1,
                                        DcParentType = OpDataElementType.PRC_TBL.ToId(),
                                        DcType = OpDataElementType.WIP_DEAL.ToId(),
                                        DimID = 1
                                    }

                                }
                            }
                        }
                    }
                };
                Data[id] = data;
            }

            return Data[id];
        }
    }
}
