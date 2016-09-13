/*global bard $httpBackend assert $rootScope $compile $timeout */
describe('SUSE Lazy Spinner Directive', function () {

    var directiveElem,
        scope;

    beforeEach(function () {
        bard.appModule('crowbarApp');

        bard.inject('$rootScope', '$compile', '$httpBackend', '$timeout');

        //Mock requests that are expected to be made
        $httpBackend.expectGET('app/features/upgrade/i18n/en.json').respond({});
        $httpBackend.flush();

        scope = $rootScope.$new();
    });

    function compileDirective(tpl) {
        var elem = angular.element(tpl);
        var compiledElem = $compile(elem)(scope);
        scope.$digest();

        return compiledElem;
    }

    // Verify no unexpected http call has been made
    bard.verifyNoOutstandingHttpRequests();

    describe('directive created with default parameters', function () {
        beforeEach(function () {
            directiveElem = compileDirective('<suse-lazy-spinner active="testActive">');
        });

        it('should contain an icon with fa-spin class', function () {
            var icons = directiveElem.find('i');
            expect(icons.length).toEqual(1);
            assert.isTrue(angular.element(icons[0]).hasClass('fa-spin'));
        });

        describe('attached to inactive model', function () {
            beforeEach(function () {
                scope.testActive = false;
                scope.$digest();
                // make sure nothing is scheduled
                $timeout.flush();
            });

            it('should be inactive', function () {
                assert.isFalse(directiveElem.isolateScope().active);
            });

            it('should be hidden', function () {
                assert.isTrue(directiveElem.hasClass('hidden'));
            });
        });

        describe('attached to active model', function () {
            beforeEach(function () {
                scope.testActive = true;
                scope.$digest();
            });

            it('should be active', function () {
                assert.isTrue(directiveElem.isolateScope().active);
            });

            it('should be hidden before the timeout', function () {
                assert.isTrue(directiveElem.hasClass('hidden'));
            });

            it('should not be hidden after the timeout', function () {
                $timeout.flush();
                assert.isFalse(directiveElem.hasClass('hidden'));
            });
        });
    });

    describe('directive with custom delay', function () {
        beforeEach(function () {
            scope.testActive = true;
            directiveElem = compileDirective('<suse-lazy-spinner active="testActive" delay="100">');
        });

        it('should have the delay value in the internal scope', function () {
            // NOTE: the value is parsed internally in the directive which is not visible from the outside
            expect(directiveElem.isolateScope().delay).toEqual('100');
        });
    });

    describe('directive with exposed visiblity', function () {
        beforeEach(function () {
            directiveElem = compileDirective('<suse-lazy-spinner active="testActive" visible="spinnerVisible">');
        });

        describe('attached to active model', function () {
            beforeEach(function () {
                scope.testActive = true;
                scope.$digest();
            });

            it('should set visibility to false before timeout', function () {
                assert.isFalse(scope.spinnerVisible);
            });

            it('should set visibility to true after timeout', function () {
                $timeout.flush();
                assert.isTrue(scope.spinnerVisible);
            });
        });

        describe('attached to inactive model', function () {
            beforeEach(function () {
                scope.testActive = false;
                scope.$digest();
                // make sure nothing is scheduled
                $timeout.flush();
            });

            it('should set visibility to false', function () {
                assert.isFalse(scope.spinnerVisible);
            });
        });
    });
});
