# Resident Associates API

Resident associates are the unified profiles for staff and co-residents attached to a resident account.

## Authentication

All endpoints require a resident bearer token.

## Categories

- `CO_RESIDENT`
- `STAFF`

If `category` is omitted, the API uses `CO_RESIDENT`.

## Working Schedule

Use the same weekday values as Business Hub:

- `MONDAY`
- `TUESDAY`
- `WEDNESDAY`
- `THURSDAY`
- `FRIDAY`
- `SATURDAY`
- `SUNDAY`

Working schedules apply to staff only. Co-residents do not use `workingDays`, `entryTime`, or `exitTime`; the backend ignores those fields for co-residents.

For staff, `workingDays` is required, `entryTime` and `exitTime` must use `HH:mm` 24-hour format, and `exitTime` must be later than `entryTime`.

## Co-resident Login

Co-residents require `email`. After creation, the backend creates a resident login user with `first_login=true`, generates a temporary password, and sends a welcome email containing:

- The co-resident email.
- The temporary password.
- The app login link from `APP_LOGIN_LINK`, falling back to `APP_DOWNLOAD_LINK`.

The co-resident logs in with the temporary password and uses the existing change-password endpoint. No separate account setup flow is required.

## Create Staff or Co-resident

`POST /resident-associates`

### Co-resident Request

```json
{
  "fullName": "Jane Doe",
  "email": "jane@example.com",
  "phoneNumber": "08012345678",
  "idType": "NIN",
  "idNumber": "63184876213",
  "faceCapture": "https://example.com/face.jpg"
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
- For co-residents, the login account and associate profile are created in one transaction. The welcome email is sent after creation.

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
  "userId": "uuid",
  "category": "CO_RESIDENT",
  "fullName": "Jane Doe",
  "email": "jane@example.com",
  "phoneNumber": "08012345678",
  "role": "Co-resident",
  "idType": "NIN",
  "idNumber": "63184876213",
  "faceCapture": "https://example.com/face.jpg",
  "workingDays": [],
  "entryTime": null,
  "exitTime": null,
  "ninVerificationStatus": "VERIFIED",
  "ninVerificationData": {},
  "createdAt": "2026-08-03T12:00:00.000Z",
  "updatedAt": "2026-08-03T12:00:00.000Z"
}
```
