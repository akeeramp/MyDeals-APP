angular
    .module('app.contract')
    .factory('customerService', customerService);

// Minification safe dependency injection
customerService.$inject = ['dataService'];

function customerService(dataService) {
    // defining the base url on top, subsequent calls in the service
    // Bring in all the customer related calls for contract manager in here
    var apiBaseLookupUrl = "api/CustomerCalendar/";

    var service = {
        getCustomerCalendar: getCustomerCalendar,
    }

    return service;

    function getCustomerCalendar(custMbrSid, dayInQuarter, quater, year) {
        var dto = { 'CustomerMemberSid': custMbrSid, "DayInQuarter": dayInQuarter, "QuarterNo": quater, "Year": year };
        return dataService.post(apiBaseLookupUrl + 'GetCustomerQuarterDetails', dto);
    }
}