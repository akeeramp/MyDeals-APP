using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using Intel.MyDeals.DataAccessLib;
using Intel.MyDeals.Entities;
using Intel.Opaque.DBAccess;
using Procs = Intel.MyDeals.DataAccessLib.StoredProcedures.MyDeals;


namespace Intel.MyDeals.DataLibrary
{
    public class MetaDataLib
    {
        public List<FilterAttribute> GetFilterAttributes()
        {
            return new List<FilterAttribute>();
            ////var ret = new List<FilterAttribute>();
            ////using (var rdr = DataAccess.ExecuteReader(new Procs.CDMS_MYDEALS.meta.PR_GET_FLTR_ATRB()))
            ////{
            ////    int IDX_Active = DB.GetReaderOrdinal(rdr, "Active");
            ////    int IDX_AtrbColNm = DB.GetReaderOrdinal(rdr, "AtrbColNm");
            ////    int IDX_AtrbGroup = DB.GetReaderOrdinal(rdr, "AtrbGroup");
            ////    int IDX_AtrbGroupOrder = DB.GetReaderOrdinal(rdr, "AtrbGroupOrder");
            ////    int IDX_AtrbId = DB.GetReaderOrdinal(rdr, "AtrbId");
            ////    int IDX_AtrbLabel = DB.GetReaderOrdinal(rdr, "AtrbLabel");
            ////    int IDX_DataType = DB.GetReaderOrdinal(rdr, "DataType");
            ////    int IDX_DimKey = DB.GetReaderOrdinal(rdr, "DimKey");
            ////    int IDX_Editor = DB.GetReaderOrdinal(rdr, "Editor");
            ////    int IDX_Encoded = DB.GetReaderOrdinal(rdr, "Encoded");
            ////    int IDX_Filterable = DB.GetReaderOrdinal(rdr, "Filterable");
            ////    int IDX_Format = DB.GetReaderOrdinal(rdr, "Format");
            ////    int IDX_GridTypeID = DB.GetReaderOrdinal(rdr, "GridTypeID");
            ////    int IDX_HeaderTemplate = DB.GetReaderOrdinal(rdr, "HeaderTemplate");
            ////    int IDX_HelpText = DB.GetReaderOrdinal(rdr, "HelpText");
            ////    int IDX_Hidden = DB.GetReaderOrdinal(rdr, "Hidden");
            ////    int IDX_ID = DB.GetReaderOrdinal(rdr, "ID");
            ////    int IDX_Lockable = DB.GetReaderOrdinal(rdr, "Lockable");
            ////    int IDX_Locked = DB.GetReaderOrdinal(rdr, "Locked");
            ////    int IDX_LookupText = DB.GetReaderOrdinal(rdr, "LookupText");
            ////    int IDX_LookupUrl = DB.GetReaderOrdinal(rdr, "LookupUrl");
            ////    int IDX_LookupValue = DB.GetReaderOrdinal(rdr, "LookupValue");
            ////    int IDX_Order = DB.GetReaderOrdinal(rdr, "Order");
            ////    int IDX_ReadOnly_class = DB.GetReaderOrdinal(rdr, "ReadOnly");
            ////    int IDX_Sortable = DB.GetReaderOrdinal(rdr, "Sortable");
            ////    int IDX_Template = DB.GetReaderOrdinal(rdr, "Template");
            ////    int IDX_UITypeID = DB.GetReaderOrdinal(rdr, "UITypeID");
            ////    int IDX_Width = DB.GetReaderOrdinal(rdr, "Width");

            ////    while (rdr.Read())
            ////    {
            ////        ret.Add(new FilterAttribute
            ////        {
            ////            Active = (IDX_Active < 0 || rdr.IsDBNull(IDX_Active)) ? default(System.Boolean) : ((bool)rdr[IDX_Active]),
            ////            AtrbColNm = (IDX_AtrbColNm < 0 || rdr.IsDBNull(IDX_AtrbColNm)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_AtrbColNm),
            ////            AtrbGroup = (IDX_AtrbGroup < 0 || rdr.IsDBNull(IDX_AtrbGroup)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_AtrbGroup),
            ////            AtrbGroupOrder = (IDX_AtrbGroupOrder < 0 || rdr.IsDBNull(IDX_AtrbGroupOrder)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_AtrbGroupOrder),
            ////            AtrbId = (IDX_AtrbId < 0 || rdr.IsDBNull(IDX_AtrbId)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_AtrbId),
            ////            AtrbLabel = (IDX_AtrbLabel < 0 || rdr.IsDBNull(IDX_AtrbLabel)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_AtrbLabel),
            ////            DataType = (IDX_DataType < 0 || rdr.IsDBNull(IDX_DataType)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_DataType),
            ////            DimKey = (IDX_DimKey < 0 || rdr.IsDBNull(IDX_DimKey)) ? default(System.Boolean) : ((bool)rdr[IDX_DimKey]),
            ////            Editor = (IDX_Editor < 0 || rdr.IsDBNull(IDX_Editor)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_Editor),
            ////            Encoded = (IDX_Encoded < 0 || rdr.IsDBNull(IDX_Encoded)) ? default(System.Boolean) : ((bool)rdr[IDX_Encoded]),
            ////            Filterable = (IDX_Filterable < 0 || rdr.IsDBNull(IDX_Filterable)) ? default(System.Boolean) : ((bool)rdr[IDX_Filterable]),
            ////            Format = (IDX_Format < 0 || rdr.IsDBNull(IDX_Format)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_Format),
            ////            GridTypeID = (IDX_GridTypeID < 0 || rdr.IsDBNull(IDX_GridTypeID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_GridTypeID),
            ////            HeaderTemplate = (IDX_HeaderTemplate < 0 || rdr.IsDBNull(IDX_HeaderTemplate)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_HeaderTemplate),
            ////            HelpText = (IDX_HelpText < 0 || rdr.IsDBNull(IDX_HelpText)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_HelpText),
            ////            Hidden = (IDX_Hidden < 0 || rdr.IsDBNull(IDX_Hidden)) ? default(System.Boolean) : ((bool)rdr[IDX_Hidden]),
            ////            ID = (IDX_ID < 0 || rdr.IsDBNull(IDX_ID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_ID),
            ////            Lockable = (IDX_Lockable < 0 || rdr.IsDBNull(IDX_Lockable)) ? default(System.Boolean) : ((bool)rdr[IDX_Lockable]),
            ////            Locked = (IDX_Locked < 0 || rdr.IsDBNull(IDX_Locked)) ? default(System.Boolean) : ((bool)rdr[IDX_Locked]),
            ////            LookupText = (IDX_LookupText < 0 || rdr.IsDBNull(IDX_LookupText)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_LookupText),
            ////            LookupUrl = (IDX_LookupUrl < 0 || rdr.IsDBNull(IDX_LookupUrl)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_LookupUrl),
            ////            LookupValue = (IDX_LookupValue < 0 || rdr.IsDBNull(IDX_LookupValue)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_LookupValue),
            ////            Order = (IDX_Order < 0 || rdr.IsDBNull(IDX_Order)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_Order),
            ////            ReadOnly_class = (IDX_ReadOnly_class < 0 || rdr.IsDBNull(IDX_ReadOnly_class)) ? default(System.Boolean) : ((bool)rdr[IDX_ReadOnly_class]),
            ////            Sortable = (IDX_Sortable < 0 || rdr.IsDBNull(IDX_Sortable)) ? default(System.Boolean) : ((bool)rdr[IDX_Sortable]),
            ////            Template = (IDX_Template < 0 || rdr.IsDBNull(IDX_Template)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_Template),
            ////            UITypeID = (IDX_UITypeID < 0 || rdr.IsDBNull(IDX_UITypeID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_UITypeID),
            ////            Width = (IDX_Width < 0 || rdr.IsDBNull(IDX_Width)) ? default(System.Double) : rdr.GetFieldValue<System.Double>(IDX_Width)
            ////        });
            ////    }
            ////}

            ////return ret;
        }

        public List<GridType> GetGridTypes()
        {
            return new List<GridType>();
            ////var ret = new List<GridType>();
            ////using (var rdr = DataAccess.ExecuteReader(new Procs.CDMS_MYDEALS.meta.PR_GET_GRID_TYPES()))
            ////{
            ////    int IDX_GridTypeID = DB.GetReaderOrdinal(rdr, "GridTypeID");
            ////    int IDX_GridTypeName = DB.GetReaderOrdinal(rdr, "GridTypeName");

            ////    while (rdr.Read())
            ////    {
            ////        ret.Add(new GridType
            ////        {
            ////            GridTypeID = (IDX_GridTypeID < 0 || rdr.IsDBNull(IDX_GridTypeID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_GridTypeID),
            ////            GridTypeName = (IDX_GridTypeName < 0 || rdr.IsDBNull(IDX_GridTypeName)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_GridTypeName)
            ////        });
            ////    }
            ////}

            ////return ret;
        }

        public List<Operator_class> GetOperators()
        {
            return new List<Operator_class>();
            ////var ret = new List<Operator_class>();
            ////using (var rdr = DataAccess.ExecuteReader(new Procs.CDMS_MYDEALS.meta.PR_GET_OPERATORS()))
            ////{
            ////    int IDX_Active = DB.GetReaderOrdinal(rdr, "Active");
            ////    int IDX_DisplayName = DB.GetReaderOrdinal(rdr, "DisplayName");
            ////    int IDX_ID = DB.GetReaderOrdinal(rdr, "ID");
            ////    int IDX_UITypeID = DB.GetReaderOrdinal(rdr, "UITypeID");
            ////    int IDX_Value = DB.GetReaderOrdinal(rdr, "Value");

            ////    while (rdr.Read())
            ////    {
            ////        ret.Add(new Operator_class
            ////        {
            ////            Active = (IDX_Active < 0 || rdr.IsDBNull(IDX_Active)) ? default(System.Boolean) : ((bool)rdr[IDX_Active]),
            ////            DisplayName = (IDX_DisplayName < 0 || rdr.IsDBNull(IDX_DisplayName)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_DisplayName),
            ////            ID = (IDX_ID < 0 || rdr.IsDBNull(IDX_ID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_ID),
            ////            UITypeID = (IDX_UITypeID < 0 || rdr.IsDBNull(IDX_UITypeID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_UITypeID),
            ////            Value = (IDX_Value < 0 || rdr.IsDBNull(IDX_Value)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_Value)
            ////        });
            ////    }
            ////}

            ////return ret;
        }

        public List<UIType> GetUITypes()
        {
            return new List<UIType>();

            ////var ret = new List<UIType>();
            ////using (var rdr = DataAccess.ExecuteReader(new Procs.CDMS_MYDEALS.meta.PR_GET_UI_TYPES()))
            ////{
            ////    int IDX_UITypeCd = DB.GetReaderOrdinal(rdr, "UITypeCd");
            ////    int IDX_UITypeID = DB.GetReaderOrdinal(rdr, "UITypeID");
            ////    int IDX_UITypeName = DB.GetReaderOrdinal(rdr, "UITypeName");

            ////    while (rdr.Read())
            ////    {
            ////        ret.Add(new UIType
            ////        {
            ////            UITypeCd = (IDX_UITypeCd < 0 || rdr.IsDBNull(IDX_UITypeCd)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_UITypeCd),
            ////            UITypeID = (IDX_UITypeID < 0 || rdr.IsDBNull(IDX_UITypeID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_UITypeID),
            ////            UITypeName = (IDX_UITypeName < 0 || rdr.IsDBNull(IDX_UITypeName)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_UITypeName)
            ////        });
            ////    }
            ////}

            ////return ret;
        }

    }
}
