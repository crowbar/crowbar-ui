/*global bard $controller $httpBackend should assert upgradeFactory $q $rootScope crowbarFactory */
describe('Upgrade Flow - Nodes Repositories Checks Controller', function () {
    var controller,
        failingRepoChecks = {
            'ceph': {
                'available': false,
                'repos': [
                    'SUSE-Enterprise-Storage-4-Pool',
                    'SUSE-Enterprise-Storage-4-Updates'
                ],
                'errors': {
                    'missing': {
                        'x86_64': [
                            'SUSE-Enterprise-Storage-4-Pool',
                            'SUSE-Enterprise-Storage-4-Updates'
                        ]
                    },
                    'inactive': {
                        'x86_64': [
                            'SUSE-Enterprise-Storage-4-Pool',
                            'SUSE-Enterprise-Storage-4-Updates'
                        ]
                    }
                }
            },
            'ha': {
                'available': false,
                'repos': [
                    'SLE12-SP2-HA-Pool',
                    'SLE12-SP2-HA-Updates'
                ],
                'errors': {
                    'missing': {
                        'x86_64': [
                            'SLE12-SP2-HA-Pool',
                            'SLE12-SP2-HA-Updates'
                        ]
                    },
                    'inactive': {
                        'x86_64': [
                            'SLE12-SP2-HA-Pool',
                            'SLE12-SP2-HA-Updates'
                        ]
                    }
                }
            },
            'os': {
                'available': false,
                'repos': [
                    'SLES12-SP2-Pool',
                    'SLES12-SP2-Updates'
                ],
                'errors': {
                    'missing': {
                        'x86_64': [
                            'SLES12-SP2-Pool',
                            'SLES12-SP2-Updates'
                        ]
                    },
                    'inactive': {
                        'x86_64': [
                            'SLES12-SP2-Pool',
                            'SLES12-SP2-Updates'
                        ]
                    }
                }
            },
            'openstack': {
                'available': false,
                'repos': [
                    'SUSE-OpenStack-Cloud-7-Pool',
                    'SUSE-OpenStack-Cloud-7-Updates'
                ],
                'errors': {
                    'missing': {
                        'x86_64': [
                            'SUSE-OpenStack-Cloud-7-Pool',
                            'SUSE-OpenStack-Cloud-7-Updates'
                        ]
                    },
                    'inactive': {
                        'x86_64': [
                            'SUSE-OpenStack-Cloud-7-Pool',
                            'SUSE-OpenStack-Cloud-7-Updates'
                        ]
                    }
                }
            }
        },
        passingRepoChecks = {
            'ceph': {
                'available': true,
                'repos': [
                    'SUSE-Enterprise-Storage-4-Pool',
                    'SUSE-Enterprise-Storage-4-Updates'
                ],
                'errors': {}
            },
            'ha': {
                'available': true,
                'repos': [
                    'SLE12-SP2-HA-Pool',
                    'SLE12-SP2-HA-Updates'
                ],
                'errors': {}
            },
            'os': {
                'available': true,
                'repos': [
                    'SLES12-SP2-Pool',
                    'SLES12-SP2-Updates'
                ],
                'errors': {}
            },
            'openstack': {
                'available': true,
                'repos': [
                    'SUSE-OpenStack-Cloud-7-Pool',
                    'SUSE-OpenStack-Cloud-7-Updates'
                ],
                'errors': {}
            }
        },
        partiallyFailingRepoChecks = {
            'ceph': {
                'available': false,
                'repos': [
                    'SUSE-Enterprise-Storage-4-Pool',
                    'SUSE-Enterprise-Storage-4-Updates'
                ],
                'errors': {
                    'missing': {
                        'x86_64': [
                            'SUSE-Enterprise-Storage-4-Updates'
                        ]
                    },
                    'inactive': {
                        'x86_64': [
                            'SUSE-Enterprise-Storage-4-Updates'
                        ]
                    }
                }
            },
            'ha': {
                'available': false,
                'repos': [
                    'SLE12-SP2-HA-Pool',
                    'SLE12-SP2-HA-Updates'
                ],
                'errors': {
                    'missing': {
                        'x86_64': [
                            'SLE12-SP2-HA-Pool',
                            'SLE12-SP2-HA-Updates'
                        ]
                    },
                    'inactive': {
                        'x86_64': [
                            'SLE12-SP2-HA-Pool',
                            'SLE12-SP2-HA-Updates'
                        ]
                    }
                }
            },
            'os': {
                'available': false,
                'repos': [
                    'SLES12-SP2-Pool',
                    'SLES12-SP2-Updates'
                ],
                'errors': {
                    'missing': {
                        'x86_64': [
                            'SLES12-SP2-Pool'
                        ]
                    },
                    'inactive': {
                        'x86_64': [
                            'SLES12-SP2-Pool'
                        ]
                    }
                }
            },
            'openstack': {
                'available': true,
                'repos': [
                    'SUSE-OpenStack-Cloud-7-Pool',
                    'SUSE-OpenStack-Cloud-7-Updates'
                ],
                'errors': {}
            }
        },
        failingErrors = {
            auth_error: {
                data: 'Authentication failure',
                help: 'Please authenticate',
            }
        },
        entityResponse = {
            data: {
                'version': '4.0',
                'addons': [
                    'ceph',
                    'ha'
                ]
            }
        },
        passingReposChecksResponse = {
            data: passingRepoChecks
        },
        failingReposChecksResponse = {
            data: failingRepoChecks
        },
        partiallyFailingReposChecksResponse = {
            data: partiallyFailingRepoChecks
        },
        failingResponse = {
            data: {
                errors: failingErrors
            }
        };

    beforeEach(function() {
        //Setup the module and dependencies to be used.
        bard.appModule('crowbarApp.upgrade');
        bard.inject(
            '$controller',
            'upgradeFactory',
            'crowbarFactory',
            '$q',
            '$httpBackend',
            '$rootScope'
        );

        bard.mockService(crowbarFactory, {
            getEntity: $q.when(entityResponse)
        });

        //Create the controller
        controller = $controller('UpgradeNodesRepositoriesCheckController');

        //Mock requests that are expected to be made
        $httpBackend.expectGET('app/features/upgrade/i18n/en.json').respond({});
        $httpBackend.flush();

    });

    // Verify no unexpected http call has been made
    bard.verifyNoOutstandingHttpRequests();

    it('should exist', function () {
        should.exist(controller);
    });

    describe('Repo Checks Model', function () {
        it('should be defined', function () {
            should.exist(controller.repoChecks);
        });

        it('is not completed by default', function() {
            assert.isFalse(controller.repoChecks.completed);
        });

        it('is not valid by default', function() {
            assert.isFalse(controller.repoChecks.valid);
        });

        describe('contains a collection of checks that', function () {

            it('should be defined', function () {
                should.exist(controller.repoChecks.checks);
            });

            it('should all be set to false', function () {
                assert.isObject(controller.repoChecks.checks);
                _.forEach(controller.repoChecks.checks, function(value) {
                    assert.isFalse(value.status);
                });
            });
        });
    });

    describe('runRepoChecks function', function () {
        it('should be defined', function () {
            should.exist(controller.repoChecks.runRepoChecks);
        });

        describe('when checks pass successfull', function () {
            beforeEach(function () {
                bard.mockService(upgradeFactory, {
                    getNodesRepoChecks: $q.when(passingReposChecksResponse)
                });
                controller.repoChecks.runRepoChecks();
                $rootScope.$digest();
            });

            it('should set repoChecks.completed status to true', function () {
                assert.isTrue(controller.repoChecks.completed);
            });

            it('should update valid attribute of checks model to true', function () {
                assert.isTrue(controller.repoChecks.valid);
            });

            it('should update checks values to true', function () {
                assert.isObject(controller.repoChecks.checks);
                _.forEach(controller.repoChecks.checks, function(value) {
                    assert.isTrue(value.status);
                });
            });

        });

        describe('when checks fails', function () {
            beforeEach(function () {
                bard.mockService(upgradeFactory, {
                    getNodesRepoChecks: $q.when(failingReposChecksResponse)
                });
                controller.repoChecks.runRepoChecks();
                $rootScope.$digest();
            });

            it('should set repoChecks.completed status to true', function () {
                assert.isTrue(controller.repoChecks.completed);
            });

            it('should update valid attribute of checks model to false', function () {
                assert.isFalse(controller.repoChecks.valid);
            });

            it('should update checks values to false', function () {
                assert.isObject(controller.repoChecks.checks);
                _.forEach(controller.repoChecks.checks, function(value) {
                    assert.isFalse(value.status);
                });
            });
        });

        describe('when checks partially fails', function () {
            beforeEach(function () {
                bard.mockService(upgradeFactory, {
                    getNodesRepoChecks: $q.when(partiallyFailingReposChecksResponse)
                });
                controller.repoChecks.runRepoChecks();
                $rootScope.$digest();
            });

            it('should set repoChecks.completed status to true', function () {
                assert.isTrue(controller.repoChecks.completed);
            });

            it('should update valid attribute of checks model to false', function () {
                assert.isFalse(controller.repoChecks.valid);
            });

            it('should update checks values to true or false as per the response', function () {
                assert.isObject(controller.repoChecks.checks);

                var langKeyPrefix = 'upgrade.repositories.codes.',
                    expectedChecks = {
                        'SLES12-SP2-Pool': {
                            status: false,
                            label: langKeyPrefix + 'SLES12-SP2-Pool'
                        },
                        'SLES12-SP2-Updates': {
                            status: true,
                            label: langKeyPrefix + 'SLES12-SP2-Updates'
                        },
                        'SUSE-OpenStack-Cloud-7-Pool': {
                            status: true,
                            label: langKeyPrefix + 'SUSE-OpenStack-Cloud-7-Pool'
                        },
                        'SUSE-OpenStack-Cloud-7-Updates': {
                            status: true,
                            label: langKeyPrefix + 'SUSE-OpenStack-Cloud-7-Updates'
                        },
                        'SLE12-SP2-HA-Pool': {
                            status: false,
                            label: langKeyPrefix + 'SLE12-SP2-HA-Pool'
                        },
                        'SLE12-SP2-HA-Updates': {
                            status: false,
                            label: langKeyPrefix + 'SLE12-SP2-HA-Updates'
                        },
                        'SUSE-Enterprise-Storage-4-Pool': {
                            status: true,
                            label: langKeyPrefix + 'SUSE-Enterprise-Storage-4-Pool'
                        },
                        'SUSE-Enterprise-Storage-4-Updates': {
                            status: false,
                            label: langKeyPrefix + 'SUSE-Enterprise-Storage-4-Updates'
                        }
                    };
                expect(controller.repoChecks.checks).toEqual(expectedChecks);

            });
        });

        describe('when service call fails', function () {
            beforeEach(function () {
                bard.mockService(upgradeFactory, {
                    getNodesRepoChecks: $q.reject(failingResponse)
                });
                controller.repoChecks.runRepoChecks();
                $rootScope.$digest();
            });

            it('should maintain valid attribute of checks model to false', function () {
                assert.isFalse(controller.repoChecks.valid);
            });

            it('should set repoChecks.completed status to true', function () {
                assert.isTrue(controller.repoChecks.completed);
            });

            it('should expose the errors through vm.repoChecks.errors object', function () {
                expect(controller.errors).toEqual(failingResponse.data);
            });
        });

        it('should leave checks values untouched', function () {
            assert.isObject(controller.repoChecks.checks);
            _.forEach(controller.repoChecks.checks, function(value) {
                assert.isFalse(value.status);
            });
        });
    });
});
