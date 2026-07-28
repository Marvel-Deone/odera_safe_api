# Frontend Handoff: Estate Streets, Resident Street Assignment, and Chat Rooms

## Summary

The backend now supports estate streets and street-based chat rooms.

Residents can be assigned to a street using `streetId`. Chat room access now depends partly on the logged-in user's role and, for residents, their assigned street.

## Standard API Response Shape

Successful responses use this shape:

```json
{
  "statusCode": 200,
  "status": "success",
  "title": "Rooms",
  "message": "Rooms fetched successfully",
  "data": {}
}
```

Errors use the same wrapper, with `status: "error"` and an HTTP error status code.

## New/Important Fields

### Resident

Residents may now include:

```json
{
  "streetId": "estate-street-id"
}
```

`streetId` is optional, but should be sent whenever the resident chooses or is assigned a street.

### Estate Street

Street records look like:

```json
{
  "id": "estate-street-id",
  "estateId": "estate-id",
  "name": "Freedom Street",
  "createdAt": "2026-07-22T14:15:00.000Z"
}
```

### Chat Room

Chat rooms may now include:

```json
{
  "id": "room-id",
  "estateId": "estate-id",
  "streetId": "estate-street-id",
  "name": "Freedom Street Street",
  "type": "STREET",
  "block": null,
  "createdAt": "2026-07-22T14:15:00.000Z",
  "street": {
    "id": "estate-street-id",
    "estateId": "estate-id",
    "name": "Freedom Street",
    "createdAt": "2026-07-22T14:15:00.000Z"
  }
}
```

Possible room types:

```text
BROADCAST
SECURITY
ADMIN_ONLY
STREET
```

## Estate Streets Endpoints

All endpoints require Bearer auth.

### Resident: Get Estate Streets

```http
GET /resident/estate/streets
```

Allowed role:

```text
RESIDENT
```

Use this endpoint when a resident needs to select their street during profile completion or onboarding.

Example response:

```json
{
  "statusCode": 200,
  "status": "success",
  "title": "Estate Streets",
  "message": "Estate streets fetched successfully",
  "data": [
    {
      "id": "street-id",
      "estateId": "estate-id",
      "name": "Freedom Street",
      "createdAt": "2026-07-22T14:15:00.000Z"
    }
  ]
}
```

### Admin: Get Estate Streets

```http
GET /admin/estate/streets
```

Allowed roles:

```text
ADMIN
SUPER_ADMIN
```

### Admin: Create Estate Street

```http
POST /admin/estate/streets
```

Body:

```json
{
  "name": "Freedom Street"
}
```

### Admin: Update Estate Street

```http
PATCH /admin/estate/streets/:streetId
```

Body:

```json
{
  "name": "Freedom Avenue"
}
```

### Admin: Delete Estate Street

```http
DELETE /admin/estate/streets/:streetId
```

## Resident Flow Changes

### Create Resident

When creating a resident, the frontend can send `streetId`:

```json
{
  "first_name": "John",
  "last_name": "Doe",
  "email": "john@example.com",
  "phone": "08012345678",
  "house_no": "12",
  "block": "A",
  "streetId": "estate-street-id",
  "gender": "Male",
  "ndprConsentDataProcessing": true,
  "ndprConsentIdentity": true,
  "ndprConsentThirdParty": true
}
```

If `streetId` is sent, the backend verifies that the street belongs to the resident's estate. If not, the request fails with:

```text
400 Invalid Street - Street does not belong to this estate
```

### Complete Resident Profile

Residents can also submit or update `streetId` during profile completion:

```json
{
  "home_address": "Lekki Phase 1, Lagos",
  "streetId": "estate-street-id",
  "profileDeclaration": true
}
```

## Chat Endpoints

All chat endpoints require Bearer auth.

### Get Rooms

```http
GET /chat/rooms
```

The backend automatically creates default rooms when this endpoint is called.

Room visibility:

| Role | Rooms returned |
| --- | --- |
| `ADMIN`, `SUPER_ADMIN` | All rooms in the estate, including all street rooms |
| `GUARD`, `SUPER_GUARD` | `BROADCAST` and `SECURITY` rooms |
| `RESIDENT` | `BROADCAST` and their own `STREET` room, if they have `streetId` |

Frontend note: residents without `streetId` will not receive a street room.

### Get Room

```http
GET /chat/rooms/:roomId
```

Returns one room if the user has access.

### Get Messages

```http
GET /chat/rooms/:roomId/messages
```

Returns messages ordered oldest to newest.

Example message:

```json
{
  "id": "message-id",
  "roomId": "room-id",
  "senderId": "user-id",
  "message": "Hello everyone",
  "createdAt": "2026-07-22T14:15:00.000Z",
  "sender": {
    "id": "user-id",
    "email": "admin@example.com",
    "role": "ADMIN"
  }
}
```

### Send Message

```http
POST /chat/rooms/:roomId/messages
```

Body:

```json
{
  "message": "Hello everyone"
}
```

Important behavior:

- Message text is trimmed.
- Empty messages are rejected.
- Non-admin users cannot send messages to the `BROADCAST` room.
- Users can only send messages to rooms they are allowed to access.

### Admin Broadcast Shortcut

```http
POST /chat/broadcast
```

Allowed roles:

```text
ADMIN
SUPER_ADMIN
```

Body:

```json
{
  "message": "This is a broadcast message to all users."
}
```

This sends the message to the estate broadcast room.

## Frontend Implementation Notes

- Use `GET /resident/estate/streets` to populate the street dropdown for residents.
- Store/send the selected street's `id` as `streetId`, not the street name.
- For admin estate settings screens, use `/admin/estate/streets` for street CRUD.
- In chat, use `room.type` to determine the room category.
- Display `room.street.name` for street rooms when available.
- For residents, if no street room appears, check whether the logged-in user's resident profile has `streetId`.
- Do not hardcode room IDs. Always fetch rooms from `GET /chat/rooms`.

## Quick QA Checklist

- Login succeeds after migrations are applied.
- Resident can fetch estate streets.
- Resident profile/create flow sends `streetId`.
- Resident with a `streetId` sees `BROADCAST` plus their own `STREET` room.
- Resident without `streetId` only sees `BROADCAST`.
- Guard sees `BROADCAST` and `SECURITY`.
- Admin sees all estate rooms and can send broadcast messages.
- Non-admin cannot send into `BROADCAST`.
