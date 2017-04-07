## Wireframes
### Upgrade Admin Server
![Upgrade Administration Server](images/step%204.png)

### Annotations
| # | Component | Description |
| -------- | -------- | -------- |
| 1 | Upgrade Section | This section contains information about upgrading the administration server as well as a button to trigger the upgrade. 
| 1.1   | Upgrade Admin Server button  | This button will be enabled by default. On mouseOver show the hover state. Once the user clicks on it, it will be disabled. A spinner will be displayed if the action takes more than 2 seconds. The "Cancel Upgrade" button will be disabled after clicking the "Upgrade Admin Server" button. |
| 2   | Main Control Section  | This Section contains the "Next" and "Cancel Upgrade" buttons which control the main flow of the wizard.  |
| 2.1   | Cancel Upgrade Button  | This button is enabled by default, on mouseOver should show the hover state and will be disabled once the Upgrade administration server process is triggered. When clicked, ["Cancel Upgrade" modal window](Upgrade67-Cancel-Upgrade.md) will be displayed |
| 2.2   | Next Button  | This button will be disabled by default until the administration server has been successfully updated. When enabled, on mouseOver show the hover state. When the user clicks on it, the user will be redirected to [create a, or connect to, a PostrGresDB](Upgrade67-Create-or-Connect-To-PostgreSQL-Database.md).  |
| 3 | Status Section | This section shows the overall status and current step of the upgrade process. |
| 3.1 | Status Item | All steps necessary to upgrade the cloud are displayed here. The current step is displayed to the user. No user interaction is possible. |

## Business Rules
1. Upgrade Administration Server page can only be accessed by the Crowbar Administrator.
1. "Upgrade Administration Server" button is enabled by default.
1. When clicked, "Upgrade Administration Server" button will be disabled.
1. When clicked, "Upgrade Administration Server" button will trigger the Upgrade of the administration server.
1. "Cancel Upgrade" button will be disabled when the Upgrade of the administration server is triggered.
1. Once the Upgrade of the administration server is completed, the "Next" button will be enabled.
1. Once clicked, the "Next" button redirects the Crowbar Administrator to [create a, or connect to, a PostrGresDB](Upgrade67-Create-or-Connect-To-PostgreSQL-Database.md).
1. The "Cancel Upgrade" button is enabled by default.
1. When clicked, the "Cancel Upgrade" button triggers the "Cancel Upgrade" modal window.

## Test Cases
### TC.UPGRADE.ADMIN.UPGRADE.01

## User Stories
- (A list of Trello cards to track the implementation of this page)