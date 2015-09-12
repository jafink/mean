'use strict';

// Configuring the Groups module
angular.module('groups').run(['Menus',
  function (Menus) {
    // Add the articles dropdown item
    Menus.addMenuItem('topbar', {
      title: 'Groups',
      state: 'groups',
      type: 'dropdown'
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'groups', {
      title: 'List Groups',
      state: 'groups.list'
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'groups', {
      title: 'Create Groups',
      state: 'groups.create'
    });
  }
]);
