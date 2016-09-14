/*global bard $httpBackend assert $rootScope $compile $timeout */
describe('SUSE Lazy Spinner Directive', function () {

    var directiveElement,
        scope;

    beforeEach(function () {
        bard.appModule('crowbarApp');

        bard.inject('$rootScope', '$compile', '$httpBackend', '$timeout');

        //Mock requests that are expected to be made
        $httpBackend.expectGET('app/features/upgrade/i18n/en.json').respond({});
        $httpBackend.flush();

        scope = $rootScope.$new();
    });

    function compileDirective(template) {
        var element = angular.element(template),
            compiledElement = $compile(element)(scope);
        scope.$digest();

        return compiledElement;
    }

    // Verify no unexpected http call has been made
    bard.verifyNoOutstandingHttpRequests();

    describe('directive created with default parameters', function () {
        beforeEach(function () {
            directiveElement = compileDirective('<suse-lazy-spinner active="testActive"></suse-lazy-spinner>');
        });

        it('should contain an icon with fa-spin class', function () {
            var icons = directiveElement.find('i');
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
                assert.isFalse(directiveElement.isolateScope().active);
            });

            it('should be hidden', function () {
                assert.isTrue(directiveElement.hasClass('hidden'));
            });
        });

        describe('attached to active model', function () {
            beforeEach(function () {
                scope.testActive = true;
                scope.$digest();
            });

            it('should be active', function () {
                assert.isTrue(directiveElement.isolateScope().active);
            });

            it('should be hidden before the timeout', function () {
                assert.isTrue(directiveElement.hasClass('hidden'));
            });

            it('should not be hidden after the timeout', function () {
                $timeout.flush();
                assert.isFalse(directiveElement.hasClass('hidden'));
            });
        });
    });

    describe('directive with custom delay', function () {
        beforeEach(function () {
            scope.testActive = true;
            directiveElement = compileDirective(
                '<suse-lazy-spinner active="testActive" delay="100"></suse-lazy-spinner>'
            );
        });

        it('should have the delay value in the internal scope', function () {
            // NOTE: the value is parsed internally in the directive which is not visible from the outside
            expect(directiveElement.isolateScope().delay).toEqual('100');
        });
    });

    describe('directive with exposed visiblity', function () {
        beforeEach(function () {
            directiveElement = compileDirective(
                '<suse-lazy-spinner active="testActive" visible="spinnerVisible"></suse-lazy-spinner>'
            );
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
