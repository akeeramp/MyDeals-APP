using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Mail;
using Intel.MyDeals.DataLibrary;
using Intel.MyDeals.Entities;
using Intel.MyDeals.IBusinessLogic;
using Intel.Opaque.Utilities.Server;

namespace Intel.MyDeals.BusinessLogic.Employees
{
    public static class EmployeeHelpers
    {
        private static readonly IConstantsLookupsLib _constantsLookupsLib;

        public static void SendEmailMessageOfNewCustomers(EmployeeEmailCustomers data)
        {
            string disclaimer = string.Empty;
            Dictionary<string, List<string>> geoCusts = new Dictionary<string, List<string>>();

            // Need to lookup the customers and see the host geos to determine who to send an email
            IEnumerable<CustomerDivision> custs = new CustomerLib().GetCustomerDivisionsActive().Where(c => data.CustIds.Contains(c.CUST_NM_SID));

            foreach (CustomerDivision cust in custs)
            {
                if (!geoCusts.ContainsKey(cust.HOSTED_GEO)) geoCusts[cust.HOSTED_GEO] = new List<string>();
                geoCusts[cust.HOSTED_GEO].Add(cust.CUST_NM);
            }

            //var t = _constantsLookupsLib.GetConstantsByName("NEW_ACCOUNT_REVIEWER_APAC");
            var toList = new List<string>();
            var toDistinctList = new List<string>();
            foreach (KeyValuePair<string, List<string>> kvp in geoCusts)
            {
                string emails = DataCollections.GetToolConstants().Where(c => c.CNST_NM == "NEW_ACCOUNT_REVIEWER_" + kvp.Key).Select(c => c.CNST_VAL_TXT).FirstOrDefault();
                if (emails != null)
                    toList.AddRange(emails.Split(','));
            }
            toDistinctList.AddRange(toList.Select(s => s.Trim()).Distinct());


            string env = OpLog.GetEnv();

            if (env != "PROD")
            {
                disclaimer = "If this was in Production, the email would have gone to: " + string.Join(", ", toDistinctList) + "<br/><br/>";
                toDistinctList = new List<string> { OpUserStack.MyOpUserToken.Usr.Email != null? OpUserStack.MyOpUserToken.Usr.Email: "michael.h.tipping@intel.com" }; // Testing incomplete token safety net
            }
            var message = new MailMessage
            {
                From = new MailAddress("mydeals.notification@intel.com"),
                Subject = "My Deals customer account access granted - Review Required",
                Body = disclaimer + data.EmailBody,
                IsBodyHtml = true,
                Priority = MailPriority.High
            };

            foreach (string email in toDistinctList)
            {
                message.To.Add(email.Trim());
            }

            if (env != "PROD")
            {
                message.CC.Add(OpUserStack.MyOpUserToken.Usr.Email != null ? OpUserStack.MyOpUserToken.Usr.Email : "michael.h.tipping@intel.com"); // Testing incomplete token safety net
        }

            using (var client = new SmtpClient())
            {
                client.UseDefaultCredentials = false;
                client.Credentials = new NetworkCredential("SYS_SYSSYSBOSEMAILS", StringEncrypter.StringDecrypt("04601922222300Qa16209320615603P1506sQ2P9321303605Z151C00324514325202h913400z212924320G530930U02521307e20c24025eF21l20uZ1FO1O13620402315204H3917g21242130F091f", "Smtp_Password"));
                client.DeliveryMethod = SmtpDeliveryMethod.Network;
                client.EnableSsl = true;
                //SMTP Change for Port Number and Host Name
                client.Host = "smtpauth.intel.com";
                client.Port = 587;
                client.Send(message);

            }

            new CacheLib().ClearCache("_getMyCustomers");

        }
    }
}
