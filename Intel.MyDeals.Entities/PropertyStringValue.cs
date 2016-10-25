
namespace Intel.MyDeals.Entities
{
    public class PropertyStringValue : System.Attribute
    {
        public PropertyStringValue() { }
        public PropertyStringValue(string stringValue)
        {
            StringValue = stringValue;
        }
        public string StringValue { set; get; }

        // TODO: Provide static getters to resolve value more easily form PropertyInfo
    }
}
