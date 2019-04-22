/*
 Copyright (c) 2019 LG Electronics Inc.
 SPDX-License-Identifier: Apache-2.0
*/

/**
 * Created by gina on 9/18/18.
 */
/**=========================================================
 * Module: data.service.js
 * Services to initialize data service
 =========================================================*/

(function() {
    'use strict';

    angular
        .module('app.data')
        .service('LoginLoader', LoginLoader)



    LoginLoader.$inject = ['$http', '$state', '$location', '$localStorage', 'jwtHelper'];
    function LoginLoader($http, $state, $location, $localStorage, jwtHelper) {
        this.login = login;
        this.setToken = setToken;


        ////////////////

        function login(marketplace, onSuccess) {
            // Finding redirect Url
            // var redirectUri = $location.protocol()+ '%3A%2F%2F'+ $location.host()
            // if ($location.port()) {
            //     redirectUri = redirectUri + '%3A' + $location.port() + '%2F';
            // }
            // redirectUri = encodeURI(redirectUri);

            var url = marketplace.server;
            window.open(url,"_self");

        }

        function setToken(param) {
            var idToken = param.split("id_token=")[1].split("&")[0];
            $localStorage.token = idToken;
            console.log("idToken", idToken);

            parseToken();
        }
        function parseToken() {
            var decodeData = jwtHelper.decodeToken($localStorage.token);
            $localStorage.jwtDecodedToken = decodeData;
            console.log("decodeData", decodeData);
        }

    }

})();