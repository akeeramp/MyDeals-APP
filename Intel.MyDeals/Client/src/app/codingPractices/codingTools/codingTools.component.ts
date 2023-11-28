import { Component, OnInit } from '@angular/core';
import { logger } from '../../shared/logger/logger';
import { Router } from '@angular/router';
@Component({
    selector: 'app-code-tools',
    templateUrl: 'Client/src/app/codingPractices/codingTools/codingTools.component.html',
    styleUrls: ['Client/src/app/codingPractices/codingTools/codingTools.component.css'],
})
export class CodingToolsComponent implements OnInit {

    public list_breadcrumbs : any;
    public left_nav : any;
    public flagBool: string;
    public isVisible: boolean = true;
    public keySelected: any = '0';

    ajaxData = `function sqlExceptionExample() {
            op.ajaxGetAsync("/api/DevTests/GetSQLException", function (data) {
                //success: manipulate your success case data here
            }, function (result) {
                //failure: manipulate your failure case data here
                op.handleError(result, 'Could not get X data.');
            });
        }`;

    CSharpException = `public string CSharpException()
        {
            try
            {
                ...
            }
            catch (Exception ex)
            {
                OpLogPerf.Log(ex);
                Exception x = new Exception("Encountered Business Logic Exception");
                throw x;
            }
            ...
        }`;

    GetSQLException = `public string GetSQLException()
        {
            try
            {
                ...
            }
            catch (Exception ex)
            {
                OpLogPerf.Log(ex);
                throw new HttpResponseException(HttpStatusCode.InternalServerError);  //responds with a simple status code for ajax call to consume.
            }
        }`;

    ExampleSQLException = `public string ExampleSQLException()
        {
            OpLogPerf.Log("ExampleSQLException");
            ...
            try
            {
                using (var rdr = DataAccess.ExecuteReader(new Procs.dbo.PR_EXAMPLE
                {
                    ...
                }))
                {
                    if (rdr.Read())
                    {
                        ...
                    }
                }
            }
            catch (Exception ex)
            {
                OpLogPerf.Log(ex);
                Exception x2 = new Exception("Encountered Database Exception");
                throw x2;
            }
            ...
        }`;

    constructor(private loggerService: logger, private router: Router) { 
        this.extraTools();
    }

    responseLnav(e:any,sKey?){
        this.flagBool = e.bool;
        if(this.flagBool == "introduction"){
            this.list_breadcrumbs = [
                { text: "Coding practices", url: "Home" },
                { text: "Coding tools", url: "CodingTools" },
                { text: "Introduction", url: "javascript:void(0)" }
            ];
        } else if(this.flagBool == "errorHandling"){
            this.list_breadcrumbs = [
                { text: "Coding practices", url: "Home" },
                { text: "Coding tools", url: "CodingTools" },
                { text: "Error handling", url: "javascript:void(0)" }
            ];
            this.keySelected = sKey;
        } else if(this.flagBool == "codeReviews"){
            this.list_breadcrumbs = [
                { text: "Coding practices", url: "Home" },
                { text: "Coding tools", url: "CodingTools" },
                { text: "Code Reviews", url: "javascript:void(0)" }
            ];
        } else if(this.flagBool == "logging"){
            this.list_breadcrumbs = [
                { text: "Coding practices", url: "Home" },
                { text: "Coding tools", url: "CodingTools" },
                { text: "Logging", url: "javascript:void(0)" }
            ];
            this.keySelected = sKey;
        } else if(this.flagBool == "unitTesting"){
            this.list_breadcrumbs = [
                { text: "Coding practices", url: "Home" },
                { text: "Coding tools", url: "CodingTools" },
                { text: "Unit Testing", url: "javascript:void(0)" }
            ];
        }
        const url = document.querySelector(e.url);
        url.scrollIntoView({ behavior: 'smooth', block: 'start'});
    }

    undefinedAngularRoute(){
        this.loggerService.error("'UndefinedAngularRoute' from state ''", "Could not resolve");
    }

    undefinedJSFunction(){
        this.loggerService.error("Javascript has encountered a problem.", "Something went wrong!")
    }

    exceptionsStoredProcedure(){
        this.loggerService.error("500: Internal Server Error (But dont tell users the error code, this is just an example)", "Something went wrong!")
    }


    ngOnInit(): void {
        this.list_breadcrumbs = [
            { text: "Coding practices", url: "Home" },
            { text: "Coding tools", url: "CodingTools" },
            { text: "Introduction", url: "javascript:void(0)" }
        ];

        this.left_nav = [
            { text: "Introduction", url:'#introduction', bool: "introduction" },
            { text: "Error handling", url:'#errorHandling', bool: "errorHandling" },
            { text: "Code Reviews", url:'#codeReviews', bool: "codeReviews" },
            { text: "Logging", url:'#logging', bool: "logging" },
            { text: "Unit Testing", url:'#unitTesting', bool: "unitTesting" }
        ];
    }

    extraTools(){
        const navigation = this.router.getCurrentNavigation();
        const state = navigation.extras.state;
        if(state){
            setTimeout(()=>{ 
                this.navigateToSelectedLink(state.dataItem);
            }, 500);
        }
    }

    Toggle() {
        this.isVisible = !this.isVisible
    }

    navigateToSelectedLink(dataItem,sKey?){
        const url = document.querySelector(dataItem.url);
        url.scrollIntoView({ behavior: 'smooth', block: 'start'});
        this.responseLnav(dataItem,sKey);
    }
}