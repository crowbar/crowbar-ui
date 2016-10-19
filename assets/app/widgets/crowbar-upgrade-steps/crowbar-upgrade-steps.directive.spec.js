/*global bard assert $rootScope $compile $httpBackend should */
describe('Crowbar Upgrade Steps Directive', function () {

    var directiveElement = 123,
        scope,
        unorderedList,
        listItems,
        lastListItem;

    beforeEach(function () {
        bard.appModule('crowbarApp');

        bard.inject('$rootScope', '$compile', '$httpBackend');

        //Mock requests that are expected to be made
        $httpBackend.expectGET('app/features/upgrade/i18n/en.json').respond({});
        $httpBackend.flush();

        scope = $rootScope.$new();
        scope.stepsList = [{
            active: false,
            enabled: false,
            title: 'step-1'
        }, {
            active: false,
            enabled: false,
            title: 'step-2'
        }];
    });

    function compileDirective(template) {
        var element = angular.element(template),
            compiledElement = $compile(element)(scope);
        scope.$digest();

        return compiledElement;
    }

    describe('directive created with inactive steps', function () {
        beforeEach(function () {
            directiveElement = compileDirective('<crowbar-upgrade-steps steps="stepsList"></crowbar-upgrade-steps>');

            unorderedList = directiveElement.find('ul');
            listItems = unorderedList.find('li'),
            lastListItem = listItems.splice(listItems.length - 1, 1);
        });

        it('should contain a list of steps', function() {

            expect(unorderedList.length).toEqual(1);
            expect(listItems.length).toEqual(2);
            expect(lastListItem.length).toEqual(1);

            _.forEach(listItems, function (listItem) {
                assert.isTrue(angular.element(listItem).hasClass('list-group-item'));
                assert.isFalse(angular.element(listItem).hasClass('bottom-padding'));
            });

            // Validate the last LI element is present
            assert.isTrue(angular.element(lastListItem).hasClass('list-group-item'));
            assert.isTrue(angular.element(lastListItem).hasClass('bottom-padding'));
        });

        it('no step should be active', function() {
            _.forEach(listItems, function (listItem) {
                assert.isFalse(angular.element(listItem).hasClass('active'));
            });
        });

        it('should contain a label', function() {
            _.forEach(listItems, function (listItem) {
                should.exist(angular.element(listItem).find('div').find('span')[0]);
            });
        });
    });

    describe('directive created with the first Step activated', function () {
        beforeEach(function () {
            scope.stepsList[0].active = true
            directiveElement = compileDirective('<crowbar-upgrade-steps steps="stepsList"></crowbar-upgrade-steps>');

            listItems = directiveElement.find('li'),
            lastListItem = listItems.splice(listItems.length - 1, 1);
        });

        it('the first step should be highlighted', function () {
            assert.isTrue(angular.element(listItems[0]).hasClass('active'));
        });

        it('the second step remains not avtivated', function () {
            assert.isFalse(angular.element(listItems[1]).hasClass('active'));
        });
    });
});
