# Resident Associates API

Resident associates are the unified profiles for staff and co-residents attached to a resident account.

## Authentication

All endpoints require a resident bearer token.

## Categories

- `CO_RESIDENT`
- `STAFF`

If `category` is omitted, the API uses `CO_RESIDENT`.

## Working Days

Use the same weekday values as Business Hub:

- `MONDAY`
- `TUESDAY`
- `WEDNESDAY`
- `THURSDAY`
- `FRIDAY`
- `SATURDAY`
- `SUNDAY`

`entryTime` and `exitTime` must use `HH:mm` 24-hour format. `exitTime` must be later than `entryTime`.

## Create Staff or Co-resident

`POST /resident-associates`

### Co-resident Request

```json
{
  "fullName": "Jane Doe",
  "phoneNumber": "08012345678",
  "idType": "NIN",
  "idNumber": "63184876213",
  "faceCapture": "https://example.com/face.jpg",
  "workingDays": ["MONDAY", "TUESDAY"],
  "entryTime": "06:00",
  "exitTime": "19:00"
}
```

### Staff Request

```json
{
  "category": "STAFF",
  "fullName": "Mary Johnson",
  "phoneNumber": "08011112222",
  "role": "Nanny",
  "idType": "NIN",
  "idNumber": "63184876213",
  "faceCapture": "https://example.com/face.jpg",
  "workingDays": ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY"],
  "entryTime": "07:00",
  "exitTime": "18:00"
}
```

### NIN Verification

When `idType` is `NIN`, the backend verifies the ID through QoreID face verification.

- `faceCapture` is required for NIN verification.
- A successful verification stores `ninVerificationStatus` as `VERIFIED`.
- If QoreID rejects the NIN or the face match fails, the API returns an error and the associate is not created.
- For non-NIN ID types, `ninVerificationStatus` remains `NOT_SUBMITTED`.

## List My Associates

`GET /resident-associates`

Returns the resident's staff and co-residents, newest first.

## Update Associate

`PATCH /resident-associates/:id`

All fields are optional. If `idType`, `idNumber`, or `faceCapture` changes and the resulting `idType` is `NIN`, NIN verification runs again.

## Delete Associate

`DELETE /resident-associates/:id`

Deletes only an associate owned by the authenticated resident.

## Response Fields

```json
{
  "id": "uuid",
  "residentId": "uuid",
  "category": "CO_RESIDENT",
  "fullName": "Jane Doe",
  "phoneNumber": "08012345678",
  "role": "Co-resident",
  "idType": "NIN",
  "idNumber": "63184876213",
  "faceCapture": "https://example.com/face.jpg",
  "workingDays": ["MONDAY", "TUESDAY"],
  "entryTime": "06:00",
  "exitTime": "19:00",
  "ninVerificationStatus": "VERIFIED",
  "ninVerificationData": {},
  "createdAt": "2026-08-03T12:00:00.000Z",
  "updatedAt": "2026-08-03T12:00:00.000Z"
}
```
