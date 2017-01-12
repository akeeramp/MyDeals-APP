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
                        [OpDataElementType.PricingTable] = new OpDataPacket<OpDataElementType>
                        {
                            Data =
                            {
                                [id] = new OpDataCollector
                                {
                                    DcID = id,
                                    DcAltID = 0,
                                    DcType = OpDataElementType.PricingTable.ToString(),
                                    DataElements = new List<OpDataElement>()
                                }
                            }
                        },
                        [OpDataElementType.WipDeals] = new OpDataPacket<OpDataElementType>
                        {
                            Data =
                            {
                                [id] = new OpDataCollector
                                {
                                    DcID = id,
                                    DcAltID = 0,
                                    DcType = OpDataElementType.WipDeals.ToString(),
                                    DataElements = new List<OpDataElement>()
                                }
                            }
                        }
                    };
                }


                // TODO replace with DB call
                MyDealsData data = new MyDealsData
                {
                    [OpDataElementType.PricingTable] = new OpDataPacket<OpDataElementType>
                    {
                        Data =
                        {
                            [1] = new OpDataCollector
                            {
                                DcID = 1,
                                DcAltID = 0,
                                DcType = OpDataElementType.PricingTable.ToString(),
                                DataElements = new List<OpDataElement>
                                {
                                    new OpDataElement
                                    {
                                        AtrbID = 126,
                                        AtrbCd = "TEXT",
                                        AtrbValue = "Hello World",
                                        DcID = -300,
                                        DcAltID = 1
                                    },
                                    new OpDataElement
                                    {
                                        AtrbID = 125,
                                        AtrbCd = "TITLE",
                                        AtrbValue = "Kit",
                                        DcID = -300,
                                        DcAltID = 1,
                                        DimID = 1
                                    },
                                    new OpDataElement
                                    {
                                        AtrbID = 126,
                                        AtrbCd = "TEXT",
                                        AtrbValue = "Hello World 1",
                                        DcID = -300,
                                        DcAltID = 1,
                                        DimID = 1
                                    },
                                    new OpDataElement
                                    {
                                        AtrbID = 127,
                                        AtrbCd = "INT",
                                        AtrbValue = 1231,
                                        DcID = -300,
                                        DcAltID = 1,
                                        DimID = 1
                                    },
                                    new OpDataElement
                                    {
                                        AtrbID = 128,
                                        AtrbCd = "DATE",
                                        AtrbValue = "2/1/2017",
                                        DcID = -300,
                                        DcAltID = 1,
                                        DimID = 1
                                    },
                                    new OpDataElement
                                    {
                                        AtrbID = 129,
                                        AtrbCd = "data",
                                        AtrbValue = "Deal Type",
                                        DcID = -300,
                                        DcAltID = 1,
                                        DimID = 1
                                    },
                                    new OpDataElement
                                    {
                                        AtrbID = 125,
                                        AtrbCd = "TITLE",
                                        AtrbValue = "Kit",
                                        DcID = -300,
                                        DcAltID = 1,
                                        DimID = 2
                                    },
                                    new OpDataElement
                                    {
                                        AtrbID = 126,
                                        AtrbCd = "TEXT",
                                        AtrbValue = "Hello World 2",
                                        DcID = -300,
                                        DcAltID = 1,
                                        DimID = 2
                                    },
                                    new OpDataElement
                                    {
                                        AtrbID = 127,
                                        AtrbCd = "INT",
                                        AtrbValue = 1232,
                                        DcID = -300,
                                        DcAltID = 1,
                                        DimID = 2
                                    },
                                    new OpDataElement
                                    {
                                        AtrbID = 128,
                                        AtrbCd = "DATE",
                                        AtrbValue = "2/2/2017",
                                        DcID = -300,
                                        DcAltID = 1,
                                        DimID = 2
                                    },
                                    new OpDataElement
                                    {
                                        AtrbID = 129,
                                        AtrbCd = "data",
                                        AtrbValue = "Deal Type",
                                        DcID = -300,
                                        DcAltID = 1,
                                        DimID = 2
                                    },
                                    new OpDataElement
                                    {
                                        AtrbID = 125,
                                        AtrbCd = "TITLE",
                                        AtrbValue = "Kit",
                                        DcID = -300,
                                        DcAltID = 1,
                                        DimID = 3
                                    },
                                    new OpDataElement
                                    {
                                        AtrbID = 126,
                                        AtrbCd = "TEXT",
                                        AtrbValue = "Hello World 3",
                                        DcID = -300,
                                        DcAltID = 1,
                                        DimID = 3
                                    },
                                    new OpDataElement
                                    {
                                        AtrbID = 127,
                                        AtrbCd = "INT",
                                        AtrbValue = 1233,
                                        DcID = -300,
                                        DcAltID = 1,
                                        DimID = 3
                                    },
                                    new OpDataElement
                                    {
                                        AtrbID = 128,
                                        AtrbCd = "DATE",
                                        AtrbValue = "2/3/2017",
                                        DcID = -300,
                                        DcAltID = 1,
                                        DimID = 3
                                    },
                                    new OpDataElement
                                    {
                                        AtrbID = 129,
                                        AtrbCd = "data",
                                        AtrbValue = "Deal Type",
                                        DcID = -300,
                                        DcAltID = 1,
                                        DimID = 3
                                    }
                                }
                            }
                        }
                    },
                    [OpDataElementType.WipDeals] = new OpDataPacket<OpDataElementType>
                    {
                        Data =
                        {
                            [1] = new OpDataCollector
                            {
                                DcID = 1,
                                DcAltID = 1,
                                DcType = OpDataElementType.WipDeals.ToString(),
                                DataElements = new List<OpDataElement>
                                {
                                    new OpDataElement
                                    {
                                        AtrbID = 126,
                                        AtrbCd = "TEXT",
                                        AtrbValue = "Hello World 1",
                                        DcID = -300,
                                        DcAltID = 1
                                    },
                                    new OpDataElement
                                    {
                                        AtrbID = 127,
                                        AtrbCd = "INT",
                                        AtrbValue = 1231,
                                        DcID = -300,
                                        DcAltID = 1
                                    },
                                    new OpDataElement
                                    {
                                        AtrbID = 128,
                                        AtrbCd = "DATE",
                                        AtrbValue = "2/1/2017",
                                        DcID = -300,
                                        DcAltID = 1
                                    },
                                    new OpDataElement
                                    {
                                        AtrbID = 129,
                                        AtrbCd = "DROPDOWN",
                                        AtrbValue = "DROPDOWN 3",
                                        DcID = -300,
                                        DcAltID = 1
                                    },
                                    new OpDataElement
                                    {
                                        AtrbID = 125,
                                        AtrbCd = "COMBOBOX",
                                        AtrbValue = "COMBOBOX 2",
                                        DcID = -300,
                                        DcAltID = 1
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
