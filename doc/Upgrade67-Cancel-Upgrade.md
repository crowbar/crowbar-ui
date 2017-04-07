## Wireframes
### Cancel Upgrade - Confirmation
![Cancel Confirmation](images/step%202a.png)


### Annotations
| # | Component | Description |
| -------- | -------- | -------- |
| 1   | Main UI Section  | This section is covered with a semi-transparent div making interaction with the underlying elements impossible. |
| 2   | Main Control Section  | All elements in this section are disabled.  |
| 3 | Status Section | This section is covered with a semi-transparent div making interaction with the underlying elements impossible. |
| 4 | Confirm Cancellation Modal | When shown, this modal is the only interactive element on the page. It contains information about cancelling the upgrade. The user must select one of the two buttons to proceed. |
| 4.1 | Yes, cancel Upgrade Button | Clicking this button should return the cloud to it's previous state and redirect the page to the crowbar dashboard. |
| 4.2 | No, return to Upgrade Button | Clicking this button returns the user to the previous step at exactly the same state as before. |

## Business Rules
1. "No, return to Upgrade" and "Yes, cancel Upgrade" buttons are enabled by default.
1. "No, return to Upgrade" button lets the Crowbar Administrator continue with the Upgrade process.
1. "Yes, cancel Upgrade" button triggers the "Cancelation routine".
1. "Cancelation routine" consist on the following steps:
  1. SLES SP1 repositories are restored.
  1. User is informed that they should restore Cloud 6 repositories.
  1. Nodes Status is reverted from "upgrade" to "ready"
1. Once "Cancelation routine" is completed, the Crowbar Administrator will be redirected to Cloud 6 Dashboard page.
1. In case of failure in the "Cancelation routine", the Crowbar Administrator will be notified.


## Test Cases
### TC.BACKUP.CANCEL.CONFIRM.01
### TC.BACKUP.CANCEL.CONFIRM.02
### TC.BACKUP.CANCEL.CONFIRM.03

## User Stories
- (A list of Trello cards to track the implementation of this page)