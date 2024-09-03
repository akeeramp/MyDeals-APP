using Intel.MyDeals.Entities;
using Intel.MyDeals.Helpers;
using Intel.MyDeals.IBusinessLogic;
using Newtonsoft.Json.Linq;
using Newtonsoft.Json;
using System.Collections.Generic;
using System;
using System.Linq;
using System.Net.Http;
using System.Net;
using System.Web.Http;
using WebApi.OutputCache.V2;

namespace Intel.MyDeals.Controllers.API
{
    public class AdminConstantsController : BaseApiController
    {
        private readonly IConstantsLookupsLib _constantsLookupsLib;

        public AdminConstantsController(IConstantsLookupsLib constantsLookupsLib)
        {
            _constantsLookupsLib = constantsLookupsLib;
        }

        [Authorize]
        [HttpGet]
        [Route("api/AdminConstants/v1/GetConstants/{getCachedResult:bool?}")]
        public IQueryable<AdminConstant> GetConstants(bool getCachedResult = true)
        {
            return _constantsLookupsLib.GetAdminConstants(getCachedResult).AsQueryable();
        }

        [Route("api/AdminConstants/v1/GetConstantsByName/{name}")]
        public AdminConstant GetConstantsByName(string name)
        {
            return SafeExecutor(() => _constantsLookupsLib.GetConstantsByName(name)
                , $"Unable to find constant with name {name}"
            );
        }

        [Route("api/AdminConstants/v1/GetConstantsByNameNonCached/{name}")]
        public AdminConstant GetConstantsByNameNonCached(string name)
        {
            return SafeExecutor(() => _constantsLookupsLib.GetConstantsByName(name, true)
                , $"Unable to find constant with name {name}"
            );
        }

        [Authorize]
        [HttpPost]
        [AntiForgeryValidate]
        [Route("api/AdminConstants/v1/CreateConstant")]
        public AdminConstant CreateConstant(AdminConstant adminConstant)
        {
            return _constantsLookupsLib.CreateAdminConstant(adminConstant);
        }

        [Authorize]
        [HttpPost]
        [AntiForgeryValidate]
        [Route("api/AdminConstants/v1/UpdateConstant")]
        public AdminConstant UpdateConstant(AdminConstant adminConstant)
        {
            return _constantsLookupsLib.UpdateAdminConstant(adminConstant);
        }

        [Authorize]
        [HttpGet]
        [InvalidateCacheOutput("api/AdminConstants/v1/GetConstants")]
        [Route("api/AdminConstants/v1/UpdateRecycleCacheConstants/{CNST_NM}/{CNST_VAL}")]
        public void UpdateRecycleCacheConstants(string CNST_NM, string CNST_VAL)
        {
           _constantsLookupsLib.UpdateRecycleCacheConstants(CNST_NM, CNST_VAL);
        }

        [Authorize]
        [HttpPost]
        [AntiForgeryValidate]
        [Route("api/AdminConstants/v1/DeleteConstant")]
        public void DeleteConstant(AdminConstant adminConstant)
        {
            _constantsLookupsLib.DeleteAdminConstant(adminConstant);
        }

        [Authorize]
        [HttpPost]
        [Route("api/AdminConstants/v1/UpdateBatchJobConstants")]
        public List<BatchJobConstants> UpdateBatchJobConstants(string mode, JObject jsonDataObj)
        {
            BatchJobConstants jsonData = new BatchJobConstants();
            if (jsonDataObj != null)
                jsonData = JsonConvert.DeserializeObject<BatchJobConstants>(jsonDataObj.ToString());

            if (String.IsNullOrEmpty(mode) || mode == "" || (jsonDataObj == null && mode.ToUpper() == "UPDATE"))
                throw new HttpResponseException(new HttpResponseMessage(HttpStatusCode.InternalServerError)
                {
                    Content = new StringContent("Unable to process")
                });

            return SafeExecutor(() => _constantsLookupsLib.UpdateBatchJobConstants(mode, jsonData)
                , "Unable to process"
            );
        }

        [Authorize]
        [HttpPost]
        [Route("api/AdminConstants/v1/UpdateBatchJobStepConstants")]
        public List<BatchJobStepConstants> UpdateBatchJobStepConstants(string mode, int batchSid, JArray jsonDataObj)
        {
            try
            {
                if (String.IsNullOrEmpty(mode) || mode == "" || (jsonDataObj == null && mode.ToUpper() == "UPDATE"))
                {
                    throw new HttpResponseException(Request.CreateResponse(HttpStatusCode.BadRequest, new { Message = "Invalid input parameters." }));
                }

                var result = _constantsLookupsLib.UpdateBatchJobStepConstants(mode, batchSid, jsonDataObj == null ? "" : jsonDataObj.ToString());
                return result;
            }
            catch (Exception ex)
            {
                string message = string.IsNullOrEmpty(ex.Message) ? "Unable to process" : ex.Message;
                throw new HttpResponseException(new HttpResponseMessage(HttpStatusCode.InternalServerError)
                {
                    Content = new StringContent(message)
                });
            }
        }
    }
}