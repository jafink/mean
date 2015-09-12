'use strict';

// Setting up route
angular.module('groups').config(['$stateProvider',
  function ($stateProvider) {
    // Groups state routing
    $stateProvider
      .state('groups', {
        abstract: true,
        url: '/groups',
        template: '<ui-view/>',
        data: {
          roles: ['user', 'admin']
        }
      })
      .state('groups.list', {
        url: '',
        templateUrl: 'modules/groups/views/list-groups.client.view.html'
      })
      .state('groups.create', {
        url: '/create',
        templateUrl: 'modules/groups/views/create-group.client.view.html'
      })
      .state('groups.view', {
        url: '/:groupId',
        templateUrl: 'modules/groups/views/view-group.client.view.html'
      })
      .state('groups.edit', {
        url: '/:groupId/edit',
        templateUrl: 'modules/groups/views/edit-group.client.view.html'
      });
  }
]);
