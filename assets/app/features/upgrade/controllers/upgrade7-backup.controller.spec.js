/* jshint -W117, -W030 */
/*global bard $controller $httpBackend should assert upgradeBackupFactory $q $rootScope */
describe('Upgrade Flow - Backup Controller', function() {
    var controller,
        mockedBackupFile = '--Mock Backup File--';

    beforeEach(function() {
        //Setup the module and dependencies to be used.
        bard.appModule('crowbarApp');
        bard.inject('$controller', '$rootScope', '$q', '$httpBackend');

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

            describe('when executed', function () {

                beforeEach(function () {
                    bard.inject('upgradeBackupFactory');

                    bard.mockService(upgradeBackupFactory, {
                        create: $q.when(mockedBackupFile)
                    });
                    controller.backup.create();
                    $rootScope.$digest();

                    assert.isTrue(upgradeBackupFactory.create.calledOnce);
                });

                it('creates a backup from upgradeBackupFactory', function() {
                    expect(controller.backup.file).toEqual(mockedBackupFile);
                });

                it('changes the completed status when a backup is created', function() {
                    assert.isTrue(controller.backup.completed);
                });
            });
            
        });

    });

    //@TODO: Implement the following tests
    describe('cancelUpgrade function', function () {
        it('should be defined', function () {});

        it('should be enabled', function () {});

        describe('cancel modal', function () {
            it('should be displayed when cancel button is clicked', function () {});

            it('should trigger the cancellation routine upon user confirmation', function () {});

            it('should be closed and let the user continue with the upgrade flow when canceled', function () {});

        });

    });
});
