using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Net.Mail;
using System.Reflection;
using System.Web.Http;
using Intel.MyDeals.Entities;

namespace Intel.MyDeals.Controllers.API
{
    public class EmailController : BaseApiController
    {
        [Authorize]
        [Route("EmailPsChanges")]
        public HttpResponseMessage EmailPsChanges()
        {
            var message = new MailMessage
            {
                From = new MailAddress("from@example.com")
            };

            message.To.Add("someone@example.com");
            message.Subject = "This is the subject";
            message.Body = "This is the body";


            using (var client = new SmtpClient())
            {
                var id = Guid.NewGuid();

                var tempFolder = Path.Combine(Path.GetTempPath(), Assembly.GetExecutingAssembly().GetName().Name);

                tempFolder = Path.Combine(tempFolder, "MailMessageToEMLTemp");

                // create a temp folder to hold just this .eml file so that we can find it easily.
                tempFolder = Path.Combine(tempFolder, id.ToString());

                if (!Directory.Exists(tempFolder))
                {
                    Directory.CreateDirectory(tempFolder);
                }

                client.UseDefaultCredentials = true;
                client.DeliveryMethod = SmtpDeliveryMethod.SpecifiedPickupDirectory;
                client.PickupDirectoryLocation = tempFolder;
                client.Send(message);

                // tempFolder should contain 1 eml file

                var filePath = Directory.GetFiles(tempFolder).Single();

                // stream out the contents - don't need to dispose because File() does it for you
                var fs = new FileStream(filePath, FileMode.Open);

                HttpResponseMessage result = new HttpResponseMessage(HttpStatusCode.OK);
//                return File(fs, "application/vnd.ms-outlook", "email.eml");
                return result;
            }
        }
    }
}
