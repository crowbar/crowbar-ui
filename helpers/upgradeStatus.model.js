var express = require('express'),
    totalNodes = 125,
    stepStatus = {
        pending: 'pending',
        running: 'running',
        passed: 'passed',

    },
    UpgradeStatusModel = {
        getStatus: getStatus,
        setStatus: setStatus,
        setUpdatedNodes: setUpdatedNodes,
        getDefaultStatus: getDefaultStatus,
        getCurrentStep: getCurrentStep,
        getCurrentStepName: getCurrentStepName,
        completeCurrentStep: completeCurrentStep,
        completeStep: completeStep,
        runCurrentStep: runCurrentStep,
        simulateDowntime: simulateDowntime,
        status: getDefaultStatus()
    };

    const upgradeSteps = [
        'upgrade_prechecks',
        'upgrade_prepare',
        'admin_backup',
        'admin_repo_checks',
        'admin_upgrade',
        'database',
        'nodes_repo_checks',
        'nodes_services',
        'nodes_db_dump',
        'nodes_upgrade',
        'finished'
    ];

// Define a basic model for the state
function getDefaultStatus() {
    return {
        current_step: 'upgrade_prechecks',
        substep: null,
        current_node: {
            alias: 'controller-1',
            name: 'controller.1234.suse.com',
            ip: '1.2.3.4',
            role: 'controller',
            state: 'post-upgrade'
        },
        remaining_nodes: 125,
        upgraded_nodes: 0,
        steps: {
            upgrade_prechecks: {
                status: stepStatus.pending,
                errors: {}
            },
            upgrade_prepare: {
                status: stepStatus.pending,
                errors: {}
            },
            admin_backup: {
                status: stepStatus.pending,
                errors: {}
            },
            admin_repo_checks: {
                status: stepStatus.pending,
                errors: {}
            },
            admin_upgrade: {
                status: stepStatus.pending,
                errors: {}
            },
            database: {
                status: stepStatus.pending,
                errors: {}
            },
            nodes_repo_checks: {
                status: stepStatus.pending,
                errors: {}
            },
            nodes_services: {
                status: stepStatus.pending,
                errors: {}
            },
            nodes_db_dump: {
                status: stepStatus.pending,
                errors: {}
            },
            nodes_upgrade: {
                status: stepStatus.pending,
                errors: {}
            },
            finished: {
                status: stepStatus.pending,
                errors: {}
            }
        }
    };
}

function runCurrentStep () {
    var currentStepName = UpgradeStatusModel.status.current_step,
        currentStepIndex = upgradeSteps.indexOf(currentStepName);

    // Complete previous steps, if any
    if (currentStepIndex > 1) {
        completeStep(upgradeSteps[currentStepIndex - 1]);
    }

    // Set current step status to running
    UpgradeStatusModel.status.steps[currentStepName].status = stepStatus.running;
}

function completeCurrentStep () {

    var currentStepName = UpgradeStatusModel.status.current_step;
    console.log('Complete current step: ' + currentStepName);

    // Complete the current step
    completeStep(currentStepName);
}

function completeStep (stepName) {
    var stepIndex = upgradeSteps.indexOf(stepName);

    // Complete the steps until the current one
    for (var i = 0; i < stepIndex; i++) {
        console.log('Setting as passed:' + upgradeSteps[i]);
        UpgradeStatusModel.status.steps[upgradeSteps[i]].status = stepStatus.passed
    }
    UpgradeStatusModel.status.steps[stepName].status = stepStatus.passed;
    console.log('Step: %s - Status: %s', stepName, UpgradeStatusModel.status.steps[stepName].status);
    // Set current_step to the next step
    UpgradeStatusModel.status.current_step = upgradeSteps[stepIndex + 1];
    console.log('---- New Current Step: %s - Status: %s', UpgradeStatusModel.getCurrentStepName(), UpgradeStatusModel.getCurrentStep().status);
}

function simulateDowntime () {
    var currentStepName = UpgradeStatusModel.status.current_step,
        currentStepIndex = upgradeSteps.indexOf(currentStepName);

    // nullify the current step to simulate failure
    UpgradeStatusModel.status.steps[currentStepName].status = null;
}

function getCurrentStep () {
    var currentStepName = UpgradeStatusModel.status.current_step,
        currentStepIndex = upgradeSteps.indexOf(currentStepName);

    // Complete the current step
    return UpgradeStatusModel.status.steps[currentStepName];
}

function getCurrentStepName () {
    return UpgradeStatusModel.status.current_step;
}

function getStatus () {
    return UpgradeStatusModel.status;
}

function setStatus (upgradeStatus) {
    UpgradeStatusModel.status = upgradeStatus;
}

function setUpdatedNodes(updatedNodes) {
    UpgradeStatusModel.status.upgraded_nodes = updatedNodes;
    UpgradeStatusModel.status.remaining_nodes = totalNodes - updatedNodes;
    UpgradeStatusModel.status.current_node = {
        alias: 'controller-' + updatedNodes,
        name: 'controller.' + updatedNodes + '.suse.com',
        ip: updatedNodes + '.2.3.4',
        role: 'controller: ' + updatedNodes,
        state: 'post-upgrade: ' + updatedNodes
    };
}

module.exports = UpgradeStatusModel;
