using Intel.MyDeals.DataLibrary;

namespace Intel.MyDeals.BusinessLogic
{
    public class JmsLib
    {
        // TODO - Insert Button1 items here
        // TODO - Build XML here

        public void JmsTest()
        {
            //string m_idsid = "mhtippin";

            JmsDataLib jmsConnection = new JmsDataLib();

            jmsConnection.OpenConnectionToJmsQueue();

            //Send Data
            //DataTable dt = GetData();
            //string data = MakeXml(dt);

            //string errorMessages = jmsConnection.SendDataToJmsQueue(data);

            //if (errorMessages != string.Empty)
            //{
            //    MessageBox.Show("I have a fatal error - " + errorMessages);
            //}
            //else
            //{
            //    MessageBox.Show("XML seems to have been accepted.");
            //}

            //Close Connection
            jmsConnection.CloseConnectionToJmsQueue();
        }

    }
}
