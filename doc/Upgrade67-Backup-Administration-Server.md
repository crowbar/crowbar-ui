## Wireframes
### Backup Administration Server Page
![Backup Administration Server](images/step%202.png)
## High Definition Mockup
![](images/backup-comp.png)

### Annotations
| # | Component | Description |
| --- | -------- | -------- |
| 1   | Backup Section  | This section contains information about the backup and the button to initiate it.  |
| 1.1   | Create & Download Backup button  | This button is always enabled. On mouseOver show the hover state. When the user clicks on it a backup will be created with a unique name. A spinner will be displayed if the action takes more than 2 seconds.  |
| 2   | Main Control Section  | This section contains the "Next" and "Cancel Upgrade" buttons which control the main flow of the wizard.  |
| 2.1   | Cancel Upgrade Button  | This button is always enabled. On mouseOver show the hover state. When clicked, ["Cancel Upgrade" modal window](Upgrade67-Cancel-Upgrade.md) will be displayed |
| 2.2   | Next Button  | This button will be disabled by default until a backup is created. When enabled, on mouseOver show the hover state.  This button redirects the user to [Administration Server Repository Checks Page](Upgrade67-Administration-Server-Repository-Checks.md).  |
| 3 | Status Section | This section shows the overall status and current step of the upgrade process. |
| 3.1 | Status Item | All steps necessary to upgrade the cloud is displayed here. The current step is displayed to the user. No user interaction is possible. |

## High Definition Mockups
![Hi-Def Comp of Backup step](images/backup-comp.png)

## Business Rules
1. Backup Administrator Server page can only be accessed by the Crowbar Administrator.
1. Crowbar Administrator must create a backup of the Administration Server.
1. The "Create & Download Backup" button is always enabled
1. When "Create & Download Backup" button is clicked, a new backup of the Administration Server is created in a gzip tar format.
1. Multiple backup files can be created.
1. The backup file is created with a unique file name.
1. The backup file, once created, is stored in the Administration Server.
1. A download of the backup file is being triggered once it's created.
1. The "Next" button is disabled by default and is enabled once the first backup is completed.
1. When the Crowbar Administrator clicks on "Next" button, he will be redirected to [Administration Server Repository Checks Page](Upgrade67-Administration-Server-Repository-Checks.md).
1. When clicked, the "Cancel Upgrade" button triggers the ["Cancel Upgrade" modal window](Upgrade67-Cancel-Upgrade.md).

## Test Cases
### TC.UPGRADE.ADMIN.BACKUP.01
### TC.UPGRADE.ADMIN.BACKUP.02
### TC.UPGRADE.ADMIN.BACKUP.03

## User Stories
- (A list of Trello cards to track the implementation of this page)