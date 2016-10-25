using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using System;

namespace Intel.MyDeals.Entities
{
    /// <summary>
    /// Converter used to format date values when JSON serializing.
    /// </summary>
    public class MyDateTimeConvertor : DateTimeConverterBase
    {
        public override object ReadJson(JsonReader reader, Type objectType, object existingValue, JsonSerializer serializer)
        {
            DateTime date;

            if (DateTime.TryParse(String.Format("{0}", reader.Value), out date))
            {
                return date;
            }

            return DateTime.MinValue;
        }

        public override void WriteJson(JsonWriter writer, object value, JsonSerializer serializer)
        {
            writer.WriteValue(ConvertDate(value));
        }

        public string ConvertDate(object value)
        {
            DateTime date;

            if (value is DateTime)
            {
                date = (DateTime)value;
            }
            else if (!DateTime.TryParse(String.Format("{0}", value), out date))
            {
                date = DateTime.MinValue;
            }

            int th = date.Hour + date.Minute + date.Second;

            return (th == 0 || th == 141) // 141 = 23 + 59 + 59, e.g. start of day or end of day, just return day value
                        ? String.Format("{0:MM/dd/yyyy}", date)
                        : String.Format("{0:MM/dd/yyyy HH:mm:ss.ffffff}", date);
        }
    }
}
