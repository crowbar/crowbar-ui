/* jshint -W117, -W030 */
/*global bard $controller $httpBackend should assert sinon prechecksFactory $q $rootScope */
describe('Upgrade Backup Controller', function() {
  var controller;

  beforeEach(function() {
    //Setup the module and dependencies to be used.
    bard.appModule('crowbarApp');
    bard.inject('$controller', '$rootScope', '$state', 'backupFactory', '$q', '$httpBackend');

    //Create the controller
    controller = $controller('Upgrade7BackupController');

    //Mock requests that are expected to be made
    $httpBackend.expectGET('app/features/upgrade/i18n/en.json').respond({});
    $httpBackend.flush();

  });

  // Verify no unexpected http call has been made
  bard.verifyNoOutstandingHttpRequests();

  it('should exist', function() {
    should.exist(controller);
  });

  describe('nextStep function', function() {
    it('should be defined', function() {
      should.exist(controller.nextStep);
    });

    //@TODO
    it('should redirect the user to /repository-checks when clicked', function() {
    });


    //@TODO
    it('should avoid any redirection if backup has not been done', function() {
      
    });
  });

  describe('Backup object', function() {

    it('should exist', function() {
      should.exist(controller.backup);
    });

    it('should not completed by default', function() {
      assert.isFalse(controller.backup.completed);
    });

    describe('create function', function() {

      it('is defined', function() {
        should.exist(controller.backup.create);
      });

      //@TODO
      it('creates a backup from backupFactory', function() {
        sinon.stub(backupFactory, 'create').returns($q.when({}));
        //$httpBackend.expectGET('/api/upgrade7/prechecks').respond({});
        controller.backup.create();
        $rootScope.$apply();
      });

      it('changes the completed status when a backup is created', function() {
        sinon.stub(backupFactory, 'create').returns($q.when({}));
        controller.backup.create();
        $rootScope.$apply();

        assert.isTrue(controller.backup.completed);

      });
      
    });

  });
});
