var app = angular.module('MyDealsApp', ['kendo.directives']);

app.controller('constantsController', ["$scope", constantsController]);
function constantsController($scope) {
    // declare dataSource bound to backend
    var dataSource = new kendo.data.DataSource({
        transport: {
            read: {
                async: false,
                url: 'api/Constants/v1/GetConstants',
                dataType: "json"
            }
        },
        toolbar: ["create"],
        serverPaging: false,
        pageSize: 10,
        error: function (e) {
            alert(e.xhr.responseText);
        },
        editable: true
    });


    $scope.gridOptions = {
        dataSource: dataSource,
        sortable: true,
        pageable: true,
        columns: [
          { field: "CNST_NM", title: "Name" },
          { field: "CNST_VAL_TXT", title: "Value"},
          { field: "CNST_DESC", title: "Description" },
        ]
    };
}