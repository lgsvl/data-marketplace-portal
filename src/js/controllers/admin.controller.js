
// To run this code, edit file index.html or index.jade and change
// html data-ng-app attribute from angle to myAppName
// ----------------------------------------------------------------------

(function() {
    'use strict';

    angular
        .module('app.admin')
        .controller('AdminSidebarController', AdminSidebarController)
        .controller('AdminController', AdminController)



    AdminSidebarController.$inject = ['$rootScope', '$scope', '$state', 'AdminSidebarLoader'];
    function AdminSidebarController($rootScope, $scope, $state, AdminSidebarLoader) {

        activate();

        ////////////////

        function activate() {
            var collapseList = [];

            $rootScope.$watch('app.layout.asideHover', function(oldVal, newVal){
                if ( newVal === false && oldVal === true) {
                    closeAllBut(-1);
                }
            });


            // Load menu from json file
            // -----------------------------------

            AdminSidebarLoader.getMenu(sidebarReady);

            function sidebarReady(items) {
                $scope.menuItems = items;
            }

            // Controller helpers
            // -----------------------------------

            // Check item and children active state
            function isActive(item) {

                if(!item) return;

                if( !item.sref || item.sref === '#') {
                    var foundActive = false;
                    angular.forEach(item.submenu, function(value) {
                        if(isActive(value)) foundActive = true;
                    });
                    return foundActive;
                }
                else
                    return $state.is(item.sref) || $state.includes(item.sref);
            }

            function closeAllBut(index) {
                index += '';
                for(var i in collapseList) {
                    if(index < 0 || index.indexOf(i) < 0)
                        collapseList[i] = true;
                }
            }

            function isChild($index) {
                /*jshint -W018*/
                return (typeof $index === 'string') && !($index.indexOf('-') < 0);
            }

        } // activate
    }

    AdminController.$inject = ['$state', '$scope', 'AdminLoader', 'ngDialog'];
    function AdminController($state, $scope, AdminLoader, ngDialog) {
        var vm = this;

        activate();

        ////////////////

        function activate() {
            AdminLoader.listCategoryEntries(onReadyListCategoryEntries);

            function onReadyListCategoryEntries(result) {
                console.log("result", result);
                vm.categories = result;
            }

            vm.openCategoryDetail = function(category) {
                ngDialog.open({
                    template: 'categoryDetailDialog',
                    controller: ['$scope', '$timeout', 'AdminLoader', function ($scope, $timeout, AdminLoader) {
                        $scope.category = category;

                        $scope.deleteCategory = function() {
                            AdminLoader.removeCategoryEntry($scope.category.id, doneRemoveCategoryEntry)
                        };

                        function doneRemoveCategoryEntry() {
                            ngDialog.close();
                            SweetAlert.swal({
                                title: 'Done',
                                type: 'success',
                                text: 'Category is deleted successfully',
                                confirmButtonColor: '#DD6B55',
                                confirmButtonText: 'Okay',
                                closeOnConfirm: true
                            },  function(){
                                $state.go('admin.category', {}, {reload: true});
                            });
                        }

                    }],
                    className: 'ngdialog-theme-default custom-width'
                });
            }

            vm.openCreateCategoryDialog = function() {
                ngDialog.open({
                    template: 'categoryCreateDialog',
                    controller: ['$scope', '$state', '$timeout', 'AdminLoader', function ($scope, $state, $timeout, AdminLoader) {
                        $scope.metadata = {};
                        $scope.createCategory = function() {
                            console.log("createcategory");
                            AdminLoader.addCategoryEntry($scope.metadata, onDoneAddCategoryEntry)
                        };

                        function onDoneAddCategoryEntry(result) {
                            ngDialog.close();
                            SweetAlert.swal({
                                title: 'Done',
                                type: 'success',
                                text: 'Category is created successfully',
                                confirmButtonColor: '#DD6B55',
                                confirmButtonText: 'Okay',
                                closeOnConfirm: true
                            },  function(){
                                $state.go('admin.category', {}, {reload: true});
                            });
                        }

                    }],
                    className: 'ngdialog-theme-default custom-width'
                });
            }
        }
    }
})();
