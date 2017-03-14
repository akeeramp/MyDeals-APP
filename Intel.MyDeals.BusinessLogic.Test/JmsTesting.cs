using Intel.MyDeals.DataLibrary;
using Intel.MyDeals.DataLibrary.Test;
using Intel.MyDeals.Entities;
using NUnit.Framework;

namespace Intel.MyDeals.BusinessLogic.Test
{
    [TestFixture]
    public class JmsTesting
    {
        [OneTimeSetUp]
        public void JmsTestingInit()
        {
            OpUserStack.EmulateUnitTester();
            UnitTestHelpers.SetDbConnection();
        }

        [TestCase]
        public void BasicJmsQueueConnectionTest()
        {
            JmsDataLib jmsConnection = new JmsDataLib();
            jmsConnection.OpenConnectionToJmsQueue();
            string queueMsg = jmsConnection.ReadMessages();
            Assert.IsTrue(queueMsg == "No message in the queue"); // JMS connected and returned a generic message
            jmsConnection.CloseConnectionToJmsQueue();
        }

    }
}
