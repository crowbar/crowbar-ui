/*global bard $httpBackend assert $rootScope $compile */
describe('Corwbar Circle Directive', function () {

    var directiveElement,
        scope,
        elementText = '1';

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
            directiveElement = compileDirective(
                '<crowbar-circle active="testActive">' + elementText +'</crowbar-circle>'
            );
        });

        it('should contain the expected text inside the element', function () {
            expect(directiveElement.text()).toBe(elementText)
        });

        describe('attached to false model', function () {
            beforeEach(function () {
                scope.testActive = false;
                scope.$digest();
            });

            it('scope.active should be false', function () {
                assert.isFalse(directiveElement.isolateScope().active);
            });

            it('should not have an active class', function () {
                assert.isFalse(directiveElement.find('div').hasClass('active'));
            })

        });

        describe('attached to true model', function () {
            beforeEach(function () {
                scope.testActive = true;
                scope.$digest();
            });

            it('scope.active should be true', function () {
                assert.isTrue(directiveElement.isolateScope().active);
            });

            it('should have an active class', function () {
                assert.isTrue(directiveElement.find('div').hasClass('active'));
            })

        });
    });

});
