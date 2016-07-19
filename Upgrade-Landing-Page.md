# Wireframes
![Upgrade Flow Landing Page](url)

## Annotations

# Business Rules
1. Upgrade process flow can only be accessed by the Crowbar Administrator.
2. Crowbar Administrator needs to successfully run pre-checks.
3. Pre-checks for the Upgrade flow consist on:
    1. All maintenance updates available has been successfully installed.
    2. High Availability health check pass
4. In case of pre-checks failure, the Crowbar Administrator will be notified
5. In case of pre-checks failure, the Crowbar Administrator will be able to trigger a new check.
6. "Begin Upgrade" button will be disabled until all pre-checks pass successfully.
7. "Begin Upgrade" button will redirect the user to Database Backup page.

# Acceptance Criteria

# User Stories
- A list of Trello cards