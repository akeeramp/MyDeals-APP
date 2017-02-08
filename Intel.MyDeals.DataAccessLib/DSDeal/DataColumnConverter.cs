using System;
using System.Data;
using Intel.Opaque.Tools;

namespace Intel.MyDeals.DataAccessLib
{
    public class DataColumnConverter
    {
        /// <summary>
        /// For columns that we want to convert from one type to another, they must present
        /// a delegate matching this converter that can be called on each cell of that column
        /// to do the conversion.
        /// </summary>
        /// <param name="input">Data from a particular cell in a datatable</param>
        /// <returns>Converted data based on the rules of the converter.</returns>
        public delegate object DataColumnConverterDelegate(DataRow sourceRow, DataColumn sourceColumn);

        /// <summary>
        /// Column index of column containing the source data
        /// </summary>
        public DataColumn source_col { set; get; }
        /// <summary>
        /// Typed column where the converted data will be copied
        /// </summary>
        public DataColumn dest_col { set; get; }
        /// <summary>
        /// The converter used to do the conversion
        /// </summary>
        public DataColumnConverterDelegate ColumnConverterFunction { set; get; }

        // Since there are required args, make this private
        private DataColumnConverter() { }

        public DataColumnConverter(DataColumn src, DataColumn dest, DataColumnConverterDelegate converter)
        {
            if (src == null) { throw new ArgumentException("src column is required", "src"); }
            if (dest == null) { throw new ArgumentException("dest column is required", "dest"); }

            source_col = src;
            dest_col = dest;
            ColumnConverterFunction = converter;
        }

        public object Convert(DataRow sourceRow)
        {
            const string CAST_ERROR_MASK = "Unable to convert [{0}] value \"{1}\" to expected data type [{2}].";
            try
            {
                if (ColumnConverterFunction == null)
                {
                    return sourceRow[source_col];
                }

                return ColumnConverterFunction(sourceRow, source_col);
            }
            catch (Exception ex)
            {
                if (ex is InvalidCastException || ex is FormatException || ex is OverflowException)
                {
                    throw new InvalidOperationException(String.Format(CAST_ERROR_MASK,
                        (this.dest_col == null) ? "UNKNOWN" : this.dest_col.ColumnName,
                        sourceRow[source_col],
                        (this.dest_col == null) ? "UNKNOWN" : this.dest_col.DataType.Name
                        ), ex);
                }
                throw;
            }
        }

        public override string ToString()
        {
            return String.Format("[{0}] --> [{1}] as {2}",
                (this.source_col == null) ? "UNKNOWN" : this.source_col.ColumnName,
                (this.dest_col == null) ? "UNKNOWN" : this.dest_col.ColumnName,
                (this.dest_col == null ? "UNKNOWN" : this.dest_col.DataType.Name)
                );
        }


        public static DataColumnConverterDelegate ColumnToIntAction
        {
            get
            {
                return new DataColumnConverterDelegate((src_row, src_col) =>
                {
                    if (src_row == null || src_col == null) { return null; }
                    return OpTypeConverter.StringToNullableInt(src_row[src_col]);
                });
            }
        }
        public static DataColumnConverterDelegate ColumnToBoolAction
        {
            get
            {
                return new DataColumnConverterDelegate((src_row, src_col) =>
                {
                    if (src_row == null || src_col == null) { return null; }
                    return OpTypeConverter.StringToNullableBool(src_row[src_col]);
                });
            }
        }

    }
}