import { Component, OnInit } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import { logger } from '../../shared/logger/logger';
import { ProjectFlowService } from './projectFlow.service';

@Component({
    selector: 'app-project-flow',
    templateUrl: 'Client/src/app/codingPractices/projectFlow/projectFlow.component.html',
    styleUrls: ['Client/src/app/codingPractices/projectFlow/projectFlow.component.css'],
})
export class ProjectFlowComponent implements OnInit {

    public list_breadcrumbs : any;
    public proLnav: any[];
    public isErrorVisible: boolean = false;
    public left_nav : any;
    public selectedItem: any = 'introduction';
    public keySelected: any = '0';
    public isVisible: boolean = true;
    loggerService: any;
    public dataHealthApi: any = [];
    public reasonData: string = "";

    
    constructor(private router: Router, private testingAPISvc: ProjectFlowService, private loggerSvc: logger) { }

    baseText = `{BASE}`;

    baseTestDataLib = `{BASE_DATA_LIB}`;

    baseCode = `public static List<{BASE}> GetToolConstants()
        {
            lock (LOCK_OBJECT ?? new object())
            {
                return _get{BASE} ?? (_get{BASE} = new {BASE_DATA_LIB});
            }
        }
        private static List<{BASE}> _get{BASE};`; 

    staticList = `public static List<ToolConstants> GetToolConstants()
        {
            lock (LOCK_OBJECT ?? new object())
            {
                return _getToolConstants ?? (_getToolConstants = new ConstantLookupDataLib().GetToolConstants());
            }
        }
        private static List<ToolConstants> _getToolConstants;`;

    public controllerForOthers = ` 
 public class OthersController : Controller
    {
        OpCore op = OpAppConfig.Init();  // Initialize MyDeal's Opaque

        // GET: Others
        public ActionResult Index()
        {
            OpUserToken user = AppLib.InitAVM(op);    // Get user details from authentication
            ViewBag.UserToken = user;                 // Apply User Token to viewbag for client use
            ViewBag.AppToken = op.AppToken;           // Apply Application Token to viewbag for client use

            return View();
        }
    }`

    public generateSC = `
        ///<summary>
        /// Class created via template - Do Not Modify!
        /// To modify this code, re-execute the template, or extend as partial.
        /// on PWECKENR-MOBL5
        /// by pweckenr
        /// at 10/14/2016 11:24:27 AM
        ///</summary>

        [DataContract]
        public partial class ToolConstants {
    
        [DataMember]
        public System.String CNST_DESC {set;get;}
    
    
        [DataMember]
        public System.String CNST_NM {set;get;}
    
    
        [DataMember]
        public System.String CNST_VAL_TXT {set;get;}
    
    
        /*
        private static List<ToolConstants> ToolConstantsFromReader(SqlDataReader rdr){
            // This helper method is template generated.
            // Refer to that template for details to modify this code.
    
            var ret = new List<ToolConstants>();
            int IDX_CNST_DESC = DB.GetReaderOrdinal(rdr, "CNST_DESC");
            int IDX_CNST_NM = DB.GetReaderOrdinal(rdr, "CNST_NM");
            int IDX_CNST_VAL_TXT = DB.GetReaderOrdinal(rdr, "CNST_VAL_TXT");
    
            while (rdr.Read()){
                ret.Add(new ToolConstants {
                    CNST_DESC = (IDX_CNST_DESC < 0 || rdr.IsDBNull(IDX_CNST_DESC)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_CNST_DESC),
                    CNST_NM = (IDX_CNST_NM < 0 || rdr.IsDBNull(IDX_CNST_NM)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_CNST_NM),
                    CNST_VAL_TXT = (IDX_CNST_VAL_TXT < 0 || rdr.IsDBNull(IDX_CNST_VAL_TXT)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_CNST_VAL_TXT)
                });
            } // while
            return ret;
        }
        */
    
    } // End of class ToolConstants`

    public getConstantsSP = `
    public List<ToolConstants> GetToolConstants()
    {
        var cmd = new Procs.dbo.PR_GET_CONSTANTS
        {
            cnst_nm = null
        };
        List<ToolConstants> returnConstandsList = new List<ToolConstants>();
        using (var rdr = DataAccess.ExecuteReader(cmd))
        {
            int ConstantNameIdx = DB.GetReaderOrdinal(rdr, "CNST_NM");
            int ConstantDescIdx = DB.GetReaderOrdinal(rdr, "CNST_DESC");
            int ConstantValueIdx = DB.GetReaderOrdinal(rdr, "CNST_VAL_TXT");
            while (rdr.Read())
            {
                returnConstandsList.Add(new ToolConstants
                {
                    CNST_NM = rdr.IsDBNull(ConstantNameIdx) ? default(String) : rdr.GetFieldValue<String>(ConstantNameIdx),
                    CNST_DESC = rdr.IsDBNull(ConstantDescIdx) ? default(String) : rdr.GetFieldValue<String>(ConstantDescIdx),
                    CNST_VAL_TXT = rdr.IsDBNull(ConstantValueIdx) ? default(String) : rdr.GetFieldValue<String>(ConstantValueIdx),
                });
            }
        }
        return returnConstandsList;
    }`

    public cacheFunctionCall =`
    public List<ToolConstants> GetToolConstants()
    {
        //
        // can put business logic here
        //
        return DataCollections.GetToolConstants();
    }`

    public populateCache = 
    `
    public static List<ToolConstants> GetToolConstants()
    {
        lock (LOCK_OBJECT ?? new object())
        {
            return _getToolConstants ?? (_getToolConstants = new ConstantLookupDataLib().GetToolConstants());
        }
    }
    private static List<ToolConstants> _getToolConstants;`

    public cacheOutput = `
        //Cache for 1000 seconds on the server, inform the client that response is valid for 1000 seconds
        [HttpGet]
        [Route("api/AdminConstants/v1/GetConstants")]
        [CacheOutput(ClientTimeSpan = 1000, ServerTimeSpan = 1000)]
        public IQueryable<AdminConstant> GetConstants()
        {
            return new ConstantsLookupsLib().GetAdminConstants().AsQueryable();
        }`

    public AutoInvalidateCacheOutput= ` 
    [AutoInvalidateCacheOutput]
    public class AdminConstantsController : ApiController
    {
        [Authorize]
        [HttpGet]
        [Route("api/AdminConstants/v1/GetConstants")]
        [CacheOutput(ClientTimeSpan = 50000, ServerTimeSpan = 50000)]
        public IQueryable<AdminConstant> GetConstants()
        {
            return new ConstantsLookupsLib().GetAdminConstants().AsQueryable();
        }
    }`

    public throughAttributes = `
        [HttpGet]
        [Route("api/AdminConstants/v1/GetConstants")]
        [CacheOutput(ClientTimeSpan = 50000, ServerTimeSpan = 50000)]
        public IQueryable<AdminConstant> GetConstants()
        {
            return new ConstantsLookupsLib().GetAdminConstants().AsQueryable();
        }
        [HttpPost]
        [InvalidateCacheOutput("api/AdminConstants/v1/GetConstants")]
        [Route("api/AdminConstants/v1/CreateConstant")]
        public AdminConstant CreateConstant(AdminConstant adminConstant)
        {
            return new ConstantsLookupsLib().CreateAdminConstant(adminConstant);
        }`

    public sampleCodeForCreateWebAPI = `  
    namespace Intel.MyDeals.Controllers.API
    {
        public class ConstantsController : ApiController
        {
            OpCore op = OpAppConfig.Init();

            [Route("api/AdminConstants/v1/GetConstants")]
            public IEnumerable<ToolConstants> Get()
            {
                return new ConstantsLookupsLib().GetToolConstants();
            }
        }
    }` 
    
    public generatedCodeForStoredProcedure = ` 
    ///<summary>
    /// Class created via template - Do Not Modify!
    /// To modify this code, re-execute the template, or extend as partial.
    /// on PWECKENR-MOBL5
    /// by pweckenr
    /// at 10/7/2016 2:18:35 PM
    ///</summary>

    [DataContract]
    public partial class PingResults {

    [DataMember]
    public System.String DbServer {set;get;}


    [DataMember]
    public System.String Source {set;get;}


    [DataMember]
    public Nullable<System.DateTime> TimeStamp {set;get;}


    /*
        private static List<PingResults> PingResultsFromReader(SqlDataReader rdr){
        // This helper method is template generated.
        // Refer to that template for details to modify this code.

        var ret = new List<PingResults>();
        int IDX_DbServer = DB.GetReaderOrdinal(rdr, "DbServer");
        int IDX_Source = DB.GetReaderOrdinal(rdr, "Source");
        int IDX_TimeStamp = DB.GetReaderOrdinal(rdr, "TimeStamp");

        while (rdr.Read()){
            ret.Add(new PingResults {
                DbServer = (IDX_DbServer < 0 || rdr.IsDBNull(IDX_DbServer)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_DbServer),
                Source = (IDX_Source < 0 || rdr.IsDBNull(IDX_Source)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_Source),
                TimeStamp = (IDX_TimeStamp < 0 || rdr.IsDBNull(IDX_TimeStamp)) ? default(Nullable<System.DateTime>) : rdr.GetFieldValue<Nullable<System.DateTime>>(IDX_TimeStamp)
                });
            } // while
            return ret;
        }
    */
    } // End of class PingResults`

    public returnDataFromSP = `
    /// <summary>
    /// Get POC Emp
    /// </summary>
    /// <returns>collection of employee data</returns>
    public IEnumerable<PocEmp> GetPocEmp()
    {
        var ret = new List<PocEmp>();
        var cmd = new PR_GET_POC_EMP();
        try
        {
            using (var rdr = DataAccess.ExecuteReader(cmd))
            {
                int IDX_emp_sid = DB.GetReaderOrdinal(rdr, "emp_sid");
                int IDX_first_nm = DB.GetReaderOrdinal(rdr, "first_nm");
                int IDX_last_nm = DB.GetReaderOrdinal(rdr, "last_nm");
                while (rdr.Read())
                {
                    ret.Add(new PocEmp
                    {
                        emp_sid = (IDX_emp_sid < 0 || rdr.IsDBNull(IDX_emp_sid)) ? default(Nullable<System.Int32>) : rdr.GetFieldValue<Nullable<System.Int32>>(IDX_emp_sid),
                        first_nm = (IDX_first_nm < 0 || rdr.IsDBNull(IDX_first_nm)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_first_nm),
                        last_nm = (IDX_last_nm < 0 || rdr.IsDBNull(IDX_last_nm)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_last_nm)
                    });
                }
            }
        }
        catch (Exception ex)
        {
            OpLogPerf.Log(ex);
        }
        return ret;
    }`

    public storedProcForAction= `
    /// <summary>
    /// Set POC Emp
    /// </summary>
    /// <returns>INSERT / UPDATE employee data</returns>
    public void SetPocEmp(PocEmp pocEmp)
    {
        OpLogPerf.Log("SetPocEmp");
        DataSet dsCheckConstraintErrors = null;
        try
        {
            DataAccess.ExecuteDataSet(new PR_SET_POC_EMP
            {
                emp_sid = (int) pocEmp.emp_sid,
                first_nm = pocEmp.first_nm,
                last_nm = pocEmp.last_nm
            }, null, out dsCheckConstraintErrors);
        }
        catch (Exception ex)
        {
            if (dsCheckConstraintErrors != null && dsCheckConstraintErrors.Tables.Count > 0)
            {
                // DO SOME ERROR HANDLING
            }
            throw;
        }
    }`

    public iConstlookupData = `
    public class Resolver : IService
    {
        public void SetUp(IRegisterService registerService)
        {
            registerService.RegisterType<IConstantLookupDataLib, ConstantLookupDataLib>();
        }
    }
    `
    public dataLibWrapperClass= `
    public class DataCollectionsDataLib : IDataCollectionsDataLib
    {
      public List<ToolConstants> GetToolConstants()
      {
          return DataCollections.GetToolConstants();
      }
    }`

    public toolConstants= `
    public static List<ToolConstants> GetToolConstants()
    {
        lock (LOCK_OBJECT ?? new object())
        {
            return _getToolConstants ?? (_getToolConstants = new ConstantLookupDataLib().GetToolConstants());s
        }
    }
    private static List<ToolConstants> _getToolConstants;`

    public privateVersionOfpopulateCache = 
    `
        public static List<{BASE}> GetToolConstants()
            {
                lock (LOCK_OBJECT ?? new object())
                {
                    return _get{BASE} ?? (_get{BASE} = new {BASE_DATA_LIB});
                }
            }
            private static List<{BASE}> _get{BASE};`

    public businessLogicFunction = `
        public bool IsWwidInString(OpUserToken opUserToken, string strName)
        {
            string theList = new ConstantsLookupsLib().GetToolConstants()
                .Where(c => c.CNST_NM == strName)
                .Select(c => c.CNST_VAL_TXT)
                .FirstOrDefault();
            if (theList == null) return false;
            foreach (string strWwid in theList.Replace(" ", "").Split(','))
            {
                int wwid;
                if (!int.TryParse(strWwid, out wwid)) continue;
                if (wwid == opUserToken.Usr.WWID) return true;
            }
            return false;
        }`

    public businessFunction = `
    public class ConstantsLookupsLib : IConstantsLookupsLib
        {
            /// <summary>
            /// Constants lookup data library
            /// </summary>
            private readonly IConstantLookupDataLib _constantLookupDataLib;
            /// <summary>
            /// DataCollection Data Library, wrapper methods to access static cache
            /// </summary>
            private readonly IDataCollectionsDataLib _dataCollectionsDataLib;
            public ConstantsLookupsLib(IConstantLookupDataLib _constantLookupDataLib,
                IDataCollectionsDataLib _dataCollectionsDataLib)
            {
                this._constantLookupDataLib = _constantLookupDataLib;
                this._dataCollectionsDataLib = _dataCollectionsDataLib;
            }
            public List<ToolConstants> GetToolConstants()
            {
                return _dataCollectionsDataLib.GetToolConstants();
            }
    }`

    public cnstLookupLib = `
    public class Resolver : IService
    {
        public void SetUp(IRegisterService registerService)
        {
            registerService.RegisterType<IConstantLookupLib, ConstantLookupLib>();
        }
    }`

    public businessLgcFndataColDataLib = `
    public class ConstantsLookupsLib : IConstantsLookupsLib
        {
            /// <summary>
            /// Constants lookup data library
            /// </summary>
            private readonly IConstantLookupDataLib _constantLookupDataLib;

            /// <summary>
            /// DataCollection Data Library, wrapper methods to access static cache
            /// </summary>
            private readonly IDataCollectionsDataLib _dataCollectionsDataLib;

            public ConstantsLookupsLib(IConstantLookupDataLib _constantLookupDataLib,
                IDataCollectionsDataLib _dataCollectionsDataLib)
            {
                this._constantLookupDataLib = _constantLookupDataLib;
                this._dataCollectionsDataLib = _dataCollectionsDataLib;
            }

            public List<ToolConstants> GetToolConstants()
            {
                return _dataCollectionsDataLib.GetToolConstants();
            }
    }`
    
    public calledConstants = `
    public class ConstantsController : BaseApiController
        {
            private readonly IConstantsLookupsLib _constantsLookupsLib;

            public ConstantsController(IConstantsLookupsLib _constantsLookupsLib)
            {
                this._constantsLookupsLib = _constantsLookupsLib;
            }

            [Authorize]
            [Route("api/AdminConstants/v1/GetConstants")]
            public IEnumerable<ToolConstants> Get()
            {
                return _constantsLookupsLib.GetToolConstants();
            }
        }`

    public codeForControllerCreation = `
    namespace Intel.MyDeals.Controllers
    {
        public class ConstantsController : Controller
        {
            OpCore op = OpAppConfig.Init();  // Initialize MyDeal's Opaque

            public ActionResult Constants()
            {
                OpUserToken user = AppLib.InitAVM(op);    // Get user details from authentication
                ViewBag.UserToken = user;                 // Apply User Token to viewbag for client use
                ViewBag.AppToken = op.AppToken;           // Apply Application Token to viewbag for client use
                return View();
            }
        }
    }`

    public generatedConstants = `
    import { logger } from "../../shared/logger/logger";
    import { constantsService } from "./admin.constants.service";
    import { Component } from "@angular/core";
    import { Observable } from "rxjs";
    @Component({
    selector: 'constants',
    templateUrl: 'Client/src/app/admin/constants/admin.constants.component.html',
    styleUrls: ['Client/src/app/admin/constants/admin.constants.component.css']
    })
     export class ConstantsComponent {
     constructor(private constantsSvc: constantsService, private loggerSvc: logger) { }

     public gridResult: Array<any>;

     loadConstants() {
        if (!(<any>window).isDeveloper) {
            document.location.href = "/Dashboard#/portal";
        }
        else {
            this.constantsSvc.getConstants().subscribe(
                    (result: Array<any>) => {
                        this.gridResult = result;
                    },
                    function (response) {
                        this.loggerSvc.error(
                            "Unable to get Constants Data.",
                            response,
                            response.statusText
                        );
                    }
                )
        }
    }
}
`

public showConstants = ` 
@{
    ViewBag.Title = "Constants";
}
<h2>Constants</h2>
`

    public baseAppModuleCode = `
import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent }  from './app.component';
import { codingPracticesComponents } from '../../app/modules/codingPractices.module';  // respective admin component import path added
import { AdminComponents } from '../../app/modules/admin.module';

@NgModule({
  imports:      [ BrowserModule ],
  declarations: [
  AppComponent,                        //angular default component
  AdminComponents                      //newly created component
  codingPracticesComponents            //newly created component
],
  bootstrap:    [ AppComponent ]
})
export class AppModule { }`

public blockModule = `
(function() {
    'use strict';
    angular.module('app.core', [
    /*
    * Angular modules
    */
    'ngAnimate', 'ngSanitize', 'ui.router',
    /*
    * Our reusable cross app code modules
    */
    'blocks.exception', 'blocks.logger', 'blocks.router'
    ]);
})();`

public registerModule = `
(function () {
    'use strict';
    angular.module('app.admin', []);
})();`

public routerRegister = `
(function () {
    angular
        .module('app.admin')
        .run(appRun);
    function appRun(routerHelper) {
        routerHelper.configureStates(getStates());
    }
    function getStates() {
        return [
            {
                state: 'admin',
                config: {
                    abstract: false,
                    template: '&ltdiv ui-view&gt&lt/div&gt',
                    url: '/'
                }
            },
            {
                state: 'admin.cache',
                abstract: false,
                config: {
                    templateUrl: 'app/admin/cache/cache.html',
                    url: 'cache',                    
                    controller: 'CacheController as vm',                    
                }
            },
            {
                state: 'admin.constants',
                abstract: false,
                config: {
                    templateUrl: 'app/admin/constants/constants.html',
                    url: 'constants',
                    controller: 'ConstantsController as vm',
                }
            },
        ];
    }
})();
`

public errorHandling = `
    angular
    .module('app.admin')
    .controller('ConstantsController', ConstantsController);
    
    ConstantsController.$inject = ['$scope', 'dataService', 'constantsService', 'logger', '$uibModal'];
    function ConstantsController($scope, dataService, constantsService, logger, $uibModal) {
        //Add logic here
        function loadCache() {
            cacheService.getStaticCacheStatus().then(
                function (data) {
                    vm.cacheData = data;
                }, function (data) {
                    logger.error("Error in getting cache status.")
                });
        }
    }`

public serviceCalls = `
angular
.module('app.admin')
.factory('constantsService', constantsService);
// Minification safe dependency injection

constantsService.$inject = ['$http', 'dataService', 'logger', '$q'];

function constantsService($http, dataService, logger, $q) {
    var apiBaseUrl = "api/AdminConstants/v1/";
    var service = {
        getConstants: getConstants
    }
    return service;
    function getConstants() {
        var deferred = $q.defer();
        $http.get(apiBaseUrl + 'GetConstants').then(
             function success(response) {
                 deferred.resolve(response.data);
             },
             function error(response) {
                 deferred.reject(response);
             }
        );
        return deferred.promise;
    }
}`

public generatedStoredProcedure = `
///<summary>
        /// Class created via template - Do Not Modify!
        /// To modify this code, re-execute the template, or extend as partial.
        /// on PWECKENR-MOBL5
        /// by pweckenr
        /// at 10/7/2016 2:18:35 PM
        ///</summary>
        
        [DataContract]
        public partial class PingResults {
        
        [DataMember]
        public System.String DbServer {set;get;}
        
        
        [DataMember]
        public System.String Source {set;get;}
        
        
        [DataMember]
        public Nullable<System.DateTime> TimeStamp {set;get;}
        
        
        /*
            private static List<PingResults> PingResultsFromReader(SqlDataReader rdr){
            // This helper method is template generated.
            // Refer to that template for details to modify this code.
        
            var ret = new List<PingResults>();
            int IDX_DbServer = DB.GetReaderOrdinal(rdr, "DbServer");
            int IDX_Source = DB.GetReaderOrdinal(rdr, "Source");
            int IDX_TimeStamp = DB.GetReaderOrdinal(rdr, "TimeStamp");
        
            while (rdr.Read()){
                ret.Add(new PingResults {
                    DbServer = (IDX_DbServer < 0 || rdr.IsDBNull(IDX_DbServer)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_DbServer),
                    Source = (IDX_Source < 0 || rdr.IsDBNull(IDX_Source)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_Source),
                    TimeStamp = (IDX_TimeStamp < 0 || rdr.IsDBNull(IDX_TimeStamp)) ? default(Nullable<System.DateTime>) : rdr.GetFieldValue<Nullable<System.DateTime>>(IDX_TimeStamp)
                    });
                } // while
                return ret;
            }
        */
        } // End of class PingResults`



   public appModuleEg = `

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  imports: [
    BrowserModule,
    // import HttpClientModule after BrowserModule.
    HttpClientModule,
  ],
  declarations: [
    AppComponent,
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule {}
`;
    public serviceodeEx = `

import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})

export class funFactService {
    public apiBaseUrl = "api/Funfact/";

    constructor(private httpClient: HttpClient) {
    }

    public getFunFactItems(): Observable<any> {
        const apiUrl: string = this.apiBaseUrl + 'GetFunfactItems';
        return this.httpClient.get(apiUrl);
    }

    public updateFunFact(data: any): Observable<any> {
        const apiUrl: string = this.apiBaseUrl + 'UpdateFunfact';
        return this.httpClient.post(apiUrl, data);
    }

}
`;
    public subscribeCodeEx = `

import { Component} from "@angular/core";
import { funFactService } from "./admin.funFact.service";
import { Observable } from "rxjs";

@Component({
    selector: 'admin-fun-fact',
    templateUrl: 'Client/src/app/admin/funFact/admin.funFact.component.html',
    styleUrls: ['Client/src/app/admin/funFact/admin.funFact.component.css']
})
export class adminFunFactComponent implements PendingChangesGuard, OnDestroy {
    constructor(private funFactSvc: funFactService, private loggerSvc: logger) { }

 private gridResult: Array<any>;

//method to load the funfacts which is subscribing the service getFunFactsItems() 
 loadFunFacts() {
        else {
            this.funFactSvc.getFunFactItems().subscribe((result: Array<any>) => {
                this.gridResult = result;
            }, (error) => {
                    this.loggerSvc.error('Unable to get Fun Fact.', error);
            });
        }
    }
`;
   


    constantsData = [
        { name: "DB_LOGGING", description: "Logging", value: '<log MsgSrc="DB"> <DaysToDeleteOldData>0</DaysToDeleteOldData> <DaysScheduleToRun>1</DaysScheduleToRun> <LastRunDate>2016-11-03</LastRunDate> <IsActive>1</IsActive> </log> <log MsgSrc = "UI_LOG"> <DaysToDeleteOldData>0</DaysToDeleteOldData> <DaysScheduleToRun>1</DaysScheduleToRun> <LastRunDate>2016-11-03</LastRunDate> <IsActive>1</IsActive> </log>' },
        { name: "BATCH_LOG", description: "META-DATA FOR BATCH CLEAN-UP OF BATCH LOGGING TABLE", value: '<log NUM_DAYS_TO_DELETE="1" NUM_DAYS_TO_RUN="1" LST_RUN_DT="2016-11-09"/>'},
        { name: "iCOST_PRODUCTS", description: "Will get icost data for the mentioned productVerticals in CNST_VAL_TXT.", value: "3, 4, 5, 7502, 7503, 7507, 7, 8,7516,7517,7518" },
        { name: "ICOST_HIST_LOG_DAYS", description: "Days to keep ICOST import history logging details.", value: "455" },
        { name: "ICOST_ERROR_LOG_DAYS", description: "Days to keep ICOST error logging details.", value: "180" },
        { name: "ICOST_ERROR_CONTACTS_MYDL", description: "Contacts to send emails to for iCost errors (Separator is ;)", value: "icost.dba@intel.com;michael.h.tipping@intel.com;rohit.tandon@intel.com;Mitusha.Rani@intel.com;melissa.chyo@intel.com;harpreet1.kaur@intel.com" },
        { name: "CUTOFF_DATE", description: "CUTOFF_DATE", value: "2018-07-12" },
        { name: "MISC_MM_LIST", description: "List of misc mtrl_id to bring in during product refresh batch", value: "IGNORMM" },
        { name: "SSPEC_PRD_TYPES", description: "SSPEC_PRD_TYPES", value: "CPU,CS" },
        { name: "EIA_DIV_NM", description: "EIA Division Name", value: "EdgeP&LDiv" },
        { name: "COST_TEST_TYPES", description: "This is will list the Cost test types and Order of execution", value: "L1:1~L2:2~Exempt:3" },
        { name: "LOCKED_OUT_ROLES", description: "Roles locked out, like during a release.", value: "" },
        { name: "CSL_WWID_EXCEPTIONS", description: "WWID that can never be locked out", value: "10505693,10548414,10602441,10634789,10529497,10651232" },
        { name: "PRODUCT_SELECTION_LEVEL", description: "This Constant will hold the possible product selection levels", value: "Processor_Nbr:7006~Level4:7007~MM:7008" },
        { name: "CHNL_CUST_FLTR", description: "To filter only the direct customers	", value: "Direct" },
        { name: "LAST_BTCH_RUN", description: "To save the last batch run datetime", value: "Nov 28 2023 12:58AM" },
        { name: "CAP_MSP_CUTOFF_DAYS_BTCH", description: "CAP/MSP Refresh Cutoff days for DM Batch", value: "7" },
        { name: "PCT_LGL_EXCPT_ROLES", description: "WWID that can access CostTest Legal Exception Admin Screen", value: "11583238,11579289" },
        { name: "TRKR_GEN_CUTOFF", description: "Cutover date for new tracker generation logic", value: "7/13/2018" },
        { name: "EXPIRE_CUTOFF_DAYS", description: "Number of Days after deal end date to expire the deal", value: "1" }
    ];

    loadSelected(dataItem){
        this.selectedItem = dataItem.bool;
        this.navigateToSelectedLink(dataItem)
        
    }


    changeBreadCrumb(dataItem,sKey?){
        
        // Project Setup Introduction
        if (dataItem.bool == 'introduction') {
           this.list_breadcrumbs = [{ text: "Coding practices", url: "Home", bool: 'home'},
           { text: "Project setup and logic flow", url: "#Introduction" , bool: 'introduction' },
           { text: "Introduction", url: "javascript:void(0)" , bool: 'introduction' }]
           this.keySelected = '0';
        }

        // DataAccess Introduction
        if (dataItem.bool == 'dataAccess') {
            this.list_breadcrumbs = [{ text: "Coding practices", url: "Home", bool: 'home'},
           { text: "Project setup and logic flow", url: "#Introduction" , bool: 'introduction' },
                { text: "Intel.MyDeals.DataAccess", url: "#dataAccess" , bool: 'dataAccess'  },
                { text: "Introduction", url: "javascript:void(0)" , bool: 'dataAccess' }
        ]
        this.keySelected = '1_0';
        }

        // Data Access Stored Procedure
        
        if (dataItem.bool == 'consumeSP') {
            this.list_breadcrumbs = [{ text: "Coding practices", url: "Home", bool: 'home'},
           { text: "Project setup and logic flow", url: "#Introduction" , bool: 'introduction' },
                { text: "Intel.MyDeals.DataAccess", url: "#dataAccess" , bool: 'dataAccess'  },
                { text: "Consume a stored procedure", url: "javascript:void(0)" , bool: 'consumeSP' }
        ]
        this.keySelected = sKey;
        }

        if (dataItem.bool == 'dataLibrary') {
            this.list_breadcrumbs = [{ text: "Coding practices", url: "Home", bool: 'home'},
            { text: "Project setup and logic flow", url: "#Introduction" , bool: 'introduction' },
                { text: "Intel.MyDeals.DataLibrary", url: "#dataLibrary" , bool: 'dataLibrary'  },
                { text: "Introduction", url: "javascript:void(0)" , bool: 'dataLibrary' }
        ]
        this.keySelected = '3_0';
        }

        if (dataItem.bool == 'callingSP' || dataItem.bool == 'createDataCache' || dataItem.bool == 'manageCachedData') {
            this.list_breadcrumbs = [{ text: "Coding practices", url: "Home", bool: 'home'},
           { text: "Project setup and logic flow", url: "#Introduction" , bool: 'introduction' },
                { text: "Intel.MyDeals.DataLibrary", url: "#dataLibrary" , bool: 'dataLibrary'  },
                { text: dataItem.text, url: "javascript:void(0)" , bool: dataItem.bool }
        ]
        this.keySelected = sKey;
        }

        // Entities Introduction
        if (dataItem.bool == 'entities') {
            this.list_breadcrumbs = [{ text: "Coding practices", url: "Home", bool: 'home'},
            { text: "Project setup and logic flow", url: "#Introduction" , bool: 'introduction' },
                { text: "Intel.MyDeals.Entities", url: "#entities" , bool: 'entities'  },
                { text: "Introduction", url: "javascript:void(0)" , bool: 'entities' }
        ]
        this.keySelected = '2_0';
        }

        if (dataItem.bool == 'createSC' || dataItem.bool == 'sharedCSfromProc') {
            this.list_breadcrumbs = [{ text: "Coding practices", url: "Home", bool: 'home'},
           { text: "Project setup and logic flow", url: "#Introduction" , bool: 'introduction' },
                { text: "Intel.MyDeals.Entities", url: "#entities" , bool: 'entities'  },
                { text: dataItem.text, url: "javascript:void(0)" , bool: dataItem.bool }
        ]
        this.keySelected = sKey;
        }

        if (dataItem.bool == 'businessLogic') {
            this.list_breadcrumbs = [{ text: "Coding practices", url: "Home", bool: 'home'},
            { text: "Project setup and logic flow", url: "#Introduction" , bool: 'introduction' },
                { text: "Intel.MyDeals.BusinessLogic", url: "#businessLogic" , bool: 'businessLogic'  },
                { text: "Introduction", url: "javascript:void(0)" , bool: 'businessLogic' }
        ];
        this.keySelected = '4_0';
        }
       
        if (dataItem.bool == 'businessLogicCallProcedure ' || dataItem.bool == 'businessLogicCallCache' || dataItem.bool == 'businessLogicFunction' || dataItem.bool == 'businessLogicScope' || dataItem.bool == 'businessLogicLayout' ) {
            this.list_breadcrumbs = [{ text: "Coding practices", url: "Home", bool: 'home'},
           { text: "Project setup and logic flow", url: "#Introduction" , bool: 'introduction' },
                { text: "Intel.MyDeals.BusinessLogic", url: "#businessLogic" , bool: 'businessLogic'  },
                { text: dataItem.text, url: "javascript:void(0)" , bool: dataItem.bool }
        ]
        this.keySelected = sKey;
        }
       
        if (dataItem.bool == 'businessRules') {
            this.list_breadcrumbs = [{ text: "Coding practices", url: "Home", bool: 'home'},
            { text: "Project setup and logic flow", url: "#Introduction" , bool: 'introduction' },
                { text: "Intel.MyDeals.BusinessRules", url: "#businessRules" , bool: 'businessRules'  },
                { text: "Introduction", url: "javascript:void(0)" , bool: 'businessRules' }
        ]
        this.keySelected = '5_0';
        }
        if (dataItem.bool == 'app') {
            this.list_breadcrumbs = [{ text: "Coding practices", url: "Home", bool: 'home'},
            { text: "Project setup and logic flow", url: "#Introduction" , bool: 'introduction' },
                { text: "Intel.MyDeals.App", url: "#app" , bool: 'app'  },
                { text: "Introduction", url: "javascript:void(0)" , bool: 'app' }
        ]
        this.keySelected = '6_0';
        }

        if (dataItem.bool == 'myDeals') {
            this.list_breadcrumbs = [{ text: "Coding practices", url: "Home", bool: 'home'},
            { text: "Project setup and logic flow", url: "#Introduction" , bool: 'introduction' },
                { text: "Intel.MyDeals", url: "#myDeals" , bool: 'myDeals'  },
                { text: "Introduction", url: "javascript:void(0)" , bool: 'myDeals' }
        ]
        this.keySelected = '7_0';
        }

        if (dataItem.bool == 'presentationAngularViews' || dataItem.bool == 'presentationCallWebApi'|| dataItem.bool == 'presentationWebApi' || dataItem.bool == 'presentationMvcController' ) {
            this.list_breadcrumbs = [{ text: "Coding practices", url: "Home", bool: 'home'},
           { text: "Project setup and logic flow", url: "#Introduction" , bool: 'introduction' },
                { text: "Intel.MyDeals", url: "#myDeals" , bool: 'myDeals'  },
                { text: dataItem.text, url: "javascript:void(0)" , bool: dataItem.bool }
        ]
        this.keySelected = sKey;
        }

        if (dataItem.bool == 'examples') {
            this.list_breadcrumbs = [{ text: "Coding practices", url: "Home", bool: 'home'},
           { text: "Project setup and logic flow", url: "#Introduction" , bool: 'introduction' },
                { text: "Examples", url: "#examples" , bool: 'examples'  },
                { text: 'Introduction', url: "javascript:void(0)" , bool: dataItem.bool }
        ]
        this.keySelected = '8_0';
        }
        if ( dataItem.bool == 'dataFromProcWithCache' || dataItem.bool == 'dataFromApiWithCache') {
            this.list_breadcrumbs = [{ text: "Coding practices", url: "Home", bool: 'home'},
            { text: "Project setup and logic flow", url: "#Introduction" , bool: 'introduction' },
                { text: "Examples", url: "#examples" , bool: 'examples'  },
                { text: dataItem.text, url: "javascript:void(0)" , bool: dataItem.bool }
        ]
        this.keySelected = sKey;
        }

    }

    navigateToSelectedLink(dataItem,sKey?){
        const url = document.querySelector(dataItem.url);
        url.scrollIntoView({ behavior: 'smooth', block: 'start'});
        this.changeBreadCrumb(dataItem,sKey);
    }

        
    ngOnInit(): void {
        this.list_breadcrumbs = [
            { text: "Coding practices", url: "Home", bool: 'home'},
            { text: "Project setup and logic flow", url: "Project" , bool: 'introduction' },
            { text: "Introduction", url: "javascript:void(0)" , bool: 'introduction' }
        ];

        this.left_nav = this.proLnav = [
            { text: "Introduction", url: '#Introduction', bool: 'introduction' },
            { 
                text: "Intel.MyDeals.DataAccess", 
                url: '#dataAccess' , 
                bool: 'dataAccess',
                items: [
                    { text: "Introduction", url: '#dataAccess' , bool: 'dataAccess'},
                    { text: "Consume a stored procedure", url: '#consumeSP' , bool: 'consumeSP'}
                ] 
            },
            { 
                text: "Intel.MyDeals.Entities", 
                url: '#entities' , 
                bool: 'entities' ,
                items: [
                    { text: "Introduction", url: '#entities' , bool: 'entities'},
                    { text: "Creating a shared class", url: '#createSC' , bool: 'createSC'},
                    { text: "Creating a shared class from a procedure", url: '#sharedCSfromProc' , bool: 'sharedCSfromProc'}
                ]
            },
            { 
                text: "Intel.MyDeals.DataLibrary", 
                url: '#dataLibrary' , 
                bool: 'dataLibrary' ,
                items: [
                    { text: "Introduction", url: '#dataLibrary' , bool: 'dataLibrary'},
                    { text: "Calling a stored procedure", url: '#callingSP' , bool: 'callingSP'},
                    { text: "Creating a data cache", url: '#createDataCache' , bool: 'createDataCache'},
                    { text: "Managing cached data", url: '#manageCachedData' , bool: 'manageCachedData'}
                ]
            },
            { 
                text: "Intel.MyDeals.BusinessLogic", 
                url: '#businessLogic' , 
                bool: 'businessLogic' ,
                items: [
                    { text: "Introduction", url: '#businessLogic' , bool: 'businessLogic'},
                    { text: "Business logic layout", url: '#businessLogicLayout' , bool: 'businessLogicLayout'},
                    { text: "Business logic scope", url: '#businessLogicScope' , bool: 'businessLogicScope'},
                    { text: "Business logic function", url: '#businessLogicFunction' , bool: 'businessLogicFunction'},
                    { text: "Call a stored procedure", url: '#businessLogicCallProcedure' , bool: 'businessLogicCallProcedure'},
                    { text: "Call from data cache", url: '#businessLogicCallCache' , bool: 'businessLogicCallCache'}
                ]
            },
            { 
                text: "Intel.MyDeals.BusinessRules", 
                url: '#businessRules' , 
                bool: 'businessRules' ,
                items: [
                    { text: "Introduction", url: '#businessRules' , bool: 'businessRules'},
                ]
            },
            { 
                text: "Intel.MyDeals.App", 
                url: '#app' , 
                bool: 'app' ,
                items: [
                    { text: "Introduction", url: '#app' , bool: 'app'},
                ]
            },
            { 
                text: "Intel.MyDeals", 
                url: '#myDeals' , 
                bool: 'myDeals' ,
                items: [
                    { text: "Introduction", url: '#myDeals' , bool: 'myDeals'},
                    { text: "Creating API Controller", url: '#presentationWebApi', bool: 'presentationWebApi' },
                    { text: "Calling Web APIs", url: '#presentationCallWebApi', bool: 'presentationCallWebApi'},
                    { text: "Creating Angular Component", url: '#presentationAngularViews', bool: 'presentationAngularViews'}
                ]
            },
            { 
                text: "Examples", 
                url: '#examples' , 
                bool: 'examples' ,
                items: [
                    { text: "Introduction", url: '#examples' , bool: 'examples'},
                    { text: "Managing data from a procedure with cache", url: '#dataFromProcWithCache' , bool: 'dataFromProcWithCache'},
                    { text: "Managing data from an api with cache output", url: '#dataFromApiWithCache' , bool: 'dataFromApiWithCache'},
                ]
            }
        ];
    }

    navigateCodingTools(dataItem:any){
        const navigationExtras: NavigationExtras = {state: {dataItem}};
        this.router.navigate(['/CodingTools'], navigationExtras);
    }

    Toggle() {
        this.isVisible = !this.isVisible
    }

    testApi() {
        this.testingAPISvc.getTestApi().subscribe((result) => this.dataHealthApi = result);
        this.reasonData = (this.dataHealthApi.DETAILS);
        this.isErrorVisible = true;
    }
}