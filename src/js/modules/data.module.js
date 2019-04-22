/*
 Copyright (c) 2019 LG Electronics Inc.
 SPDX-License-Identifier: Apache-2.0
*/

(function() {
    'use strict';

    angular
        .module('app.data', [
            'datagraviti',
            'ngDialog',
            'angularFileUpload',
            'localytics.directives'
            /*...*/
        ])
        .directive('filestyle', filestyle);

    function filestyle () {
        var directive = {
            link: link,
            restrict: 'A'
        };
        return directive;

        function link(scope, element) {
            var options = element.data();

            // old usage support
            options.classInput = element.data('classinput') || options.classInput;

            element.filestyle(options);
        }
    }
})();