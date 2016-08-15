/* jshint -W117, -W030 */
/*global bard $controller $httpBackend should assert sinon prechecksFactory $q $rootScope */
describe('Upgrade Flow - Landing Controller', function() {
  var controller;

  beforeEach(function() {
    //Setup the module and dependencies to be used.
    bard.appModule('crowbarApp');
    bard.inject('$controller', '$rootScope', '$state', 'prechecksFactory', '$q', '$httpBackend');

    //Create the controller
    controller = $controller('Upgrade7LandingController');

    //Mock requests that are expected to be made
    $httpBackend.expectGET('app/features/upgrade/i18n/en.json').respond({});
    $httpBackend.flush();

  });

  // Verify no unexpected http call has been made
  bard.verifyNoOutstandingHttpRequests();

  it('should exist', function() {
    should.exist(controller);
  });

  describe('Begin Upgrade', function() {
    it('should have a beginUpgrade function defined', function() {
      should.exist(controller.beginUpgrade);
    });

    //@TODO
    it('should redirect the user to /backup when clicked', function() {
    });


    //@TODO
    it('should avoid any redirection if prechecks are not successfully validated', function() {
      
    });
  });

  describe('Prechecks object', function() {

    it('should exist', function() {
      should.exist(controller.prechecks);
    });

    it('is not completed by default', function() {
      assert.isFalse(controller.prechecks.completed);
    });

    describe('runPrechecks function', function() {

      it('is defined', function() {
        should.exist(controller.prechecks.runPrechecks);
      });

      //@TODO
      it('gets all prechecks from prechecksFactory', function() {
        sinon.stub(prechecksFactory, 'getAll').returns($q.when({}));
        //$httpBackend.expectGET('/api/upgrade7/prechecks').respond({});
        controller.prechecks.runPrechecks();
        $rootScope.$apply();

        assert.isTrue(controller.prechecks.completed);

      });
      
      it('changes completed status after run', function() {
        var prechecks = {
          'errors': ['001', '002', '003']
        };
        $httpBackend.when('GET', '/api/upgrade7/prechecks').respond(500, prechecks);
        controller.prechecks.runPrechecks();
        $httpBackend.flush();

        assert.isTrue(controller.prechecks.completed);
        expect(controller.prechecks.errors).toEqual(prechecks.errors);
      });
    });

  });
});
