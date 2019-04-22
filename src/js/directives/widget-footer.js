/*
 Copyright (c) 2019 LG Electronics Inc.
 SPDX-License-Identifier: Apache-2.0
*/

/**
 * Widget Footer Directive
 */

angular
    .module('datagraviti')
    .directive('rdWidgetFooter', rdWidgetFooter);

function rdWidgetFooter() {
    var directive = {
        requires: '^rdWidget',
        transclude: true,
        template: '<div class="widget-footer" ng-transclude></div>',
        restrict: 'E'
    };
    return directive;
};