var FIREBASE_URL = 'https://mtg-editor.firebaseio.com/sets';
angular.module('Editor', ['ngRoute', 'angular-toArrayFilter'])
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