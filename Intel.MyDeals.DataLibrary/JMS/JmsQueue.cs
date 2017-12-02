using System;
using TIBCO.EMS;

namespace Intel.MyDeals.DataLibrary.JMS
{
    class JmsQueue
    {
        private QueueConnectionFactory m_queueConnectionFactory;
        private QueueConnection m_queueConnection;
        private QueueSession m_queueSession;
        private Queue m_queue;

        private string m_strUrl = "";
        private string m_strUserId = "";
        private string m_strPassword = "";
        private string m_strQueueName = "";

        public string ServerUrl
        {
            get { return m_strUrl; }
            set { m_strUrl = value; }
        }

        public string UserId
        {
            get { return m_strUserId; }
            set { m_strUserId = value; }
        }

        public string Password
        {
            get { return m_strPassword; }
            set { m_strPassword = value; }
        }

        public string QueueName
        {
            get { return m_strQueueName; }
            set { m_strQueueName = value; }
        }

        public QueueSession CurrentSession
        {
            get { return m_queueSession; }
            set { m_queueSession = value; }
        }

        public Queue CurrentQueue
        {
            get { return m_queue; }
            set { m_queue = value; }
        }

        public QueueConnection QueueConnect
        {
            get { return m_queueConnection; }
            set { m_queueConnection = value; }
        }

        // --- Constructors ------------------------------------------------------------------------------------------

        public JmsQueue()
        {
            try
            {
            }
            catch (Exception)
            {

            }
        }

        public JmsQueue(string strServerUrl, string strUserId, string strPassword, string strQueueName)
        {
            try
            {
                m_strUrl = strServerUrl;
                m_strUserId = strUserId;
                m_strPassword = strPassword;
                m_strQueueName = strQueueName;

            }
            catch (Exception)
            {

            }
        }

        // --- Commands ----------------------------------------------------------------------------------------------

        public virtual void OpenQueueConnection()
        {
            try
            {
                m_queueConnectionFactory = new QueueConnectionFactory(m_strUrl);
                m_queueConnection = m_queueConnectionFactory.CreateQueueConnection(m_strUserId, m_strPassword);
                m_queueSession = m_queueConnection.CreateQueueSession(false, Session.CLIENT_ACKNOWLEDGE);

                m_queue = m_queueSession.CreateQueue(m_strQueueName);
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }

        }

        public void CloseQueueConnection()
        {
            try
            {
                m_queueConnection.Close();
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public void SendData(string strXmlData)
        {
            try
            {
                //Gets the currentsession and creates a QueueSender, using the queuename initialised in Constructor
                QueueSession mySession = CurrentSession;
                QueueSender mySender = mySession.CreateSender(CurrentQueue);

                //Convert the string string to textMessage object and send it using QueueSender object created 
                TextMessage message = mySession.CreateTextMessage();

                message.Text = strXmlData;

                mySender.Send(message);
                //Close the QueueSender, but not the connection/Session to the server.
                mySender.Close();
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public string GetData()
        {
            try
            {
                QueueSession mySession = CurrentSession;

                QueueReceiver myReceiver = mySession.CreateReceiver(CurrentQueue);

                string messageReceive = null;
                m_queueConnection.Start();

                Message message = myReceiver.Receive();

                if (message != null)
                {
                    message.Acknowledge();

                    if (message is TextMessage)
                    {
                        TextMessage tm = (TextMessage)message;
                        messageReceive = tm.Text;
                        //Console.WriteLine("Received message: \n" + tm.Text);
                        //Console.WriteLine("-----End of Message----");
                        //Console.WriteLine();
                    }
                    else
                    {
                        //Console.WriteLine("Received message: \n" + message);
                        //Console.WriteLine("-----End of Message----");
                        //Console.WriteLine();
                    }
                    message.ClearProperties();
                    message.ClearBody();
                }

                m_queueConnection.Close();
                return messageReceive;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }


        public string GetAllMessgae()
        {
            QueueSession mySession = m_queueConnection.CreateQueueSession(false, Session.AUTO_ACKNOWLEDGE);

            string messageReceive = null;
            MessageConsumer obj = mySession.CreateConsumer(CurrentQueue);

            TIBCO.EMS.QueueBrowser browser = CurrentSession.CreateBrowser(CurrentQueue);

            System.Collections.IEnumerator msgs = browser.GetEnumerator();
            int browseCount = 0;
            string str = string.Empty;
            TIBCO.EMS.Message message = null;
            m_queueConnection.Start();

            while (msgs.MoveNext())
            {
                message = (TIBCO.EMS.Message)msgs.Current;
                str = "\nBrowsed message: ID=" + message.MessageID + str;
                Message messageobj = obj.Receive();

                if (message is TextMessage)
                {
                    TextMessage tm = (TextMessage)messageobj;
                    messageReceive = tm.Text + "," + messageReceive;
                    //Console.WriteLine("Received message: \n" + tm.Text);
                    //Console.WriteLine("-----End of Message----");
                    //Console.WriteLine();
                    tm.ClearBody();
                    browseCount++;
                }
                messageobj.ClearProperties();
                messageobj.ClearBody();
                message.ClearProperties();
                message.ClearBody();
            }

            m_queueConnection.Close();
            browser.Reset();

            return messageReceive ?? (messageReceive = "No message in the queue");
        }

        public string RecieveMessage()
        {
            string messageReceive = string.Empty;
            QueueConnectionFactory factory = new TIBCO.EMS.QueueConnectionFactory(ServerUrl);

            QueueConnection connection = factory.CreateQueueConnection(m_strUserId, m_strPassword);

            QueueSession session = connection.CreateQueueSession(false, Session.CLIENT_ACKNOWLEDGE);

            TIBCO.EMS.Queue queue = session.CreateQueue(QueueName);

            QueueReceiver receiver = session.CreateReceiver(queue);

            connection.Start();

            while (true)
            {
                Message message = receiver.Receive();
                if (message == null)
                {
                    break;
                }

                message.Acknowledge();

                if (message is TextMessage)
                {
                    TextMessage tm = (TextMessage)message;
                    messageReceive = tm.Text + "," + messageReceive;
                    //Console.WriteLine("Received message: \n" + tm.Text);
                    //Console.WriteLine("-----End of Message----");
                    //Console.WriteLine();
                }
                else
                {
                    //Console.WriteLine("Received message: \n" + message);
                    //Console.WriteLine("-----End of Message----");
                    //Console.WriteLine();
                }
                message.ClearProperties();
                message.ClearBody();
            }

            connection.Close();
            return messageReceive;
        }

    }
}
