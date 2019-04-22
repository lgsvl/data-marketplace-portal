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
        .controller('TopNavbarController', TopNavbarController)
        .controller('BrowseController', BrowseController)
        .controller('DetailDatasetController', DetailDatasetController)
        .controller('PurchaseConfirmController', PurchaseConfirmController)
        .controller('DatasetCreateConfirmController', DatasetCreateConfirmController)
        .controller('DatasetStreamCreateConfirmController', DatasetStreamCreateConfirmController)
        .controller('MyAccountController', MyAccountController)
        .controller('MyAccountPurchaseController', MyAccountPurchaseController)
        .controller('MyAccountManageDatasetController', MyAccountManageDatasetController)
        .controller('MyAccountUploadsController', MyAccountUploadsController)
        .controller('SellDashboardController', SellDashboardController)
        .controller('PurchaseDashboardController', PurchaseDashboardController)
        .controller('SellController', SellController)
        .controller('DataController', DataController)
        .directive('ngFiles', ngFiles)
        .directive('imageloaded', imageloaded);

    ngFiles.$inject = ['$parse'];
    function ngFiles($parse) {
        function fn_link(scope, element, attrs) {
            var onChange = $parse(attrs.ngFiles);
            element.on('change', function (event) {
                onChange(scope, { $files: event.target.files });
            });
        };

        return {
            link: fn_link
        }
    }

    TopNavbarController.$inject = ['$state', '$scope', 'DataLoader', 'EventLoader', '$localStorage', 'CategoryLoader', 'TradeLoader'];
    function TopNavbarController($state, $scope, DataLoader, EventLoader, $localStorage, CategoryLoader, TradeLoader) {
        // for controllerAs syntax
        var vm = this;

        activate();

        ////////////////

        function activate() {
            getNotifications();
            setUser();
            CategoryLoader.listCategoryEntries(onReadyListCategoryEntries);
            vm.activeDropdown = 1;

            function getNotifications() {
                vm.mypurchaseNotification = 0;
                vm.manageDatasetNotification = 0;
                vm.myUploadsNotification = 0;
                vm.totalNotification = 0;
                EventLoader.listSold('ToUpload', doneListSoldToUpload);
                EventLoader.listPurchased('UploadedNotDownloaded', doneListPurchaseUploadedNotDownloaded);
            }
            function setUser() {
                vm.username = $localStorage.jwtDecodedToken['cognito:username'].toUpperCase();
                TradeLoader.getBusinessEntries(onReadyBusinessEntries);
            }

            function onReadyBusinessEntries(result) {
                var businessDictionary = result.reduce(function(map, obj) {
                    map[obj.id] = obj;
                    return map;
                }, {});
                DataLoader.businessDictionary = businessDictionary;
            }
            function onReadyListCategoryEntries(result) {

                var categoryDictionary = result.reduce(function(map, obj) {
                    map[obj.id] = obj.name;
                    return map;
                }, {});
                DataLoader.categoryDictionary = categoryDictionary;
            }

            function doneListSoldToUpload(result) {
                vm.myUploadsNotification = result.length;
                vm.totalNotification = vm.mypurchaseNotification + vm.manageDatasetNotification + vm.myUploadsNotification;
            }

            function doneListPurchaseUploadedNotDownloaded(result) {
                vm.mypurchaseNotification = result.length;
                vm.totalNotification = vm.mypurchaseNotification + vm.manageDatasetNotification + vm.myUploadsNotification;
            }



            vm.goHome = function() {
              $state.go('page.landing');
            };
            vm.openBrowse = function() {
                DataLoader.selectedBrowsePage = 1;
                vm.activeDropdown = 1;
                $state.go('app.browse');
            };
            vm.openSell = function() {
                vm.activeDropdown = 2;
                $state.go('app.sellDashboard');
            };
            vm.openPurchase = function() {
                vm.activeDropdown = 3;
                $state.go('app.purchaseDashboard');
            }
            vm.openAccount = function(page) {
                DataLoader.currentAccountPage = page;
                $state.go('app.account', {}, {reload: true})
            };


        }
    }

    BrowseController.$inject = ['$state', '$scope', 'DataLoader','CatalogLoader', 'CategoryLoader'];
    function BrowseController($state, $scope, DataLoader, CatalogLoader, CategoryLoader) {
        // for controllerAs syntax
        var vm = this;
        // vm.subContainer = 1;

        activate();

        ////////////////

        function activate() {
            if (DataLoader.selectedBrowsePage != undefined)
                vm.subContainer = DataLoader.selectedBrowsePage;
            else
                vm.subContainer = 1;

            $scope.fakeRating = 4;
            $scope.max = 5;

            vm.category = "Category";


            CategoryLoader.listCategoryEntries(onReadyListCategoryEntries);
            function onReadyListCategoryEntries(result) {
                vm.categories = result;
                var categoryDictionary = result.reduce(function(map, obj) {
                    map[obj.id] = obj.name;
                    return map;
                }, {});
                DataLoader.categoryDictionary = categoryDictionary;
            }

            vm.pickedForYou = {
                categoryId: "5287719d-290e-439c-b3ea-336c9a491d7e",
                dataType: "STREAM",
                definition_format: "string",
                description: "Google Chromecast time-series usage data with LG TV in US from Jan 2018 to Dec 2018. All the data is anonymized.",
                extras: {
                    definition_format: "string",
                    frequency: 20,
                    streamEndPoint: "http://stream.meetup.com/2/rsvps",
                    streamTopic: "pull"},
                id: "d2096e2e-2ab8-4d45-aa43-09db4fa237b3",
                name: "Smart Home",
                ownership: {ownershipType: "SHARED"},
                priceType: {definition_format: "string", amount: 12, currency: "USD"},
                provider: "gina@company1.com",
                score: 4
            };

            CategoryLoader.listPopularCategories(onReadyListPopularCategories)

            function onReadyListPopularCategories(result) {
                vm.categoryPopular = result;
            }

            vm.search = function(type, value) {

                if (type == "category") {
                    vm.subContainer = 2;
                    vm.searchedKeyword = ": " + value.name;
                    CatalogLoader.listCatalogEntries(value.id, onReadyCatalogEntries);

                } else {
                    if (value != undefined && value != "") {
                        vm.subContainer = 2.5;
                        vm.searchedKeyword = ": " + value;
                        CatalogLoader.getCatalogEntriesByKeyword(value, onReadyCatalogEntries);
                    } else {
                        vm.subContainer = 2;
                        vm.searchedKeyword = "";
                        CatalogLoader.listCatalogEntries(vm.selectedCategoryId, onReadyCatalogEntries);
                    }
                }

                function onReadyCatalogEntries(result) {
                    vm.dataset = result;
                }
            };

            vm.setCategory = function(category) {
                vm.category = category.name;
                vm.selectedCategoryId = category.id;
            };

            vm.getCategory = function(category) {
                return DataLoader.categoryDictionary[category];
            };

            vm.onDatasetClicked = function(item) {
                DataLoader.selectedDataset = item;
                vm.subContainer = 3;

            };

            vm.carouselInterval = 3000;

            CatalogLoader.listCatalogEntries(vm.selectedCategoryId, onReadyCatalogEntries)

            function onReadyCatalogEntries(result) {
                var latestProducts=[];
                var innerArray=[];
                for(var i=0; i<result.length; i++) {
                    innerArray.push(result[i]);
                    if ((i+1)%3 == 0 || i == result.length-1) {
                        latestProducts.push(innerArray);
                        innerArray = [];
                    }

                }
                vm.carouselSlides = latestProducts;
            }

            vm.clearSearchResult = function () {
                vm.subContainer = 1;
            };

            vm.goBrowsePage = function() {
                $state.go('app.browse', {}, {reload: true});
            };

        }
    }

    DetailDatasetController.$inject = ['$state', '$scope', 'DataLoader', 'ngDialog', 'TradeLoader', 'CatalogLoader', 'EventLoader'];
    function DetailDatasetController($state, $scope, DataLoader, ngDialog, TradeLoader, CatalogLoader, EventLoader) {
        // for controllerAs syntax
        var vm = this;

        activate();

        ////////////////

        function activate() {
            vm.timeUnit = "Select";
            vm.timeUnits = ["HOUR", "DAY", "WEEK", "MONTH"];
            vm.setTimeUnit = function(timeUnit) {
                vm.timeUnit = timeUnit;
                getPricePerPeriod();
            };
            vm.data = DataLoader.selectedDataset;
            vm.data.providerName = DataLoader.getBusinessNameById(vm.data.provider);
            vm.moreReviews = vm.data.reviews.slice(3);
            vm.reviewsExpanded = false;

            //fake latest product
            CatalogLoader.listCatalogEntries(vm.data.categoryId, onReadyCatalogEntries)

            EventLoader.listPurchased('Downloaded', onReadyPurchasedDownloaded);

            function onReadyCatalogEntries(result) {
                var latestProducts=[];
                var innerArray=[];
                for(var i=0; i<result.length; i++) {
                    innerArray.push(result[i]);
                    if ((i+1)%3 == 0 || i == result.length-1) {
                        latestProducts.push(innerArray);
                        innerArray = [];
                    }

                }
                vm.carouselSlides = latestProducts;
            }

            function onReadyPurchasedDownloaded(result) {
                vm.purchasedDownloaded = result;
                isBoughtDataset(result);

            }

            function isBoughtDataset(purchases) {
                vm.boughtDataset = false;
                for (var i=0; i<purchases.length; i++) {
                    if (purchases[i].dataContractType == vm.data.id) {
                        vm.boughtDataset = true;
                        vm.data.contract = purchases[i];
                    }
                }
            }

            vm.getPricePerPeriod = getPricePerPeriod;
            function getPricePerPeriod() {
                var unitPrice = vm.data.priceType.amount;
                var timeValue = vm.timeValue;
                var radioModel = vm.timeUnit;
                var price;
                switch(radioModel) {
                    case "HOUR":
                        price = timeValue * unitPrice;
                        break;
                    case "DAY":
                        price = timeValue * unitPrice * 24;
                        break;
                    case "WEEK":
                        price = timeValue * unitPrice * 24 * 7;
                        break;
                    case "MONTH":
                        price = timeValue * unitPrice * 24 * 7 * 30;
                        break;
                    default:
                        price = timeValue * unitPrice;

                }
                if (Number.isNaN(price)) {
                    vm.data.priceTotal = 0;
                } else {
                    vm.data.priceTotal = price;
                }
            };
            function getEndDatePerPeriod() {
                var timeValue = vm.timeValue;
                var radioModel = vm.timeUnit;

                var endDay;
                switch(radioModel) {
                    case "HOUR":
                        endDay = moment().add(timeValue, 'hours').format('YYYY-MM-DDTHH:mm:ss.SSSZ');
                        break;
                    case "DAY":
                        endDay = moment().add(timeValue, 'days').format('YYYY-MM-DDTHH:mm:ss.SSSZ');
                        break;
                    case "WEEK":
                        endDay = moment().add(timeValue, 'weeks').format('YYYY-MM-DDTHH:mm:ss.SSSZ');
                        break;
                    case "MONTH":
                        endDay = moment().add(timeValue, 'months').format('YYYY-MM-DDTHH:mm:ss.SSSZ');
                        break;
                    default:
                        endDay = moment().add(timeValue, 'hours').format('YYYY-MM-DDTHH:mm:ss.SSSZ');

                }
                return endDay;
            };
            vm.onClickBuyNow = function(dataset) {

                $scope.data = vm.data;

                if (dataset.data.dataType == "STREAM") {
                    $scope.data.extras.streamEndDateTime = getEndDatePerPeriod();
                }

                DataLoader.submitDataContractProposal($scope.data, onReadySubmitDataContractProposal);


                function onReadySubmitDataContractProposal(result) {
                    $state.go('app.purchaseConfirmed')

                }

            };

            vm.writeReview = function(dataset) {
                ngDialog.open({
                    template: 'writeReviewDialog',
                    controller: ['$scope', '$state', 'ReviewLoader', function ($scope, $state, ReviewLoader) {
                        $scope.data = dataset;
                        $scope.data.providerShort = $scope.data.provider.split("#")[1];
                        $scope.data.review = {};
                        $scope.todayDate = new Date();
                        $scope.metaReady = {};
                        $scope.buttonDisabled = true;
                        $scope.postReview = function() {
                            ngDialog.close();
                            ReviewLoader.addReviewEntry($scope.data, onDoneAddReviewEntry);
                        };
                        function onDoneAddReviewEntry(result) {
                            ngDialog.open({
                                template: 'writeReviewSuccessfulDialog',
                                controller: ['$scope', '$state', function ($scope, $state) {
                                    setTimeout(function(){
                                        ngDialog.close();
                                        DataLoader.selectedBrowsePage = 3;
                                        DataLoader.selectedDataset = dataset;
                                        $state.go('app.browse', {}, {reload: true});
                                    }, 4000);

                                }],
                                className: 'ngdialog-theme-default ngdialog-theme-write-review-successful'
                            });

                        }

                        $scope.updateReady = function(meta) {
                            $scope.metaReady[meta] = meta;

                            if ($scope.metaReady['score'] !=undefined && $scope.metaReady['text'] != undefined) {
                                $scope.$applyAsync(function () {
                                    $scope.reviewReady = true;
                                    $scope.buttonDisabled = false;
                                });
                            }
                        }
                    }],
                    className: 'ngdialog-theme-default ngdialog-theme-write-review'
                });

            }

            vm.getCategory = function(category) {
                return DataLoader.categoryDictionary[category];
            };

            vm.expandReviews = function() {
                vm.reviewsExpanded = true;
            }

        }
    }

    PurchaseConfirmController.$inject = ['$state'];
    function PurchaseConfirmController($state) {
        var vm = this;

        activate();

        ////////////////

        function activate() {
            vm.goToBrowse = function() {
                $state.go('app.browse')
            };
            vm.goMyPurchase = function() {
                $state.go('app.purchaseDashboard');
            };
        }
    }

    SellDashboardController.$inject = ['$state', '$scope', 'CategoryLoader', 'CatalogLoader', 'EventLoader', 'DataLoader', 'TradeLoader', 'ngDialog', '$localStorage'];
    function SellDashboardController($state, $scope, CategoryLoader, CatalogLoader, EventLoader, DataLoader, TradeLoader, ngDialog, $localStorage) {
        var vm = this;
        vm.userName = $localStorage.jwtDecodedToken['cognito:username'].charAt(0).toUpperCase() +$localStorage.jwtDecodedToken['cognito:username'].slice(1);
        var iss = $localStorage.jwtDecodedToken.iss;
        activate();

        ////////////////

        function activate() {
            vm.category = "Category";
            vm.sort = "Sort by";
            CategoryLoader.listCategoryEntries(onReadyListCategoryEntries);
            function onReadyListCategoryEntries(result) {
                vm.categories = result;
            }

            TradeLoader.lookupNumberOfBusinessDataSetsToUpload(iss, readyNumberOfBusinessDataSetsToUpload);
            function readyNumberOfBusinessDataSetsToUpload(result) {
                var numberOfDataToUpload = result;
                CatalogLoader.lookupCatalogEntriesByProvider(iss, onReadyLookupCatalogEntriesByProvider);

                function onReadyLookupCatalogEntriesByProvider(result) {
                    for(var i=0; i<result.length; i++) {
                        if(numberOfDataToUpload[result[i].id] !== undefined) {
                            result[i].numberOfDataToUpload = numberOfDataToUpload[result[i].id];
                        } else {
                            result[i].numberOfDataToUpload = 0;
                        }
                    }

                    vm.soldProducts = result;
                }
            }

            EventLoader.listSold('ToUpload', onReadySoldToUpload);
            function onReadySoldToUpload(result) {
                vm.soldToUpload = result;
                EventLoader.getDetails(vm.soldToUpload, onReadyDetails);
                function onReadyDetails(response){
                    for (var i=0; i<vm.soldToUpload.length; i++) {
                        vm.soldToUpload[i].detail = response[i];
                    }
                    $scope.$apply(vm.soldToUpload);
                }
            }

            vm.openSellDataPage = function() {
                $state.go('app.sell');
            };
            vm.openUpload = function(data) {
                ngDialog.open({
                    template: 'uploadDataDialog',
                    controller: ['$scope', '$state', 'DataLoader', 'FileUploader', function ($scope, $state, DataLoader, FileUploader) {
                        $scope.uploader = new FileUploader();

                        $scope.dataset = data;

                        var formdata = new FormData();
                        $scope.getTheFiles = function ($files) {
                            $scope.$applyAsync(function() {
                                $scope.fileSelected = true;
                            });
                            angular.forEach($files, function (value, key) {
                                formdata.append("file", value);
                            });
                        };
                        $scope.uploadFile = function(contractId) {
                            ngDialog.close();
                            DataLoader.uploadFile(contractId, formdata, doneUploadFile)
                        };
                        function doneUploadFile(result) {
                            vm.hash = result.hash;

                            ngDialog.open({
                                template: 'uploadDataSuccessfulDialog',
                                controller: ['$scope', '$state', function ($scope, $state) {
                                    setTimeout(function(){
                                        ngDialog.close()
                                        $state.go('app.sellDashboard', {}, {reload: true})
                                    }, 4000);

                                }],
                                className: 'ngdialog-theme-default ngdialog-theme-file-successful'
                            });


                        }
                    }],
                    className: 'ngdialog-theme-default ngdialog-theme-upload-file'
                });
            };

            vm.openDataContractList = function(product) {
                ngDialog.open({
                    template: 'dataContractListDialog',
                    controller: ['$scope', '$state', 'TradeLoader', 'DataLoader', function ($scope, $state, TradeLoader, DataLoader) {
                        $scope.product = product;

                        var soldToUploadPerData=[];
                        for (var i=0; i<vm.soldToUpload.length; i++) {
                            if (product.id == vm.soldToUpload[i].detail.id)
                                soldToUploadPerData.push(vm.soldToUpload[i]);
                        }
                        $scope.contractList = soldToUploadPerData;

                        $scope.getCompanyName = function(id) {
                            return DataLoader.getBusinessNameById(id);
                        };


                        $scope.openUpload = function(data) {
                            ngDialog.close();
                            ngDialog.open({
                                template: 'uploadDataDialog',
                                controller: ['$scope', '$state', 'DataLoader', 'FileUploader', function ($scope, $state, DataLoader, FileUploader) {
                                    $scope.uploader = new FileUploader();

                                    $scope.dataset = data;

                                    var formdata = new FormData();
                                    $scope.getTheFiles = function ($files) {
                                        $scope.$applyAsync(function() {
                                            $scope.fileSelected = true;
                                        });
                                        angular.forEach($files, function (value, key) {
                                            formdata.append("file", value);
                                        });
                                    };
                                    $scope.uploadFile = function(contractId) {
                                        ngDialog.close();
                                        DataLoader.uploadFile(contractId, formdata, doneUploadFile)
                                    };
                                    function doneUploadFile(result) {
                                        vm.hash = result.hash;

                                        ngDialog.open({
                                            template: 'uploadDataSuccessfulDialog',
                                            controller: ['$scope', '$state', function ($scope, $state) {
                                                setTimeout(function(){
                                                    ngDialog.close()
                                                    $state.go('app.sellDashboard', {}, {reload: true})
                                                }, 4000);

                                            }],
                                            className: 'ngdialog-theme-default ngdialog-theme-file-successful'
                                        });

                                    }
                                }],
                                className: 'ngdialog-theme-default ngdialog-theme-upload-file'
                            });
                        };
                    }],
                    className: 'ngdialog-theme-default ngdialog-theme-upload-list'
                });
            }
            vm.getCategory = function(category) {
                return DataLoader.categoryDictionary[category];
            };

            vm.getCompanyName = function(id) {
                return DataLoader.getBusinessNameById(id);
            }
        }
    }

    SellController.$inject = ['$state', '$scope', 'DataLoader', 'CatalogLoader', 'CategoryLoader', 'StreamLoader', 'FileUploader'];
    function SellController($state, $scope, DataLoader, CatalogLoader, CategoryLoader, StreamLoader, FileUploader) {
        var vm = this;
        vm.metadata = {};
        vm.option = {};


        //test
        vm.stepProgbar = 0;
        vm.progbarBundle = {};
        vm.selectedForm = 1;
        vm.states = "state-1";
        vm.dataType = "";
        vm.ownershipType = "";
        vm.categoryInput = "Category";
        vm.filesizeInput = "File size range";


        activate();

        ////////////////

        function activate() {
            $scope.uploader = new FileUploader();

            CategoryLoader.listCategoryEntries(onReadyListCategoryEntries);
            function onReadyListCategoryEntries(result) {
                vm.option.category = result;
            }

            vm.option.filesize = [
                "0 ~ 500KB",
                "501KB ~  1MB",
                "1.1MB ~  2MB",
                "2MB  ~"
            ];

            vm.option.filetype = [
                "File",
                "Stream",
                "Queryable"
            ];
            vm.option.pullPushModel = [
                "Pull",
                "Push"
            ];
            vm.option.ownership = [{
                name: 'Shared',
                id: 'SHARED'
            }, {
                name: 'Transfer',
                id: 'TRANSFERRED_TO_BUYER'
            }, {
                name: 'Solo',
                id: 'HOLD_BY_SELLER'
            }];
            vm.option.group = [
                "Group 1",
                "Group 2",
                "Group 3"
            ];
            
            vm.setCategory = function(category) {
                vm.categoryInput = category.name;
                vm.selectedCategoryId = category.id;
                vm.metadata.category = category;

            };
            vm.setFilesize = function(filesize) {
                vm.filesizeInput = filesize;
                vm.metadata.filesize = filesize;
            };
            vm.onClickAdd = function() {
                CatalogLoader.addCatalogEntry(vm.metadata, onDoneAddCatalogEntry);
            };

            function onDoneAddCatalogEntry(result) {
                if (result.dataType.toUpperCase() == "STREAM") {
                    if (result.extras.streamEndPoint == undefined) {
                        StreamLoader.createTopic(result.id, doneCreateTopic);
                        CatalogLoader.createdDataModel = 'push';
                        $state.go('app.createDatasetConfirmedStream')
                    } else {
                        StreamLoader.pullPushStream(result.id, vm.metadata.streamEndPoint, vm.metadata.streamTopic, donePullPushStream);
                        CatalogLoader.createdDataModel = 'pull';
                        $state.go('app.createDatasetConfirmedStream');
                    }


                } else {
                    $state.go('app.createDatasetConfirmed')
                }

            }
            function donePullPushStream(result) {
            }
            function doneCreateTopic(result) {
            }

            $scope.isSelected = function(selection) {
                if (vm.selectedForm == selection) {
                    return true;
                } else {
                    return false;
                }
            };
            $scope.isDone = function(selection) {
                if (selection < vm.selectedForm) {
                    return true;
                } else {
                    return false;
                }
            };

            $scope.setNext = function(page) {
                if (page == 'dataTypeSelection') {
                    vm.metadata = {};
                }
                vm.stepProgbar = vm.stepProgbar + 50;
                vm.selectedForm = vm.selectedForm+1;
                if (vm.dataType != "") {
                    vm.selectedDataType = vm.dataType;
                    vm.metadata.filetype = vm.dataType;
                }
            };
            $scope.setPrevious = function(location) {
                if(location=='dashboard') {
                    $state.go('app.sellDashboard');
                } else {
                    vm.stepProgbar = vm.stepProgbar - 50;
                    vm.selectedForm = vm.selectedForm-1;
                }

            };
            $scope.createData = function() {
                CatalogLoader.addCatalogEntry(vm.metadata, onDoneAddCatalogEntry);

            };

            function setDeselectMode() {
                if (vm.selectedForm == 1 || vm.selectedForm == 2) {

                    if (vm.progbarBundle.progPercent == 0) {
                        vm.nextButtonDeselectState = true;
                    } else {
                        vm.nextButtonDeselectState = false;
                    }
                } else if (vm.selectedForm == 3) {
                    if (vm.permissionCheck == false || vm.permissionCheck==undefined) {
                        vm.nextButtonDeselectState = true;
                    } else {
                        vm.nextButtonDeselectState = false;
                    }
                } else {
                    vm.nextButtonDeselectState = false;
                }
            }
            vm.setDeselectMode = setDeselectMode;

            vm.frequencyUpdate = function(sign) {
                if (sign == 'plus') {
                    if (vm.metadata.frequency == undefined)
                        vm.metadata.frequency = 1;
                    else
                        vm.metadata.frequency = vm.metadata.frequency + 1;
                } else {
                    if (vm.metadata.frequency != undefined && vm.metadata.frequency != 0)
                        vm.metadata.frequency = vm.metadata.frequency - 1;
                }
            }
        }

    }

    DatasetCreateConfirmController.$inject = ['$state'];
    function DatasetCreateConfirmController($state) {
        // for controllerAs syntax
        var vm = this;

        activate();

        ////////////////

        function activate() {
            vm.goToSellOnMarket = function() {
                $state.go('app.sell');
            }
            vm.goMySell = function() {
                $state.go('app.sellDashboard');
            }
        }
    }

    DatasetStreamCreateConfirmController.$inject = ['$state', 'StreamLoader', 'CatalogLoader'];
    function DatasetStreamCreateConfirmController($state, StreamLoader, CatalogLoader) {
        var vm = this;
        vm.metadata = {};
        activate();

        ////////////////

        function activate() {
            vm.metadata.endPoint = StreamLoader.pushEndPoint;
            vm.metadata.topic = StreamLoader.pushTopic;
            vm.createdDataModel = CatalogLoader.createdDataModel;
            vm.goToSellOnMarket = function() {
                $state.go('app.sell')
            };
            vm.goToDataMarket = function() {
                $state.go('app.browse')
            };

            vm.goMySell = function() {
                $state.go('app.sellDashboard');
            }
        }
    }

    PurchaseDashboardController.$inject = ['$state', '$scope', 'ngDialog', '$interval', 'CategoryLoader', 'EventLoader', 'ConsumerLoader', 'DataLoader'];
    function PurchaseDashboardController($state, $scope, ngDialog, $interval, CategoryLoader, EventLoader, ConsumerLoader, DataLoader) {
        // for controllerAs syntax
        var vm = this;

        activate();

        ////////////////

        function activate() {
            vm.category = "Category";
            vm.sort = "Sort by";
            CategoryLoader.listCategoryEntries(onReadyListCategoryEntries);
            function onReadyListCategoryEntries(result) {
                vm.categories = result;
            }

            EventLoader.listPurchased('UploadedNotDownloaded', onReadyPurchasedUploadedNotDownloaded);

            function onReadyPurchasedUploadedNotDownloaded(result) {
                vm.purchasedUploadedNotDownloaded = result;

                EventLoader.getDetails(vm.purchasedUploadedNotDownloaded, onReadyDetails);
                function onReadyDetails(response){
                    for (var i=0; i<vm.purchasedUploadedNotDownloaded.length; i++) {
                        vm.purchasedUploadedNotDownloaded[i].detail = response[i];
                    }
                    $scope.$apply(vm.purchasedUploadedNotDownloaded);

                }
            }


            EventLoader.listPurchased('ByConsumer', onReadyPurchasedByConsumer);
            function onReadyPurchasedByConsumer(result) {
                vm.purchasedByConsumer = result;
                EventLoader.getDetails(vm.purchasedByConsumer, onReadyDetails);
                function onReadyDetails(response){
                    for (var i=0; i<vm.purchasedByConsumer.length; i++) {
                        vm.purchasedByConsumer[i].detail = response[i];
                    }
                    $scope.$apply(vm.purchasedByConsumer);
                }
            }

            vm.downloadData = function(dataset) {

            };

            vm.downloadDataset = function(dataset) {
                var contractId = dataset.id;
                var hash = dataset.extras.fileHash.value;
                DataLoader.downloadFile(contractId, hash, doneDownloadFile)

                function doneDownloadFile() {

                    ngDialog.open({
                        template: 'downloadDataSuccessfulDialog',
                        controller: ['$scope', '$state', function ($scope, $state) {
                            setTimeout(function(){
                                ngDialog.close()
                                $state.go('app.purchaseDashboard', {}, {reload: true})
                            }, 4000);

                        }],
                        className: 'ngdialog-theme-default ngdialog-theme-file-successful'
                    });
                }
            };
            vm.viewStream = function (dataset) {
                var collectingTimer;
                ngDialog.open({
                    template: 'streamDialog',
                    controller: ['$scope', '$state', 'ConsumerLoader', '$interval', 'DataLoader', function ($scope, $state, ConsumerLoader, $interval, DataLoader) {
                        $scope.data = dataset;
                        $scope.streamData = [];

                        ConsumerLoader.createConsumer(dataset.id, doneCreateConsumer);
                        calculateEndTime();
                        function doneCreateConsumer(result) {
                            var topic;
                            if (dataset.detail.extras.streamTopic == "") {
                                var id = dataset.detail.id.replace(/-/g, "");

                                topic = id;
                            } else {
                                topic = dataset.detail.extras.streamTopic;
                            }
                            ConsumerLoader.subscribeTopic(dataset.id, topic, doneSubscribeTopic);
                        }

                        function doneSubscribeTopic (result) {
                            ConsumerLoader.collectingData(dataset.id, doneCollectingData);

                            collectingTimer = $interval(function() {
                                ConsumerLoader.collectingData(dataset.id, doneCollectingData);
                            }, 3000);
                        }

                        function doneCollectingData(result) {
                            //commented out for javascript version

                            let prettyResult = result.map(jsonData => {
                                jsonData.value = JSON.stringify(jsonData.value, null, 2);
                                return jsonData;
                            });
                            $scope.streamData = $scope.streamData.concat(prettyResult);
                        }

                        function calculateEndTime() {
                            var endDate = new Date(dataset.detail.extras.endTime);
                            var today = new Date();
                            var diffDays = endDate.getDate() - today.getDate();
                            $scope.timeLeft = diffDays;
                        }
                        $scope.getCategory = function(category) {
                            return DataLoader.categoryDictionary[category];
                        };

                        $scope.getCompanyName = function(id) {
                            return DataLoader.getBusinessNameById(id);
                        }

                    }],
                    preCloseCallback: function() {
                        $interval.cancel(collectingTimer);
                        collectingTimer = undefined;
                        // clearInterval(collectingTimer);
                        return true
                    },
                    className: 'ngdialog-theme-default ngdialog-theme-stream-data'
                });
            };

            vm.openSellDataPage = function() {
                $state.go('app.sell');
            };

            vm.openDetailPage = function(product) {
                DataLoader.selectedBrowsePage = 3;
                DataLoader.selectedDataset = product.detail;
                $state.go('app.browse');
            };
            vm.openUploadPopup = function(data) {
                console.log("data", data);
            };

            vm.getCategory = function(category) {
                return DataLoader.categoryDictionary[category];
            };
        }
    }

    MyAccountController.$inject = ['$state', '$scope', 'DataLoader'];
    function MyAccountController($state, $scope, DataLoader) {
        var vm = this;

        activate();

        ////////////////

        function activate() {
            setCurrentAccountTab();

            function setCurrentAccountTab() {
                vm.radioModel = DataLoader.currentAccountPage;
                $scope.tab= DataLoader.currentAccountPage;
            }

            $scope.setTab = function(newTab){
                $scope.tab = newTab;
                DataLoader.currentAccountPage = newTab;
            };

            $scope.isSet = function(tabNum){
                return $scope.tab === tabNum;
            };
        }
    }

    MyAccountPurchaseController.$inject = ['$state', '$scope', 'DataLoader', 'EventLoader', 'ngDialog', '$interval'];
    function MyAccountPurchaseController($state, $scope, DataLoader, EventLoader, ngDialog, $interval) {
        var vm = this;

        activate();

        ////////////////

        function activate() {
            getPurchasedDataSets();
            function getPurchasedDataSets() {
                EventLoader.listPurchased('Downloaded', onReadyPurchasedDownloaded);
                EventLoader.listPurchased('NotUploaded', onReadyPurchasedNotUploaded);
                EventLoader.listPurchased('UploadedNotDownloaded', onReadyPurchasedUploadedNotDownloaded);

                function onReadyPurchasedDownloaded(result) {
                    vm.purchasedDownloaded = result;
                    EventLoader.getDetails(vm.purchasedDownloaded, onReadyDetails);
                    function onReadyDetails(response){
                        for (var i=0; i<vm.purchasedDownloaded.length; i++) {
                            vm.purchasedDownloaded[i].detail = response[i];
                        }
                        $scope.$apply(vm.purchasedDownloaded);
                    }

                }
                function onReadyPurchasedNotUploaded(result) {
                    vm.purchasedNotUploaded = result;
                    EventLoader.getDetails(vm.purchasedNotUploaded, onReadyDetails);
                    function onReadyDetails(response){
                        for (var i=0; i<vm.purchasedNotUploaded.length; i++) {
                            vm.purchasedNotUploaded[i].detail = response[i];
                        }
                        $scope.$apply(vm.purchasedNotUploaded);
                    }
                }
                function onReadyPurchasedUploadedNotDownloaded(result) {
                    vm.purchasedUploadedNotDownloaded = result;
                    EventLoader.getDetails(vm.purchasedUploadedNotDownloaded, onReadyDetails);
                    function onReadyDetails(response){
                        for (var i=0; i<vm.purchasedUploadedNotDownloaded.length; i++) {
                            vm.purchasedUploadedNotDownloaded[i].detail = response[i];
                        }
                        $scope.$apply(vm.purchasedUploadedNotDownloaded );
                    }
                }
                function onReadyPurchasedByConsumer(result) {
                    vm.purchasedByConsumer = result;
                    EventLoader.getDetails(vm.purchasedByConsumer, onReadyDetails);
                    function onReadyDetails(response){
                        for (var i=0; i<vm.purchasedByConsumer.length; i++) {
                            vm.purchasedByConsumer[i].detail = response[i];
                        }
                        $scope.$apply(vm.purchasedByConsumer);
                    }
                }
            }
            vm.downloadDataset = function(contractId, hash) {
                DataLoader.downloadFile(contractId, hash)
            };

            vm.viewStream = function (dataset) {
                var collectingTimer;
                ngDialog.open({
                    template: 'streamDialog',
                    controller: ['$scope', '$state', 'ConsumerLoader', '$interval', function ($scope, $state, ConsumerLoader, $interval) {
                        $scope.data = dataset;
                        $scope.streamData = [];

                        ConsumerLoader.createConsumer(dataset.id, doneCreateConsumer)


                        function doneCreateConsumer(result) {
                            ConsumerLoader.subscribeTopic(dataset.id, dataset.dataContractType, doneSubscribeTopic);
                        }

                        function doneSubscribeTopic (result) {
                            ConsumerLoader.collectingData(dataset.id, doneCollectingData);

                            collectingTimer = $interval(function() {
                                ConsumerLoader.collectingData(dataset.id, doneCollectingData);
                            }, 3000);
                        }

                        function doneCollectingData(result) {
                            $scope.streamData = $scope.streamData.concat(result);
                        }

                    }],
                    preCloseCallback: function() {
                        $interval.cancel(collectingTimer);
                        collectingTimer = undefined;
                        // clearInterval(collectingTimer);
                        return true
                    },
                    className: 'ngdialog-theme-default ngdialog-theme-review'
                });
            };
            vm.writeReview = function(dataset) {
                ngDialog.open({
                    template: 'writeReviewDialog',
                    controller: ['$scope', '$state', 'ReviewLoader', function ($scope, $state, ReviewLoader) {
                        $scope.data = dataset;
                        $scope.data.providerShort = $scope.data.provider.split("#")[1];
                        $scope.data.review = {};
                        $scope.todayDate = new Date();
                        $scope.postReview = function() {
                            ngDialog.close();
                            ReviewLoader.addReviewEntry($scope.data, onDoneAddReviewEntry);
                        };
                        function onDoneAddReviewEntry(result) {
                            ngDialog.open({
                                template: 'writeReviewSuccessfulDialog',
                                controller: ['$scope', '$state', function ($scope, $state) {
                                    setTimeout(function(){
                                        ngDialog.close()
                                        // $state.go('app.sellDashboard', {}, {reload: true})
                                    }, 3000);

                                }],
                                className: 'ngdialog-theme-default ngdialog-theme-write-review-successful'
                            });
                        }
                    }],
                    className: 'ngdialog-theme-default ngdialog-theme-write-review'
                });

            }
        }
    }

    MyAccountManageDatasetController.$inject = ['$state', '$scope', 'DataLoader'];
    function MyAccountManageDatasetController($state, $scope, DataLoader) {
        // for controllerAs syntax
        var vm = this;

        activate();

        ////////////////

        function activate() {

        }
    }

    MyAccountUploadsController.$inject = ['$state', '$scope', 'DataLoader', 'EventLoader', 'rx'];
    function MyAccountUploadsController($state, $scope, DataLoader, EventLoader, rx) {
        var vm = this;

        activate();

        ////////////////

        function activate() {
            getSoldDataSets();
            function getSoldDataSets() {
                EventLoader.listSold('ToUpload', onReadySoldToUpload);
                EventLoader.listSold('SoldAndDownloaded', onReadySoldAndDownloaded);

                function onReadySoldToUpload(result) {
                    vm.soldToUpload = result;
                    EventLoader.getDetails(vm.soldToUpload, onReadyDetails);
                    function onReadyDetails(response){
                        for (var i=0; i<vm.soldToUpload.length; i++) {
                            vm.soldToUpload[i].detail = response[i];
                        }
                        $scope.$apply(vm.soldToUpload);
                        console.log("soldtoupload", vm.soldToUpload);
                    }
                }
                function onReadySoldAndDownloaded(result) {
                    vm.soldAndDownloaded = result;
                    EventLoader.listSold('ShippedNotDownloaded', onReadySoldShippedNotDownloaded);

                }
                function onReadySoldShippedNotDownloaded(result) {
                    vm.soldUploaded = vm.soldAndDownloaded.concat(result);
                    EventLoader.getDetails(vm.soldUploaded, onReadyDetails);
                    function onReadyDetails(response){
                        for (var i=0; i<vm.soldUploaded.length; i++) {
                            vm.soldUploaded[i].detail = response[i];
                        }
                        $scope.$apply(vm.soldUploaded);
                    }
                }


            }

            var formdata = new FormData();
            vm.getTheFiles = function ($files) {
                angular.forEach($files, function (value, key) {
                    formdata.append("file", value);
                });
            };

            vm.uploadFile = function (contractId) {
                DataLoader.uploadFile(contractId, formdata, doneUploadFile)

            };
            function doneUploadFile(result) {
                vm.hash = result.hash;
            }

            vm.trustSrc = function(src) {
                return $sce.trustAsResourceUrl(src);
            };
        }
    }

    DataController.$inject = ['$sce', 'DataLoader'];
    function DataController($sce, DataLoader) {
        // for controllerAs syntax
        var vm = this;

        activate();

        ////////////////

        function activate() {
        }
    }

    function imageloaded () {
        // Copyright(c) 2013 André König <akoenig@posteo.de>
        // MIT Licensed
        var directive = {
            link: link,
            restrict: 'A'
        };
        return directive;

        function link(scope, element, attrs) {
            var cssClass = attrs.loadedclass;

            element.bind('load', function () {
                angular.element(element).addClass(cssClass);
            });
        }
    }

})();
