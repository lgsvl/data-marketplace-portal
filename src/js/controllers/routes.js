'use strict';

/**
 * Route configuration for the RDash module.
 */
angular.module('app.routes').config(['$stateProvider', '$urlRouterProvider', 'jwtOptionsProvider',
    function($stateProvider, $urlRouterProvider, jwtOptionsProvider) {

        // For unmatched routes
        $urlRouterProvider.otherwise(function($injector, $location){
            var state = $injector.get('$state');

            if ($location.url() != "") {
                var loginLoader = $injector.get('LoginLoader');
                loginLoader.setToken($location.url());
                state.go('app.browse')
            } else {
                state.go('page.landing');

            }
            return $location.path();
        });

        jwtOptionsProvider.config({
            whiteListedDomains: [
                'http://localhost:5000',
                'http://localhost:8000',
                'http://localhost:8080',
                'http://localhost:8888',
                'https://portal.datagraviti.com'
            ]
        });
        // Application routes
        $stateProvider
            .state('page', {
                url: '/page',
                templateUrl: 'templates/main-page-panel.html'
            })
            .state('page.landing', {
                url: '/landing',
                title: 'Data Market Place',
                views: {
                    'main': {templateUrl: 'templates/main-page-landing.html'}
                },
                // resolve: helper.resolveFor()
            })
            .state('page.register', {
                url: '/register',
                title: 'Register',
                views: {
                    'main': {templateUrl: 'templates/main-page-register.html'}
                }
            })
            .state('page.login', {
                url: '/login',
                title: 'Login',
                views: {
                    'main': {templateUrl: 'templates/main-page-login.html'}
                }
            })
            .state('page.loginFailed', {
                url: '/loginFailed',
                title: 'Login Failed',
                views: {
                    'main': {templateUrl: 'templates/main-page-login-failed.html'}
                }
            })
            .state('app', {
                url: '',
                abstract: true,
                templateUrl: 'templates/app.html'
            })
            .state('app.browse', {
                url: '/browse',
                title: 'Browse',
                templateUrl: 'templates/marketplace-browse.html'
            })
            // .state('app.detaildataset', {
            //     url: '/detaildataset',
            //     title: 'Detail Dataset',
            //     templateUrl: helper.basepath('templates/detailDataset.html')
            // })
            .state('app.purchaseConfirmed', {
                url: '/purchaseconfirmed',
                title: 'Purchase confirmed',
                templateUrl: 'templates/purchaseConfirmed.html'
            })
            .state('app.sellDashboard', {
                url: '/sellDashboard',
                title: 'Sell Dashboard',
                templateUrl: 'templates/marketplace-sell-dashboard.html'
            })
            .state('app.sell', {
                url: '/sell',
                title: 'Sell On Marketplace',
                templateUrl: 'templates/sellOnMarketplace.html'
            })
            .state('app.createDatasetConfirmed', {
                url: '/createdatasetconfirmed',
                title: 'Create data set confirmed',
                templateUrl: 'templates/dataset-created-confirmed.html'
            })
            .state('app.createDatasetConfirmedStream', {
                url: '/createdatasetconfirmedStream',
                title: 'Create data set confirmed',
                templateUrl:'templates/dataset-created-confirmed-stream.html'
            })
            .state('app.purchaseDashboard', {
                url: '/purchaseDashboard',
                title: 'Purchase Dashboard',
                templateUrl: 'templates/marketplace-purchase-dashboard.html'
            })
            //
            // .state('app.account', {
            //     url: '/account',
            //     title: 'Account',
            //     // templateUrl: helper.basepath('custom/my-account.html'),
            //     views: {
            //         '': {templateUrl: helper.basepath('custom/my-account.html')},
            //         'myPurchases@app.account': {templateUrl: helper.basepath('custom/my-account-purchase.html')},
            //         'manageDatasets@app.account': {templateUrl: helper.basepath('custom/my-account-manage-dataset.html')},
            //         'myUploads@app.account': {templateUrl: helper.basepath('custom/my-account-uploads.html')}
            //     }
            // })
            // .state('app.upload', {
            //     url: '/upload',
            //     title: 'Upload',
            //     templateUrl: 'templates/upload.html'
            // })

            //
            //
            // .state('admin', {
            //     url: '/admin',
            //     abstract: true,
            //     templateUrl: 'templates/admin/app.html'
            // })
            // .state('admin.category', {
            //     url: '/category',
            //     title: 'Category',
            //     templateUrl: 'templates/admin/category.html'
            // })
    }
])
    .constant('config', {
        srv: {
            faisalSvcUrl: 'https://file.datagraviti.com/v1',
            categorySvcUrl: 'https://facade.datagraviti.com/api/v1',
            catalogSvcUrl: 'https://facade.datagraviti.com/api/v1',
            reviewSvcUrl: 'https://facade.datagraviti.com/api/v1',
            tradeSvcUrl: 'https://facade.datagraviti.com/api/v1',
            streamSvcUrl: 'https://stream.datagraviti.com/v1',
            streamConsumptionSvcUrl: 'https://kafka.datagraviti.com/consumers',
            marketplaces: [
                {
                    name: 'Market Place 1',
                    server: 'https://datamarketplace1.auth.us-west-2.amazoncognito.com/login?response_type=token&scope=openid&client_id=3vh7qah4ia3dmoee8u5r5v2m7b&redirect_uri=http%3A%2F%2Flocalhost%3A5000%2F',
                    domain: '@marketplace1.com'
                },
                {
                    name: 'Market Place 2',
                    server: 'https://datamarketplace2.auth.us-west-2.amazoncognito.com/login?response_type=token&scope=openid&client_id=7omk02ngev38k3mdr5j4fbtflk&redirect_uri=http%3A%2F%2Flocalhost%3A5000%2F',
                    domain: '@marketplace2.com'
                }
            ]

        }})
;