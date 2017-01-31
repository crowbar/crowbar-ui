/*global bard $httpBackend $rootScope $compile $uibModal $document $animate module */
describe('SUSE Modal Directive', function () {

    var directiveElement,
        modalElements,
        scope,
        testErrorData = {
            test_error1: {
                data: 'test error data1',
                help: 'test error help1'
            }
        };

    beforeEach(function () {
        bard.appModule('crowbarApp');

        // load animate with mock addons
        module('ngAnimateMock');

        bard.inject('$rootScope', '$compile', '$httpBackend', '$uibModal', '$document', '$animate');

        spyOn($uibModal, 'open').and.callThrough();

        //Mock requests that are expected to be made
        $httpBackend.expectGET('app/features/upgrade/i18n/en.json').respond({});
        $httpBackend.flush();

        scope = $rootScope.$new();
    });

    function findModals() {
        // 'native' implementation of $('div.modal')
        return _.filter($document.find('div'), function (div) {
            return angular.element(div).hasClass('modal');
        });
    }

    function compileDirective(template) {
        var element = angular.element(template),
            compiledElement = $compile(element)(scope);
        scope.$digest();

        // make sure modal instances don't persist across tests
        $document.find('body').empty();

        return compiledElement;
    }

    // Verify no unexpected http call has been made
    bard.verifyNoOutstandingHttpRequests();

    describe('when created with default parameters', function () {
        beforeEach(function () {
            directiveElement = compileDirective('<suse-modal error="testErrors"></suse-modal>');
        });

        it('should have translationPrefix set to default value', function () {
            expect(directiveElement.isolateScope().translationPrefix).toEqual('modal');
        });

        it('should not call modal service', function () {
            expect($uibModal.open).not.toHaveBeenCalled();
        });

        it('should not show the modal', function () {
            expect(findModals().length).toEqual(0);
        });

        it('should not have modalInstance set in internal scope', function () {
            expect(directiveElement.isolateScope().modalInstance).toBeUndefined();
        });
    });

    describe('when some errors are exposed', function () {
        beforeEach(function () {
            directiveElement = compileDirective('<suse-modal error="testErrors"></suse-modal>');

            scope.testErrors = testErrorData;

            scope.$digest();

            directiveElement.isolateScope().$digest();
        });

        it('should call modal service to open the modal', function () {
            expect($uibModal.open).toHaveBeenCalledTimes(1);
        });

        it('should have modalInstance set in internal scope', function () {
            expect(directiveElement.isolateScope().modalInstance).toBeDefined();
        });

        describe('should show the modal which', function () {
            beforeEach(function () {
                modalElements = findModals();
            });

            it('should exist', function () {
                expect(modalElements.length).toEqual(1);
            });

            it('should have errors passed to internal scope', function () {
                expect(directiveElement.isolateScope().error).toEqual(testErrorData);
            });

            /* TODO: how to test the contents generated inside the modal ?
            it('should contain one item for each error', function () {
                // TODO
            }); */
        });

        // There are two close buttons 'X' and 'Close', run the same tests for both
        _.forEach([0, 1], function (buttonIndex) {
            describe('when user closes the modal using button #' + buttonIndex, function () {
                beforeEach(function () {
                    var closeButton = $document.find('button')[buttonIndex];
                    closeButton.click();
                    // flush closing animations to trigger 'closed()' callbacks
                    $animate.closeAndFlush();
                });

                it('should clear the errors', function () {
                    expect(scope.testErrors).toBeUndefined();
                });

                it('should hide the modal', function () {
                    expect(findModals().length).toEqual(0);
                });
            });
        });
    });
});
