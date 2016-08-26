/* jshint -W117, -W030 */
/*global bard $controller $httpBackend should assert upgradeBackupFactory $q $rootScope $document */
describe('Upgrade Flow - Backup Controller', function() {
    var controller,
        mockedBackupFile = '--Mock Backup File--',
        mockedBackupResponseHeaders = {
            'connection': 'keep-alive',
            'content-disposition': 'attachment; filename=S33z8qFX.jpg.zip',
            'content-type': 'application/zip',
            'date': 'Thu, 25 Aug 2016 11:07:32 GMT',
            'transfer-encoding': 'chunked',
            'x-powered-by': 'Express',
        },
        mockedBackupResponse = {
            data: mockedBackupFile,
            'headers': function() {}
        };

    beforeEach(function() {
        //Setup the module and dependencies to be used.
        bard.appModule('crowbarApp');
        bard.inject('$controller', '$rootScope', '$q', '$httpBackend', '$document');

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
                    bard.inject('upgradeBackupFactory', '$document');
                });

                describe('on success', function () {
                    var downloadBackupMock;

                    beforeEach(function () {

                        // Mock the click() method of a fake downloadBackup element
                        downloadBackupMock = $document[0].createElement('a')
                        spyOn(downloadBackupMock, 'click');

                        // Mock the createElement() method of $document[0]
                        spyOn($document[0], 'createElement')
                            .and.returnValue(downloadBackupMock);

                        // Mock the headers() method of the fake response
                        spyOn(mockedBackupResponse, 'headers')
                            .and.returnValue(mockedBackupResponseHeaders);

                        // Mock the create create() method of the upgradeBackupFactory,
                        // and return a custom promise instead
                        bard.mockService(upgradeBackupFactory, {
                            create: $q.when(mockedBackupResponse)
                        });

                        // Run the backup creation
                        controller.backup.create();
                        $rootScope.$digest();
                    });

                    it('click() method should have been triggered to download the backup', function () {
                        assert.isTrue(upgradeBackupFactory.create.calledOnce);
                        expect($document[0].createElement).toHaveBeenCalledWith('a');
                        expect(downloadBackupMock.click).toHaveBeenCalled();
                    })

                    it('changes the completed status', function() {
                        assert.isTrue(controller.backup.completed);
                    });

                    it('no error is created', function() {
                        should.not.exist(controller.backup.error);
                    });
                    
                });
                describe('on failure', function () {
                    
                });

            });
            
        });

    });
});
