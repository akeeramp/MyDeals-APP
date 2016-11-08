using Intel.MyDeals.App;
using System.Web.Http;
using Intel.Opaque;
using Intel.MyDeals.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Net.Http;
using Intel.MyDeals.BusinesssLogic;
using Newtonsoft.Json;

namespace Intel.MyDeals.Controllers
{
	public class ToolAPIController : ApiController
	{
		public void logTest(int msgCnt)
		{
			OpLog.ClearStack();
			List<OpMsg> opMsgs = new List<OpMsg>();
			for (var i = 0; i < msgCnt; i++)
			{
				opMsgs.Add(
				new OpMsg
				{
					DebugMessage = "This is a debug message " + i,
					Message = "This is a debug message " + i,
					MsgType = OpMsg.MessageType.Info //isError ? OpMsg.MessageType.Error : isAlert ? OpMsg.MessageType.Warning : OpMsg.MessageType.Info
				}
				);
			}
			OpLog.LogEvent(opMsgs);
		}

		[HttpGet]
		[Route("api/SecurityAttributesAPI/GetSecurityActions")]
		public IEnumerable<SecurityActions> GetSecurityActions()
		{
			// TODO rmeove thislogging test 
			//OpLogUnitTests.AddOpMessages
			logTest(2);
			List<SecurityActions> data = new List<SecurityActions>();

			return new SecurityAttributesLib().GetToolActions();
		}
		
		[HttpPost]
		[Route("api/SecurityAttributesAPI/InsertAction")]
		public SecurityActions InsertAction(SecurityActions action)
		{
			return new SecurityAttributesLib().ManageToolAction(action, CrudModes.Insert);
		}

		[HttpPost]
		[Route("api/SecurityAttributesAPI/UpdateAction")]
		public SecurityActions UpdateAction(SecurityActions action)
		{
			return new SecurityAttributesLib().ManageToolAction(action, CrudModes.Update);
		}
		
		[Route("api/SecurityAttributesAPI/DeleteAction")]
		public bool DeleteAction(int id)
		{
			return new SecurityAttributesLib().DeleteToolAction(id);
		}
	}
}