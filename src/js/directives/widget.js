/*
 Copyright (c) 2019 LG Electronics Inc.
 SPDX-License-Identifier: Apache-2.0
*/

/**
 * Widget Directive
 */

angular
    .module('datagraviti')
    .directive('rdWidget', rdWidget);

function rdWidget() {
    var directive = {
        transclude: true,
        template: '<div class="widget" ng-transclude></div>',
        restrict: 'EA'
    };
    return directive;

    function link(scope, element, attrs) {
        /* */
    }
};