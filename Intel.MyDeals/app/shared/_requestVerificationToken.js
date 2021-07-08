function SetRequestVerificationToken ($http) {
    if ($http) {
        $http.defaults.headers.common['ReqVerToken'] = angular.element("body").attr('csrfRequestVerificationToken');
    }
    if (localStorage.getItem('ReqVerToken') != null && localStorage.getItem('ReqVerToken') != undefined) {

        localStorage.setItem('ReqVerToken', angular.element("body").attr('csrfRequestVerificationToken'));
    }
}