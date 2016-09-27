## Wireframes
###  Stop OpenStack Services
![ Stop OpenStack Services](images/step%207.png)
## High Definition Mockups
![](images/openstack%20services_comp1.png)
![](images/openstack%20services_comp2.png)
![](images/openstack%20services_comp3.png)

### Annotations
| # | Component | Description |
| -------- | -------- | -------- |
| 1 |  Stop OpenStack Services Section | This section explains that services will be stopped and that a backup of the database will be created when the user clicks on the button. |
| 1.1   |  Stop OpenStack Services Button  | This button will be enabled by default. On mouseOver show the hover state. Once the user clicks on it, it will be disabled. A spinner will be displayed if the action takes more than 2 seconds. When this action is finished, enable the "Next" button. |
| 1.2   | OpenStack Service Item | Name of the service Item and Status |
| 2   | Main Control Area | This area contains the "Next" and "Cancel Upgrade" buttons which control the main flow of the wizard.  |
| 2.1   | Cancel Upgrade Button  | This button is always enabled although styled differently than other buttons. It cancels the current process and returns the cloud to the state before starting the upgrade.  |
| 2.2   | Next Button  | This button will be disabled by default until after the backup is created. When enabled, on mouseOver show the hover state. When the user clicks on it, the user will be redirected to [Upgrade Nodes page](Upgrade67-Nodes.md) |
| 3 | Status Section | This section shows the overall status and current step of the upgrade process. |
| 3.1 | Status Item | All steps necessary to upgrade the cloud are displayed here. The current step is displayed to the user. No user interaction is possible.

## Business Rules
1.  Stop OpenStack Services page can only be accessed by the Crowbar Administrator.
1. " Stop OpenStack Services" button is enabled by default.
1. When clicked, "Stop OpenStack Services" button triggers the stopping of the necessary OpenStack Services.
1. Stop OpenStack Services consist on the following steps:
    1. Stop OpenStack Services
    2. Create OpenStack Database Backup
1. Crowbar Administrator can see the actual status of Stop OpenStack Services process.
1. "Next" button is disabled by default.
1. "Next" button will be enabled once  Stop OpenStack Services is completed successfully.
1. When clicked, the "Next" button redirects the Crowbar Administrator to [Upgrade Nodes page](Upgrade67-Nodes.md).
1. Crowbar Administrator will be notified of any error during occurring during the Stop OpenStack Services process.

## Test Cases
### TC.UPGRADE.SERVICES.STOP.01

## User Stories
- (A list of Trello cards to track the implementation of this page)
