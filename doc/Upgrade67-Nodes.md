![](images/here-be-dragons-300x30011.jpg)
## Wireframes
### Upgrade Nodes
![Upgrade Nodes](images/step%208.png)

### Annotations
| # | Component | Description |
| -------- | -------- | -------- |
| 1 | Upgrade Node Section | The section allows a user to begin upgrading control and computer nodes as well as re-applying all barclamps automatically. |
| 1.1 | "Finish Non-Disruptive Upgrade" button | Initiates the actions to migrate control and compute nodes to cloud 7 including the re-applying of barclamps. Enabled by default, on mouseOver show the hover state. |
| 1.2 | List of steps | This lists all the necessary steps and overview information as the total status |
| 1.2.1 | Current state of step | This lists the detailed information about the state of current node (either control node or compute node |
| 2   | Main Control Area  | This area contains the "Finish" button which controls the main flow of the wizard.  |
| 2.1   | Finish Button  | This button will be disabled by default until the migration and re-applying of barclamps returns success. When enabled, on mouseOver show the hover state. When the user clicks on it, the user will be redirected to the crowbar dashboard of SUSE OpenStack Cloud 7.  |
| 3 | Status Section | This section shows the overall status and current step of the upgrade process. |
| 3.1 | Status Item | All steps necessary to upgrade the cloud is displayed here. The current step is displayed to the user. No user interaction is possible. |

## Business Rules
1. Upgrade Node page can only be accessed by the Crowbar Administrator.
1. The Crowbar Administrator is able to see the current step he's on of the Upgrade Flow
1. "Finish Non-Disruptive Upgrade" button is enabled default.
1. When Crowbar Administrator clicks on "Finish Non-Disruptive Upgrade" button the Final Upgrade Process will be triggered.
1. Final Upgrade Process consists on the following steps:
    1. Upgrade Control Nodes
    1. Upgrade Compute Nodes
    1. Re-apply Barclamps configuration
1. Crowbar Administrator can see the actual status of Final Upgrade Process.
1. "Finish" button is disabled by default and will be enabled once Final Upgrade Process is completed successfully.
1. Crowbar Administrator will be redirected to Crowbar Dashboard page when click on "Finish" button.
1. Crowbar Administrator will be notified of any error during occurring during the Final Upgrade Process.

## Test Cases
### TC.UPGRADE.NODES.SUCCESS.01
### TC.UPGRADE.NODES.ERROR.01

## User Stories
- (A list of Trello cards to track the implementation of this page)
