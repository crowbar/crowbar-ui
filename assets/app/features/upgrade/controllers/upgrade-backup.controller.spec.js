/* jshint -W117, -W030 */
/*global bard $controller $httpBackend should assert crowbarBackupFactory $q $rootScope $document */
describe('Upgrade Flow - Backup Controller', function() {
    var controller,
        scope,
        mockedErrorList = [ 1, 2, 3],
        mockedErrorResponse = {
            data: { errors: mockedErrorList }
        },
        mockedCreateResponse = {
            data: { id: 42 }
        },
        mockedDownloadFile = '--Mock Backup File--',
        mockedDownloadResponseHeaders = {
            'connection': 'keep-alive',
            'content-disposition': 'attachment; filename=S33z8qFX.jpg.zip',
            'content-type': 'application/zip',
            'date': 'Thu, 25 Aug 2016 11:07:32 GMT',
            'transfer-encoding': 'chunked',
            'x-powered-by': 'Express',
        },
        mockedDownloadResponse = {
            data: mockedDownloadFile,
            'headers': function() {}
        },
        upgradeVm = {
            steps: {
                activeStep: {
                    finished: false
                }
            }
        };

    beforeEach(function() {
        //Setup the module and dependencies to be used.
        bard.appModule('crowbarApp');
        bard.inject('$controller', '$rootScope', '$q', '$httpBackend', '$document', 'crowbarBackupFactory');

        scope = $rootScope.$new();
        scope.upgradeVm = upgradeVm;

        //Create the controller
        controller = $controller('UpgradeBackupController', {$scope: scope});

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
                expect(controller.backup.create).toEqual(jasmine.any(Function));
            });

            describe('when executed and finished with success', function () {
                beforeEach(function () {
                    spyOn(controller.backup, 'download');

                    bard.mockService(crowbarBackupFactory, {
                        create: $q.when(mockedCreateResponse)
                    });
                    controller.backup.create();
                    $rootScope.$digest();
                });

                it('should call download function', function () {
                    expect(controller.backup.download).toHaveBeenCalled();
                });

                it('should set running to true', function () {
                    assert.isTrue(controller.backup.running);
                });
            });

            describe('when executed and finished with failure', function () {
                beforeEach(function () {
                    spyOn(controller.backup, 'download');

                    bard.mockService(crowbarBackupFactory, {
                        create: $q.reject(mockedErrorResponse)
                    });
                    controller.backup.create();
                    $rootScope.$digest();
                });

                it('should not call download function', function () {
                    expect(controller.backup.download).not.toHaveBeenCalled();
                });

                it('should leave running at false', function () {
                    assert.isFalse(controller.backup.running);
                });

                it('should expose the errors through adminUpgrade.errors object', function () {
                    expect(controller.backup.errors).toEqual(mockedErrorList);
                });
            });
        });

        describe('download function', function() {

            it('is defined', function() {
                should.exist(controller.backup.download);
                expect(controller.backup.download).toEqual(jasmine.any(Function));
            });

            describe('when executed', function () {
                describe('on success with wrong file headers', function () {
                    var downloadBackupMock;

                    beforeEach(function () {

                        // Mock the click() method of a fake downloadBackup element
                        downloadBackupMock = $document[0].createElement('a')
                        spyOn(downloadBackupMock, 'click');

                        // Mock the createElement() method of $document[0]
                        spyOn($document[0], 'createElement')
                            .and.returnValue(downloadBackupMock);

                        // Mock the headers() method of the fake response
                        spyOn(mockedDownloadResponse, 'headers')
                            .and.returnValue({});

                        // Mock the download() method of the crowbarBackupFactory,
                        // and return a custom promise instead
                        bard.mockService(crowbarBackupFactory, {
                            get: $q.when(mockedDownloadResponse)
                        });

                        // Run the backup get function
                        controller.backup.download(42);
                        $rootScope.$digest();
                    });

                    it('click() method should have been triggered to download the backup', function () {
                        expect($document[0].createElement).toHaveBeenCalledWith('a');
                        expect(downloadBackupMock.click).toHaveBeenCalled();
                        expect(downloadBackupMock.click.calls.count()).toBe(1);
                    });

                    it('crowbarBackupFactory.get() has been called once', function () {
                        assert.isTrue(crowbarBackupFactory.get.calledOnce);
                    });

                    it('changes the completed status', function() {
                        assert.isTrue(controller.backup.completed);
                    });

                    it('no error is created', function() {
                        should.not.exist(controller.backup.error);
                    });

                    it('uses the default name for the file', function () {
                        expect(downloadBackupMock.download).toEqual('crowbarBackup');
                    })
                });
                describe('on success', function () {
                    var downloadBackupMock;

                    beforeEach(function () {

                        // Mock the click() method of a fake downloadBackup element
                        downloadBackupMock = $document[0].createElement('a');
                        spyOn(downloadBackupMock, 'click');

                        // Mock the createElement() method of $document[0]
                        spyOn($document[0], 'createElement')
                            .and.returnValue(downloadBackupMock);

                        // Mock the headers() method of the fake response
                        spyOn(mockedDownloadResponse, 'headers')
                            .and.returnValue(mockedDownloadResponseHeaders);

                        // Mock the download() method of the crowbarBackupFactory,
                        // and return a custom promise instead
                        bard.mockService(crowbarBackupFactory, {
                            get: $q.when(mockedDownloadResponse)
                        });

                        // Run the backup get function
                        controller.backup.download(42);
                        $rootScope.$digest();
                    });

                    it('click() method should have been triggered to download the backup', function () {
                        expect($document[0].createElement).toHaveBeenCalledWith('a');
                        expect(downloadBackupMock.click).toHaveBeenCalled();
                    });

                    it('crowbarBackupFactory.get() has been called once', function () {
                        assert.isTrue(crowbarBackupFactory.get.calledOnce);
                    });

                    it('changes the completed status', function() {
                        assert.isTrue(controller.backup.completed);
                    });

                    it('no error is created', function() {
                        should.not.exist(controller.backup.error);
                    });

                    it('does not use the default name for the file', function () {
                        expect(downloadBackupMock.download).not.toEqual('crowbarBackup');
                    })
                });

                describe('on failure', function () {
                    beforeEach(function () {

                        bard.mockService(crowbarBackupFactory, {
                            get: $q.reject(mockedErrorResponse)
                        });

                        controller.backup.download(42);
                        $rootScope.$digest();
                    });

                    it('crowbarBackupFactory.get() has been called once', function () {
                        assert.isTrue(crowbarBackupFactory.get.calledOnce);
                    });

                    it('changes the completed status', function() {
                        assert.isTrue(controller.backup.completed);
                    });

                    it('should expose the errors through adminUpgrade.errors object', function () {
                        expect(controller.backup.errors).toEqual(mockedErrorList);
                    });
                });

            });

        });

    });
});
