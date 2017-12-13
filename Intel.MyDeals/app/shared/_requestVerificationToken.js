function SetRequestVerificationToken ($http) {

    if ($http) {
        $http.defaults.headers.common['ReqVerToken'] = angular.element("body").attr('csrfRequestVerificationToken');
    }

}