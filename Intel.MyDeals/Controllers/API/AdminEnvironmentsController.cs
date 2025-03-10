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
using Intel.MyDeals.BusinessLogic;


namespace Intel.MyDeals.Controllers.API
{
    [Authorize]
    [RoutePrefix("api/AdminEnvironments")]
    public class AdminEnvironmentsController : BaseApiController
    {
        // GET: AdminEnvironments
        private readonly IEnvironmentsLib _environmentsLib;


        public AdminEnvironmentsController(IEnvironmentsLib environmentsLib)
        {
            _environmentsLib = environmentsLib;
        }

        
        [HttpGet]
        [Route("GetEnvDetails")]
        public IQueryable<AdminEnvironments> GetEnvDetails()
        {  
            return SafeExecutor(() => _environmentsLib.GetEnvDetails().AsQueryable()
               , "Unable to get environment details"
           );
        }

        
        [HttpPost]
        [Route("CreateEnvDetails")]
        public AdminEnvironments CreateEnvDetails(AdminEnvironments adminEnvironments)
        {
            return SafeExecutor(() =>  _environmentsLib.CreateEnvDetails(adminEnvironments)
               , "Unable to get environment details"
           );    
        }

       
        [HttpPost]
        [Route("UpdateEnvDetails")]
        public AdminEnvironments UpdateEnvDetails(AdminEnvironments adminEnvironments)
        {
            return SafeExecutor(() => _environmentsLib.UpdateEnvDetails(adminEnvironments)
               , "Unable to get environment details"
           );
        }

       
        [HttpPost]
        [Route("DeleteEnvDetails")]
        public AdminEnvironments DeleteEnvDetails(AdminEnvironments adminEnvironments)
        {
            return SafeExecutor(() =>  _environmentsLib.DeleteEnvDetails(adminEnvironments)
               , "Unable to get environment details"
           );          
        }

        // Start Server 

       
        [HttpGet]
        [Route("GetServerDetails")]
        public IQueryable<AdminServerDetails> GetServerDetails()
        {
            return SafeExecutor(() =>  _environmentsLib.GetServerDetails().AsQueryable()
              , "Unable to get environment details"
          );
            
        }


        
        [HttpPost]
        [Route("CreateServerDetails")]
        public AdminServerDetails CreateServerDetails(AdminServerDetails adminServerDetails)
        {
            return SafeExecutor(() => _environmentsLib.CreateServerDetails(adminServerDetails)
             , "Unable to get environment details"
         );   
        }

       
        [HttpPost]
        [Route("UpdateServerDetails")]
        public AdminServerDetails UpdateServerDetails(AdminServerDetails adminServerDetails)
        {
            return SafeExecutor(() => _environmentsLib.UpdateServerDetails(adminServerDetails)
             , "Unable to get environment details"
         );  
        }

       
        [HttpPost]
        [Route("DeleteServerDetails")]
        public AdminServerDetails DeleteServerDetails(AdminServerDetails adminServerDetails)
        {
            return SafeExecutor(() => _environmentsLib.DeleteServerDetails(adminServerDetails)
            , "Unable to get environment details"
        ); 
        }

        // End Server 
    }
}