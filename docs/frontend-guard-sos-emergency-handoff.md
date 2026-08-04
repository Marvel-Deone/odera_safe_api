# SOS and Emergency Workflow Frontend Handoff

This document describes the Guard SOS and Resident SOS emergency workflow for the frontend.

All HTTP endpoints require:

```http
Authorization: Bearer <token>
Content-Type: application/json
```

## Roles

- `GUARD`: can trigger, view own, cancel own, and mark live stream started.
- `ADMIN`: can view estate SOS alerts, acknowledge, resolve, close, escalate, trigger alarm, and manage contacts.
- `SUPER_GUARD`: can escalate, trigger alarm, list contacts, and record contact actions.
- `SUPER_ADMIN`: full admin permissions.
- `RESIDENT`: can trigger Resident SOS and receives Resident SOS vibration/modal alerts from other residents.

## SOS Types

There are two SOS types and they behave differently in the frontend:

| SOS Type       | Who Receives It                                       | Alert Behavior                         | Why                                               |
| -------------- | ----------------------------------------------------- | -------------------------------------- | ------------------------------------------------- |
| `GUARD_SOS`    | Admin, Super Guard, Super Admin                       | Modal + alarm sound + vibration        | Security team emergency response                  |
| `RESIDENT_SOS` | Residents, Guards, Super Guards, Admins, Super Admins | Modal + vibration only, no alarm sound | Security/privacy reason; avoid public panic alarm |

## Guard SOS Flow

When a guard triggers SOS:

1. Backend creates a `GuardSOS`.
2. Backend creates a linked emergency `Incident`.
3. Backend stores immutable timeline entries.
4. Backend creates an incident chat room.
5. Backend adds participants:
    - Guard
    - Super Guard
    - Admin
    - Super Admin
6. Backend records deduped emergency notifications.
7. Backend broadcasts modal/alarm/vibration socket events.

## Resident SOS Flow

When a resident triggers SOS:

1. Backend creates a linked emergency `Incident`.
2. Backend stores immutable timeline entries.
3. Backend creates an incident chat room.
4. Backend adds participants:
    - Triggering Resident
    - Other Residents
    - Guard
    - Super Guard
    - Admin
    - Super Admin
5. Backend records deduped emergency notifications.
6. Backend broadcasts modal and vibration socket events.
7. Backend does not broadcast alarm sound for Resident SOS.

Resident SOS source text must identify where the issue is coming from:

```text
A problem is coming from House No. 12, Maple Street
```

Frontend should display the house number and street name prominently in the modal/list item.

Expected Resident SOS payload fields:

```json
{
    "source": "RESIDENT_SOS",
    "incidentId": "incident-id",
    "roomId": "room-id",
    "resident": {
        "id": "resident-id",
        "first_name": "Ada",
        "last_name": "Okafor",
        "house_no": "12",
        "street": {
            "id": "street-id",
            "name": "Maple"
        }
    },
    "locationLabel": "House No. 12, Maple Street",
    "message": "A problem is coming from House No. 12, Maple Street"
}
```

Frontend behavior for `RESIDENT_SOS`:

- Show emergency modal to every connected user in the estate.
- Vibrate supported devices.
- Do not play alarm sound.
- Show the source location as house number + street name.
- Open the incident chat automatically for participants.

Trigger endpoint:

`POST /incidents/resident-sos`

Role: `RESIDENT`

Request:

```json
{
    "message": "I need urgent help at home"
}
```

## Resident SOS Admin Actions

Admins need two Resident SOS actions that are different from Guard SOS escalation:

### Silence Resident SOS

Use this when the SOS is visible to everyone but should stop vibrating because it is not alarming.

Endpoint:

`PATCH /incidents/resident-sos/:id/silence`

Roles: `ADMIN`, `SUPER_ADMIN`

Request:

```json
{
    "note": "Checked with resident. No estate-wide emergency."
}
```

Expected frontend behavior:

- Stop vibration for this SOS.
- Keep the SOS visible in the incident/SOS list.
- Show a silenced state/badge.
- Keep timeline and audit history.

Socket event:

`resident-sos.silenced`

Payload:

```json
{
    "source": "RESIDENT_SOS",
    "incidentId": "incident-id",
    "silencedAt": "2026-08-04T10:00:00.000Z",
    "note": "Checked with resident. No estate-wide emergency."
}
```

### Resolve All Resident SOS

Use this when admin wants to clear all active Resident SOS alerts.

Endpoint:

`PATCH /incidents/resident-sos/resolve-all`

Roles: `ADMIN`, `SUPER_ADMIN`

Request:

```json
{
    "resolutionNote": "All resident SOS alerts reviewed and cleared."
}
```

Expected frontend behavior:

- Mark all active Resident SOS modals/cards as resolved.
- Stop vibration for all resolved Resident SOS alerts.
- Close related incident chats or mark them read-only.
- Refetch active SOS list after success.

Socket event:

`resident-sos.resolved-all`

Payload:

```json
{
    "source": "RESIDENT_SOS",
    "resolvedIncidentIds": ["incident-id-1", "incident-id-2"],
    "resolvedAt": "2026-08-04T10:00:00.000Z"
}
```

## Trigger Guard SOS

`POST /guard-sos`

Role: `GUARD`

Request:

```json
{
    "category": "PANIC",
    "zone": "Gate A",
    "message": "Suspicious armed movement near the gate",
    "latitude": 6.5244,
    "longitude": 3.3792
}
```

Notes:

- `category` must be a valid `GuardSOSCategory` from the backend enum.
- `zone`, `message`, `latitude`, and `longitude` are optional.
- If latitude and longitude are supplied, the backend logs `GPS_ACTIVATED`.
- A guard cannot create another SOS while they have an `ACTIVE` or `ACKNOWLEDGED` SOS.

Response shape:

```json
{
    "statusCode": 200,
    "status": "success",
    "title": "SOS Triggered",
    "message": "Emergency alert sent successfully",
    "data": {
        "id": "sos-id",
        "incidentId": "incident-id",
        "guardId": "guard-id",
        "estateId": "estate-id",
        "category": "PANIC",
        "status": "ACTIVE",
        "zone": "Gate A",
        "message": "Suspicious armed movement near the gate",
        "latitude": 6.5244,
        "longitude": 3.3792,
        "incident": {},
        "chatRoom": {
            "id": "room-id",
            "type": "INCIDENT",
            "incidentId": "incident-id",
            "closedAt": null
        },
        "recipients": []
    }
}
```

## Guard SOS History

`GET /guard-sos`

Role: `GUARD`

Returns SOS alerts created by the logged-in guard. Each item includes linked incident timeline and chat room where available.

## Cancel Own SOS

`PATCH /guard-sos/:id/cancel`

Role: `GUARD`

Use this for false alarms from the guard side.

Effects:

- Sets SOS status to `CANCELLED`.
- Sets linked incident status to `FALSE_ALARM`.
- Logs timeline event `FALSE_ALARM`.
- Closes the incident chat room.

## Mark Live Stream Started

`PATCH /guard-sos/:id/live-stream-started`

Role: `GUARD`

Effects:

- Logs timeline event `LIVE_STREAM_STARTED`.
- Broadcasts an emergency alert socket event.

## Admin SOS List

`GET /guard-sos/admin/alerts`

Roles: `ADMIN`, `SUPER_ADMIN`

Returns all SOS alerts for the admin estate, newest first.

Each alert may include:

```json
{
    "id": "sos-id",
    "status": "ACTIVE",
    "guard": {
        "id": "guard-id",
        "full_name": "John Guard",
        "phone": "08012345678",
        "zone_assignment": "Gate A"
    },
    "incident": {
        "id": "incident-id",
        "status": "OPEN",
        "location": "Gate A - 6.5244, 3.3792",
        "timeline": [],
        "chatRoom": {}
    }
}
```

## Admin SOS Detail

`GET /guard-sos/admin/alerts/:id`

Roles: `ADMIN`, `SUPER_ADMIN`

Use this for the SOS detail screen. The linked `incident.timeline` is ordered chronologically.

## Acknowledge SOS

`PATCH /guard-sos/:id/acknowledge`

Roles: `ADMIN`, `SUPER_ADMIN`

Effects:

- Changes SOS status from `ACTIVE` to `ACKNOWLEDGED`.
- Records `acknowledgedAt` and `acknowledgedBy`.
- Writes audit log.

## Escalate SOS

`PATCH /guard-sos/:id/escalate`

Roles: `ADMIN`, `SUPER_ADMIN`, `SUPER_GUARD`

Request:

```json
{
    "note": "Escalated to senior security and estate leadership"
}
```

Effects:

- Sets linked incident status to `ESCALATED`.
- Logs timeline event `ESCALATED`.
- Records deduped notifications.
- Emits `emergency.escalated`.
- Emits alarm/vibration events.

## Trigger Alarm Broadcast

`PATCH /guard-sos/:id/alarm`

Roles: `ADMIN`, `SUPER_ADMIN`, `SUPER_GUARD`

Request:

```json
{
    "note": "Sound estate emergency alarm for administrators"
}
```

Effects:

- Records `ALARM_TRIGGERED` notifications exactly once per recipient/event.
- Writes audit log.
- Emits alarm/vibration socket events.

Frontend should play alarm audio and/or trigger vibration when receiving `emergency.alarm`.

## Resolve SOS

`PATCH /guard-sos/:id/resolve`

Roles: `ADMIN`, `SUPER_ADMIN`

Request:

```json
{
    "resolutionNote": "Threat cleared by patrol team"
}
```

Effects:

- Sets SOS status to `RESOLVED`.
- Sets linked incident status to `RESOLVED`.
- Logs timeline event `RESOLVED`.
- Closes the incident chat room.
- Writes audit log.

## Close SOS Incident

`PATCH /guard-sos/:id/close`

Roles: `ADMIN`, `SUPER_ADMIN`

Request:

```json
{
    "note": "Incident reviewed and closed"
}
```

Effects:

- Sets linked incident status to `CLOSED`.
- Logs timeline event `CLOSED`.
- Closes incident chat.
- Broadcasts `incident.chat.closed`.
- Records closure notification.

## Timeline

Timeline entries are created by backend actions only. The frontend must not offer manual editing.

Possible timeline events:

- `SOS_TRIGGERED`
- `GPS_ACTIVATED`
- `LIVE_STREAM_STARTED`
- `NOTIFICATIONS_SENT`
- `ESCALATED`
- `RESOLVED`
- `FALSE_ALARM`
- `CLOSED`

Timeline fields:

```json
{
    "id": "timeline-id",
    "incidentId": "incident-id",
    "event": "SOS_TRIGGERED",
    "actorId": "user-id",
    "actorRole": "GUARD",
    "note": "Optional note",
    "location": "Gate A - 6.5244, 3.3792",
    "metadata": {},
    "createdAt": "2026-08-04T10:00:00.000Z"
}
```

Display timeline entries sorted by `createdAt` ascending.

## Incident Chat

Incident chats are auto-created by the backend.

Chat endpoints:

- `GET /chat/rooms`
- `GET /chat/rooms/:roomId`
- `GET /chat/rooms/:roomId/messages`
- `POST /chat/rooms/:roomId/messages`

Incident chat room fields:

```json
{
    "id": "room-id",
    "type": "INCIDENT",
    "incidentId": "incident-id",
    "name": "Incident Chat - Guard SOS - John Guard",
    "closedAt": null
}
```

Frontend behavior:

- Open incident chat automatically when receiving `incident.chat.opened`.
- Allow only participants returned by backend access rules.
- If `closedAt` is not null, show messages as read-only.
- If sending a message to a closed incident chat, backend returns `403`.

## Emergency Contacts

### List Contacts

`GET /guard-sos/admin/emergency-contacts`

Roles: `ADMIN`, `SUPER_ADMIN`, `SUPER_GUARD`

### Create Contact

`POST /guard-sos/admin/emergency-contacts`

Roles: `ADMIN`, `SUPER_ADMIN`

Request:

```json
{
    "name": "Lagos Police Division",
    "type": "POLICE",
    "phone": "08000000000",
    "smsPhone": "08000000001"
}
```

Contact types:

- `POLICE`
- `FIRE_SERVICE`
- `AMBULANCE`
- `ESTATE_SECURITY`
- `OTHER`

### Update Contact

`PATCH /guard-sos/admin/emergency-contacts/:contactId`

Roles: `ADMIN`, `SUPER_ADMIN`

Request:

```json
{
    "name": "Updated Police Contact",
    "phone": "08000000002",
    "smsPhone": "08000000003",
    "isActive": true
}
```

## Emergency Contact Actions

These endpoints record that the admin initiated an external action. The frontend should still perform the actual call or SMS action using the device/browser capability.

### Record Call Action

`POST /guard-sos/admin/emergency-contacts/:contactId/call`

Roles: `ADMIN`, `SUPER_ADMIN`, `SUPER_GUARD`

Request:

```json
{
    "incidentId": "incident-id",
    "note": "Called police division"
}
```

### Record SMS Action

`POST /guard-sos/admin/emergency-contacts/:contactId/sms`

Roles: `ADMIN`, `SUPER_ADMIN`, `SUPER_GUARD`

Request:

```json
{
    "incidentId": "incident-id",
    "message": "Emergency at Gate A. Please respond immediately.",
    "note": "SMS sent from admin dashboard"
}
```

### Record Super Admin Escalation

`POST /guard-sos/admin/emergency-contacts/:contactId/super-admin-escalation`

Roles: `ADMIN`, `SUPER_ADMIN`, `SUPER_GUARD`

Request:

```json
{
    "incidentId": "incident-id",
    "note": "Escalated externally and internally to Super Admin"
}
```

All contact actions:

- Create `EmergencyContactAction`.
- Write audit log.
- If `incidentId` is provided, append a timeline entry.

## WebSocket Events

Socket.IO is used.

Base connection uses the existing app socket URL.

Events to listen for:

### `emergency.alert`

Use for alert state updates.

### `emergency.modal`

Open the emergency modal immediately.

Payload example:

```json
{
    "sos": {},
    "incident": {},
    "roomId": "room-id",
    "location": "Gate A - 6.5244, 3.3792",
    "source": "GUARD_SOS"
}
```

### `emergency.alarm`

Play alarm sound for administrators only for `GUARD_SOS`.

Do not play alarm sound when payload `source` is `RESIDENT_SOS`.

### `emergency.vibration`

Trigger vibration on supported devices.

Resident SOS should use this event without `emergency.alarm`.

### `emergency.escalated`

Update UI to show escalation state.

### `incident.chat.opened`

Open/join the incident chat.

```json
{
    "incidentId": "incident-id",
    "roomId": "room-id",
    "participantIds": ["user-id"]
}
```

### `incident.chat.closed`

Mark incident chat as read-only.

```json
{
    "incidentId": "incident-id",
    "roomId": "room-id",
    "closedAt": "2026-08-04T10:00:00.000Z"
}
```

Existing incident events still exist:

- `incident.ticket.created`
- `incident.ticket.assigned`
- `incident.ticket.breached`
- `incident.ticket.completed`

## Duplicate Notification Handling

Backend stores emergency notifications with a unique key:

```text
incidentId + recipientId + event
```

Frontend recommendation:

- Use `incidentId + event` as a client-side dedupe key for modals/toasts.
- If the socket reconnects and refetches active SOS alerts, do not replay alarm sound for events already handled in the current session.

## Reconnect Handling

On socket reconnect:

1. Refetch `GET /guard-sos/admin/alerts`.
2. Find alerts where `status` is `ACTIVE` or `ACKNOWLEDGED`.
3. Refresh emergency modal state from the latest alert/incident.
4. Join any active incident chat room returned by the alert detail.
5. Do not duplicate alarm playback for already handled `incidentId + event`.

## Frontend Acceptance Checklist

- Guard can trigger SOS with optional GPS.
- Resident can trigger SOS.
- Resident SOS is visible to all residents, guards, super guards, admins, and super admins.
- Resident SOS vibrates devices but does not play alarm sound.
- Resident SOS modal shows source as house number + street name.
- Admin/Super Admin receives modal instantly.
- Admin/Super Admin/Super Guard receives alarm/vibration events.
- Admin can acknowledge, escalate, trigger alarm, resolve, and close.
- Admin can silence Resident SOS if it is not alarming.
- Admin can resolve all active Resident SOS alerts.
- Incident timeline displays chronologically and cannot be edited.
- Incident chat opens automatically for the right participants.
- Closed incident chats are read-only.
- Admin can configure emergency contacts.
- Call/SMS/escalation actions are recorded.
- Socket reconnect refetches active SOS state without duplicate notifications.

## Backend Build Note

The emergency workflow implementation is in progress in this branch. This handoff reflects the intended API and socket contract from the current controller/DTO/gateway work.
