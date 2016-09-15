/*global bard $httpBackend assert $rootScope $compile */
describe('Crowbar Checklist Directive', function () {

    var directiveElement,
        scope;

    beforeEach(function () {
        bard.appModule('crowbarApp');

        bard.inject('$rootScope', '$compile', '$httpBackend');

        //Mock requests that are expected to be made
        $httpBackend.expectGET('app/features/upgrade/i18n/en.json').respond({});
        $httpBackend.flush();

        scope = $rootScope.$new();

        directiveElement = compileDirective(
            '<crowbar-checklist checklist="testChecks" completed="testCompleted"></crowbar-checklist>'
        );
    });

    function compileDirective(template) {
        var element = angular.element(template),
            compiledElement = $compile(element)(scope);
        scope.$digest();

        return compiledElement;
    }

    // Verify no unexpected http call has been made
    bard.verifyNoOutstandingHttpRequests();

    describe('with empty checks list', function () {
        beforeEach(function () {
            scope.testChecks = {};
            scope.$digest();
        });

        it('should contain empty UL', function () {
            var uls = directiveElement.find('ul');
            expect(uls.length).toEqual(1);
            expect(angular.element(uls[0]).children().length).toEqual(0);
        });
    });

    describe('with non-empty checks list', function () {
        beforeEach(function () {
            scope.testChecks = {
                check1: { status: false, label: 'label1' },
                check2: { status: true, label: 'label2' },
                check3: { status: false, label: 'label3' }
            };
            scope.$digest();
        });

        it('should contain a list with one item for each check', function () {
            var uls = directiveElement.find('ul');
            expect(uls.length).toEqual(1);
            expect(angular.element(uls[0]).children().length).toEqual(_.size(scope.testChecks));
        });

        it('should have all items with labels maching the model', function () {
            var lis = directiveElement.find('li');
            _.each(lis, function (li) {
                var itemElement = angular.element(li),
                    checkKey = itemElement.attr('check-key'),
                    labels = itemElement.find('span');

                expect(labels.length).toEqual(1);
                var labelElement = angular.element(labels[0]),
                    expectedLabel = scope.testChecks[checkKey].label;

                expect(labelElement.attr('translate')).toEqual(expectedLabel);
                // NOTE: translation is mocked so translatedText=translationKey
                expect(labelElement.text()).toEqual(expectedLabel);
            });
        });

        describe('marked as not completed', function () {
            beforeEach(function () {
                scope.testCompleted = false;
                scope.$digest();
            });

            it('should have all items with class text-info and ban-circle icon', function () {
                var lis = directiveElement.find('li');
                _.each(lis, function (li) {
                    var itemElement = angular.element(li)
                    assert.isTrue(itemElement.hasClass('text-info'));

                    var icons = itemElement.find('i');
                    expect(icons.length).toEqual(1);
                    assert.isTrue(angular.element(icons[0]).hasClass('glyphicon-ban-circle'));
                });
            });
        });

        describe('marked as completed', function () {
            beforeEach(function () {
                scope.testCompleted = true;
                scope.$digest();
            });

            it('should have items with class text-danger and remove-circle icon where status=false', function () {
                // list of keys from scope.testChecks where status=false
                var testKeys = ['check1', 'check3'];

                var lis = directiveElement.find('li');
                _.each(lis, function (li) {
                    var itemElement = angular.element(li),
                        checkKey = itemElement.attr('check-key'),
                        icons = itemElement.find('i');
                    expect(icons.length).toEqual(1);

                    if (_.includes(testKeys, checkKey)) {
                        assert.isTrue(itemElement.hasClass('text-danger'));
                        assert.isTrue(angular.element(icons[0]).hasClass('glyphicon-remove-circle'));
                    }
                });
            });

            it('should have items with class text-success and ok-circle icon where status=true', function () {
                // list of keys from scope.testChecks where status=true
                var testKeys = ['check2'];

                var lis = directiveElement.find('li');
                _.each(lis, function (li) {
                    var itemElement = angular.element(li),
                        checkKey = itemElement.attr('check-key'),
                        icons = itemElement.find('i');
                    expect(icons.length).toEqual(1);

                    if (_.includes(testKeys, checkKey)) {
                        assert.isTrue(itemElement.hasClass('text-success'));
                        assert.isTrue(angular.element(icons[0]).hasClass('glyphicon-ok-circle'));
                    }
                });
            });
        });

    });

});
