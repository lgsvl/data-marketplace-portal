/*
 Copyright (c) 2019 LG Electronics Inc.
 SPDX-License-Identifier: Apache-2.0
*/

(function() {
    'use strict';

    angular
        .module('app.admin', [
            'app.core',
            'ngStorage',
            'angular-jwt'
            /*...*/
        ])
        .run(function($rootScope, $http, $state) {
            $http.defaults.headers.common['Content-Type'] = 'application/json' ;
            $http.defaults.cache = false;

        })
        .config(['jwtInterceptorProvider', '$httpProvider', function (jwtInterceptorProvider, $httpProvider){
            jwtInterceptorProvider.tokenGetter = ['$localStorage', function($localStorage)
            {
                return $localStorage.token;
            }];
            jwtInterceptorProvider.authPrefix = 'user ';
            $httpProvider.interceptors.push('jwtInterceptor');
        }]);
})();