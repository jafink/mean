'use strict';

(function () {
  // Groups Controller Spec
  describe('Groups Controller Tests', function () {
    // Initialize global variables
    var GroupsController,
      scope,
      $httpBackend,
      $stateParams,
      $location,
      Authentication,
      Groups,
      mockGroup;

    // The $resource service augments the response object with methods for updating and deleting the resource.
    // If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
    // the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
    // When the toEqualData matcher compares two objects, it takes only object properties into
    // account and ignores methods.
    beforeEach(function () {
      jasmine.addMatchers({
        toEqualData: function (util, customEqualityTesters) {
          return {
            compare: function (actual, expected) {
              return {
                pass: angular.equals(actual, expected)
              };
            }
          };
        }
      });
    });

    // Then we can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_, _Authentication_, _Groups_) {
      // Set a new global scope
      scope = $rootScope.$new();

      // Point global variables to injected services
      $stateParams = _$stateParams_;
      $httpBackend = _$httpBackend_;
      $location = _$location_;
      Authentication = _Authentication_;
      Groups = _Groups_;

      // create mock group
      mockGroup = new Groups({
        _id: '525a8422f6d0f87f0e407a33',
        title: 'An Group about MEAN',
        content: 'MEAN rocks!'
      });

      // Mock logged in user
      Authentication.user = {
        roles: ['user']
      };

      // Initialize the Groups controller.
      GroupsController = $controller('GroupsController', {
        $scope: scope
      });
    }));

    it('$scope.find() should create an array with at least one group object fetched from XHR', inject(function (Groups) {
      // Create a sample groups array that includes the new group
      var sampleGroups = [mockGroup];

      // Set GET response
      $httpBackend.expectGET('api/groups').respond(sampleGroups);

      // Run controller functionality
      scope.find();
      $httpBackend.flush();

      // Test scope value
      expect(scope.groups).toEqualData(sampleGroups);
    }));

    it('$scope.findOne() should create an array with one group object fetched from XHR using a groupId URL parameter', inject(function (Groups) {
      // Set the URL parameter
      $stateParams.groupId = mockGroup._id;

      // Set GET response
      $httpBackend.expectGET(/api\/groups\/([0-9a-fA-F]{24})$/).respond(mockGroup);

      // Run controller functionality
      scope.findOne();
      $httpBackend.flush();

      // Test scope value
      expect(scope.group).toEqualData(mockGroup);
    }));

    describe('$scope.craete()', function () {
      var sampleGroupPostData;

      beforeEach(function () {
        // Create a sample group object
        sampleGroupPostData = new Groups({
          title: 'An Group about MEAN',
          content: 'MEAN rocks!'
        });

        // Fixture mock form input values
        scope.title = 'An Group about MEAN';
        scope.content = 'MEAN rocks!';

        spyOn($location, 'path');
      });

      it('should send a POST request with the form input values and then locate to new object URL', inject(function (Groups) {
        // Set POST response
        $httpBackend.expectPOST('api/groups', sampleGroupPostData).respond(mockGroup);

        // Run controller functionality
        scope.create();
        $httpBackend.flush();

        // Test form inputs are reset
        expect(scope.title).toEqual('');
        expect(scope.content).toEqual('');

        // Test URL redirection after the group was created
        expect($location.path.calls.mostRecent().args[0]).toBe('groups/' + mockGroup._id);
      }));

      it('should set scope.error if save error', function () {
        var errorMessage = 'this is an error message';
        $httpBackend.expectPOST('api/groups', sampleGroupPostData).respond(400, {
          message: errorMessage
        });

        scope.create();
        $httpBackend.flush();

        expect(scope.error).toBe(errorMessage);
      });
    });

    describe('$scope.update()', function () {
      beforeEach(function () {
        // Mock group in scope
        scope.group = mockGroup;
      });

      it('should update a valid group', inject(function (Groups) {
        // Set PUT response
        $httpBackend.expectPUT(/api\/groups\/([0-9a-fA-F]{24})$/).respond();

        // Run controller functionality
        scope.update();
        $httpBackend.flush();

        // Test URL location to new object
        expect($location.path()).toBe('/groups/' + mockGroup._id);
      }));

      it('should set scope.error to error response message', inject(function (Groups) {
        var errorMessage = 'error';
        $httpBackend.expectPUT(/api\/groups\/([0-9a-fA-F]{24})$/).respond(400, {
          message: errorMessage
        });

        scope.update();
        $httpBackend.flush();

        expect(scope.error).toBe(errorMessage);
      }));
    });

    describe('$scope.remove(group)', function () {
      beforeEach(function () {
        // Create new groups array and include the group
        scope.groups = [mockGroup, {}];

        // Set expected DELETE response
        $httpBackend.expectDELETE(/api\/groups\/([0-9a-fA-F]{24})$/).respond(204);

        // Run controller functionality
        scope.remove(mockGroup);
      });

      it('should send a DELETE request with a valid groupId and remove the group from the scope', inject(function (Groups) {
        expect(scope.groups.length).toBe(1);
      }));
    });

    describe('scope.remove()', function () {
      beforeEach(function () {
        spyOn($location, 'path');
        scope.group = mockGroup;

        $httpBackend.expectDELETE(/api\/groups\/([0-9a-fA-F]{24})$/).respond(204);

        scope.remove();
        $httpBackend.flush();
      });

      it('should redirect to groups', function () {
        expect($location.path).toHaveBeenCalledWith('groups');
      });
    });
  });
}());
