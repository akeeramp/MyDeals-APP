function pocDataFlow() { }

pocDataFlow.saveEmployee = function () {
    util.waitMsg("Saving Data...");

    var data = {
        "emp_sid": 0,
        "first_nm": $("#firstName").val(),
        "last_nm": $("#lastName").val()
    };

    op.ajaxPostAsync("/api/Others/SetPocEmp", data, function (data) {
        util.waitMsg("Employee Data Saved!");
        op.notifySuccess("Employee Data Saved!");
        pocDataFlow.getEmployees();
        util.waitMsg("");
    }, function (xhr) {
        op.notifyError("Something went wrong... sorry", "Error");
        util.waitMsg("");
    });
}

pocDataFlow.deleteEmployee = function (empId) {
    util.waitMsg("Deleting Employee...");

    op.ajaxGetAsync("/api/Others/DelPocEmp/" + empId, function (data) {
        util.waitMsg("Employee Deleted!");
        op.notifySuccess("Employee Deleted!");
        pocDataFlow.getEmployees();
        util.waitMsg("");
    }, function (xhr) {
        debugger;
        op.notifyError("Something went wrong... sorry", "Error");
        util.waitMsg("");
    });
}

pocDataFlow.getEmployees = function () {

    $("#empList").kendoListView({
        dataSource: new kendo.data.DataSource({
            transport: {
                read: {
                    url: "/api/Others/GetPocEmp",
                    dataType: "json"
                }
            },
            sort: { field: "emp_sid", dir: "asc" }
        }),
        template: '<div class="item"><span>#:emp_sid#</span> #:first_nm# #:last_nm# <span onClick="pocDataFlow.deleteEmployee(#:emp_sid#)"><i class="intelicon-trash delEmp"></i></span></div>'
    });
}
