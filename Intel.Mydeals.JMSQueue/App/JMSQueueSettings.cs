using System;
using System.Collections.Generic;

namespace Intel.MyDeals.JMSQueueApp
{
    // TO DO : Alternative for JMS Queue Settings
    internal class JMSQueueSettings
    {
        private static JMSQueueSettings instance;

        public static JMSQueueSettings Instance
        {
            get
            {
                if (instance == null)
                {
                    throw new Exception("Object not created");
                }
                return instance;
            }
        }

        private JMSQueueSettings(Dictionary<string, string> sourceData)
        {
            ServerUrl = sourceData.ContainsKey("jmsServer") ? sourceData["jmsServer"] : "";
            FileSharePath = sourceData.ContainsKey("jmsFileSharePath") ? sourceData["jmsFileSharePath"] : "";
            JmsUploadDirectory = sourceData.ContainsKey("jmsResponseDir") ? sourceData["jmsResponseDir"] : "";
            QueueName = sourceData.ContainsKey("jmsQueue") ? sourceData["jmsQueue"] : "";
            UserId = sourceData.ContainsKey("jmsUID") ? sourceData["jmsUID"] : "";
        }

        public static void Create(Dictionary<string, string> sourceData)
        {
            instance = new JMSQueueSettings(sourceData);
        }

        public override string ToString()
        {
            return String.Format(@"
JMSQueueSettings:
[ServerUrl] = ""{0}""
[JmsUploadDirectory] = ""{1}""
[FileSharePath] = ""{2}""
[QueueName] = ""{3}""
[UserId] = ""{4}""
",
                ServerUrl,
                JmsUploadDirectory,
                FileSharePath,
                QueueName,
                UserId
                );
        }

        public Exception AssertValid()
        {
            List<string> InvalidProperties = new List<string>();

            if (String.IsNullOrEmpty(ServerUrl)) { InvalidProperties.Add("ServerUrl"); }
            if (String.IsNullOrEmpty(FileSharePath)) { InvalidProperties.Add("FileSharePath"); }
            if (String.IsNullOrEmpty(JmsUploadDirectory)) { InvalidProperties.Add("JmsUploadDirectory"); }
            if (String.IsNullOrEmpty(QueueName)) { InvalidProperties.Add("QueueName"); }
            if (String.IsNullOrEmpty(UserId)) { InvalidProperties.Add("UserId"); }
            if (InvalidProperties.Count > 0)
            {
                return new ArgumentException(String.Format("Invalid Opaque settings for JMS Queue.  Missing settings for: {0}",
                    String.Join(", ", InvalidProperties)
                    ));
            }

            return null;
        }

        public string ServerUrl { set; get; }
        public string UserId { set; get; }
        public string QueueName { set; get; }
        public string FileSharePath { set; get; }
        public string JmsUploadDirectory { set; get; }
    }
}