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
        .module('app.admin')
        .service('AdminSidebarLoader', AdminSidebarLoader)
        .service('AdminLoader', AdminLoader)

    AdminSidebarLoader.$inject = ['$http', '$localStorage'];
    function AdminSidebarLoader($http, $localStorage) {
        this.getMenu = getMenu;

        ////////////////

        function getMenu(onReady, onError) {
            var menuJson = 'server/admin-sidebar-menu.json',
                menuURL  = menuJson + '?v=' + (new Date().getTime()); // jumps cache

            var request = {
                method: 'GET',
                url: menuURL,
                headers: {
                    "Authorization": 'user ' + $localStorage.token
                }
            };

            onError = onError || function() { alert('Failure loading menu'); };

            $http(request)
                .success(onReady)
                .error(onError);
        }
    }

    AdminLoader.$inject = ['$http', 'Config', '$state', '$localStorage'];
    function AdminLoader($http, Config, $state, $localStorage) {
        this.listCategoryEntries = listCategoryEntries;
        this.addCategoryEntry = addCategoryEntry;
        this.removeCategoryEntry = removeCategoryEntry;

        function listCategoryEntries(onReady, onError) {
            var menuURL = Config.categorySvcUrl+'/listCategoryEntries';

            var request = {
                method: 'GET',
                url: menuURL,
                headers: {
                    "Authorization": 'user ' + $localStorage.token
                }
            };

            onError = onError || function(error) {
                };

            $http(request)
                .success(function(result){onReady(result.response)})
                .error(onError);
        }

        function addCategoryEntry(metadata, onReady, onError) {
            var menuURL = Config.categorySvcUrl+'/addCategoryEntry';

            var data = {
                "id": uuidv4(),
                "name": metadata.name,
                "definition_format": metadata.definition_format,
                "docType": "com.lge.svl.datamarketplace.contract.DataCategory",
                "children": []
            };

            var request = {
                method: 'POST',
                url: menuURL,
                data: data,
                headers: {
                    "Authorization": 'user ' + $localStorage.token
                }
            };

            onError = onError || function(error) {
                };

            $http(request)
                .success(onReady)
                .error(onError);
        }

        function removeCategoryEntry(id, onReady, onError) {
            var menuURL = Config.categorySvcUrl+'/removeCategoryEntry?id=' + id;

            var request = {
                method: 'POST',
                url: menuURL,
                headers: {
                    "Authorization": 'user ' + $localStorage.token
                }
            };

            onError = onError || function(error) {
                };

            $http(request)
                .success(onReady)
                .error(onError);
        }

        function uuidv4() {
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
                return v.toString(16);
            });
        }
    }

})();