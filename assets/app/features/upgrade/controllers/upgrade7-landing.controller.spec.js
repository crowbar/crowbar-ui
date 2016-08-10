/* jshint -W117, -W030 */
describe('Upgrade Landing Controller', function() {
  var controller;

  beforeEach(function() {
    //Setup the module and dependencies to be used.
    bard.appModule('crowbarApp');
    bard.inject('$controller', '$rootScope', '$state', 'prechecksFactory', '$q', '$httpBackend');

    //Create the controller
    controller = $controller('Upgrade7LandingCtrl');

    //Mock requests that are expected to be made
    $httpBackend.expectGET('app/features/upgrade/i18n/en.json').respond({});
    $httpBackend.expectGET('/api/upgrade7/prechecks?fail=true').respond({});

  });

  // Verify no unexpected http call has been made
  bard.verifyNoOutstandingHttpRequests();

  afterEach(function() {
    // flush pending promises
    $httpBackend.flush();
  });


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

      });
      
      it('changes completed status after run', function() {
        var prechecks = {
          'errors': ['001', '002', '003']
        };
        sinon.stub(prechecksFactory, 'getAll').returns($q.when(prechecks));
        controller.prechecks.runPrechecks();
        $rootScope.$apply();

        assert.isTrue(controller.prechecks.completed);
      });
    });

  });
});
