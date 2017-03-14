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

            //JMSQueue jmsQueue = new JMSQueue(m_strUrl, m_strUserId, m_strPassword, m_strQueueName);
            //jmsQueue.OpenQueueConnection();

            var blah2 = jmsConnection.ReadMessages();
            var blah = jmsConnection.GetData();
            int j = 0;
            //string blah = jmsQueue.GetAllMessgae();

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
