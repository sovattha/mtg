var FIREBASE_URL = 'https://mtge.firebaseio.com';
angular.module('Editor', ['ngRoute', 'angularLocalStorage', 'angular-underscore', 'firebase'])
    .config(function ($routeProvider) {
        'use strict';
        
        $routeProvider
            .when('/', {
                templateUrl: 'js/views/editor-view.html',
                controller: 'EditorCtrl'
            })
            .otherwise({
                redirectTo: '/'
            });
    });