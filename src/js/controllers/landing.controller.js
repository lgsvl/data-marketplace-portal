/*
 Copyright (c) 2019 LG Electronics Inc.
 SPDX-License-Identifier: Apache-2.0
*/


// To run this code, edit file index.html or index.jade and change
// html data-ng-app attribute from angle to myAppName
// ----------------------------------------------------------------------

(function() {
    'use strict';

    angular
        .module('app.data')
        .controller('FirstPageController', FirstPageController)
        .controller('LandingController', LandingController)
        .controller('RegisterController', RegisterController)
        .controller('LoginController', LoginController)
        .controller('LoginFailedController', LoginFailedController)

    FirstPageController.$inject = ['$http', '$log', '$state', 'LoginLoader'];
    function FirstPageController($http, $log, $state, LoginLoader) {
        var vm = this;

        activate();

        ////////////////

        function activate() {
            vm.goHome = function() {
                $state.go('page.landing');
            };

            vm.openSignin = function(doneSignin) {
                $state.go('page.login');
            };
        }
    }

    LandingController.$inject = ['$http', '$log', '$state'];
    function LandingController($http, $log, $state) {
        var vm = this;

        activate();

        ////////////////

        function activate() {
            vm.carouselInterval = 3000;

            vm.carouselSlides = [

                {
                    title: 'FOR DATA SELLERS',
                    description: 'Data sellers can preserve confidentiality, maintain control, adapt to emerging business needs without the fear of being locked into a specific architecture or data vendor.',
                    feature1 : {
                        icon: '../img/landingPage/seller1.svg',
                        name: 'PRIVACY',
                        description: 'Publish your data catalog to all users or selected consortium members. Exchange data confidentially through private channels.'
                    },
                    feature2: {
                        icon: '../img/landingPage/seller2.svg',
                        name: 'CONTROL',
                        description: 'Maintain control over your data through decentralized storage without exposing it to a central repository.'
                    },
                    feature3: {
                        icon: '../img/landingPage/seller3.svg',
                        name: 'ENTERPRISE READY',
                        description: 'Deploy your data marketplace nodes either on-premise or in the cloud. Provide the ability to scale up and down through resource planning.'
                    }

                },
                {
                    title: 'FOR DATA BUYERS',
                    description: 'Data is certified on an immutable distributed ledger allowing buyers to buy with confidence that they have control over the data provenance and quality.',
                    feature1 : {
                        icon: '../img/landingPage/buyer1.svg',
                        name: 'PRIVACY',
                        description: 'Enable direct and confidential data acquisition for batch and real-time data in encrypted and unencrypted forms.'
                    },
                    feature2: {
                        icon: '../img/landingPage/buyer2.svg',
                        name: 'CONTROL',
                        description: 'Allow you to buy data with confidence that you have control over the data provenance and quality.'
                    },
                    feature3: {
                        icon: '../img/landingPage/buyer3.svg',
                        name: 'Assess The Data Source',
                        description: 'Access the extensible architecture of the data processors/services to better support your company, improve your products and serve your customers.'
                    }
                }
            ]
        }
    }

    RegisterController.$inject = ['$http', '$log', '$state'];
    function RegisterController($http, $log, $state) {
        var vm = this;

        activate();

        ////////////////

        function activate() {
        }
    }

    LoginController.$inject = ['$http', '$log', '$state', 'config', 'LoginLoader'];
    function LoginController($http, $log, $state, config, LoginLoader) {
        var vm = this;
        vm.option = {};
        activate();

        ////////////////

        function activate() {

            vm.option.marketplaces = config.srv.marketplaces;

            vm.signIn = function(domain, com) {
                var emailDomain = "@" + domain + '.' + com;

                var marketplace = vm.option.marketplaces;
                var foundMarketplace = false;
                for (var i=0; i < marketplace.length; i++) {
                    if (emailDomain == marketplace[i].domain) {
                        LoginLoader.login(marketplace[i], doneSignin);
                        foundMarketplace = true
                        break;
                    }
                }

                if (foundMarketplace == false) {
                    LoginLoader.emailDomain = emailDomain;
                    $state.go('page.loginFailed')
                }
            };
            function doneSignin(result) {
            }
        }
    }
    LoginFailedController.$inject = ['$http', '$log', '$state', 'LoginLoader'];
    function LoginFailedController($http, $log, $state, LoginLoader) {
        var vm = this;

        activate();

        ////////////////

        function activate() {
            vm.emailDomain = LoginLoader.emailDomain;

            vm.openSignin = function() {
                $state.go('page.login');
            };
        }
    }
})();
