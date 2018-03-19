using System;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Mail;
using System.Reflection;
using System.Web.Mvc;
using Intel.MyDeals.Entities;

namespace Intel.MyDeals.Controllers
{
    public class EmailController : Controller
    {
        // GET: Email
        public ActionResult Index()
        {
            return View();
        }

        [ValidateInput(false)]
        //string body
        [HttpPost]
        public ActionResult SubmissionNotification(EmailMessage emailMessage)
        {
            string from = string.IsNullOrEmpty(emailMessage.From)
                ? OpUserStack.MyOpUserToken.Usr.Email
                : emailMessage.From;

            emailMessage.Body = emailMessage.Body.Replace("MAILTO_TOKEN", from);

            from = "mydeals.notification@intel.com";


            var message = new MailMessage
            {
                From = new MailAddress(from),
                Subject = emailMessage.Subject,
                Body = emailMessage.Body,
                IsBodyHtml = true
            };

            message.To.Add(OpUserStack.MyOpUserToken.Usr.Email);


            //StringWriter myWriter = new StringWriter();
            //// Decode the encoded string.
            //HttpUtility.HtmlDecode(emailMessage.Body, myWriter);
            //Console.Write("Decoded string of the above encoded string is " +
            //               myWriter.ToString());

            // mark as draft
            message.Headers.Add("X-Unsent", "1");

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

                //HttpResponseMessage result = new HttpResponseMessage(HttpStatusCode.OK);
                //result.Content = new StreamContent(fs);
                //result.Content.Headers.ContentType = new MediaTypeHeaderValue("application/vnd.ms-outlook");
                //result.Content.Headers.Add("Content-Disposition", $"MyDealsSubmissionNotification.eml");
                //return result;
                return File(fs, "application/vnd.ms-outlook", "MyDealsSubmissionNotification.eml");
            }
        }

        [ValidateInput(false)]
        //string body
        [HttpPost]
        public HttpResponseMessage EmailNotification(EmailMessage emailMessage)
        {
            var result = new HttpResponseMessage(HttpStatusCode.OK);
            var message = new MailMessage
            {
                From = new MailAddress("mydeals.notification@intel.com"),
                Subject = emailMessage.Subject,
                Body = emailMessage.Body,
                IsBodyHtml = true,
                Priority = MailPriority.High
            };

            foreach (string email in emailMessage.To)
            {
                message.To.Add(email.Trim());
            }
            message.CC.Add(OpUserStack.MyOpUserToken.Usr.Email);

            using (var client = new SmtpClient())
            {
                client.DeliveryMethod = SmtpDeliveryMethod.Network;
                client.UseDefaultCredentials = true;
                client.Host = "mail.intel.com";
                client.Send(message);

            }

            return result;
        }
    }
}