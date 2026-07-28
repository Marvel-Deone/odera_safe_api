# API Handoff: NIN, Public Estates, and Business Hub

## Response Shape

All successful responses use:

```json
{
  "statusCode": 200,
  "status": "success",
  "title": "Title",
  "message": "Human readable message",
  "data": {}
}
```

Errors use the same wrapper with `status: "error"` and the relevant HTTP status code.

## NIN Verification

### Verify NIN With Face Capture

```http
POST /residents/verify-nin
Authorization: Bearer <resident-token>
```

Requires authentication.

Body:

```json
{
  "idcard_no": "63184876213",
  "face_capture": "https://example.com/nin-face-image.jpg"
}
```

Field notes:

- `idcard_no`: resident NIN.
- `face_capture`: public URL to the resident face image used for QoreID face verification.

Success response:

```json
{
  "statusCode": 200,
  "status": "success",
  "title": "NIN Verification Successful",
  "message": "Your NIN has been verified successfully",
  "data": {
    "resident": {},
    "nin_verification": {}
  }
}
```

Backend behavior:

- Calls QoreID NIN face verification.
- Checks face match result if QoreID returns `face_verification`.
- Compares returned NIN first name, last name, and DOB against the resident profile when those fields exist.
- Saves `nin`, `face_capture`, and updates `kycStatus` to `COMPLETED`.

Common errors:

```json
{
  "statusCode": 403,
  "status": "error",
  "title": "NIN Verification Failed",
  "message": "Forbidden resource",
  "data": {
    "status": 403,
    "statusCode": 403,
    "message": "Forbidden resource",
    "error": "Forbidden"
  }
}
```

`Forbidden resource` comes from QoreID and usually means the QoreID account/token does not have access to that verification product.

## Public Estate Endpoints

These endpoints do not require authentication.

### Get All Estates

```http
GET /estates
```

Success response:

```json
{
  "statusCode": 200,
  "status": "success",
  "title": "Estates",
  "message": "Estates fetched successfully",
  "data": [
    {
      "id": "estate-id",
      "name": "Odera Estate",
      "address": "Lekki Phase 1, Lagos",
      "totalHouses": 120,
      "createdAt": "2026-07-28T12:00:00.000Z"
    }
  ]
}
```

### Get Streets By Estate ID

```http
GET /estates/:estateId/streets
```

Example:

```http
GET /estates/estate-id/streets
```

Success response:

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
      "createdAt": "2026-07-28T12:00:00.000Z"
    }
  ]
}
```

If the estate does not exist:

```json
{
  "statusCode": 404,
  "status": "error",
  "title": "Not Found",
  "message": "Estate not found"
}
```

## Business Hub

Business Hub requires authentication. Resident routes require `RESIDENT`. Admin routes require `ADMIN` or `SUPER_ADMIN`. Guard validation requires `GUARD`, `SUPER_GUARD`, `ADMIN`, or `SUPER_ADMIN`.

### Enum Values

Business categories:

```text
CHURCH
SCHOOL
RELIGIOUS_ORGANIZATION
OFFICE
SHOP
OTHER
```

Payment frequency:

```text
MONTHLY
ANNUAL
```

Business Hub status:

```text
ENABLED
DISABLED
```

Registration statuses:

```text
DRAFT
PENDING_PAYMENT
ACTIVE
EXPIRED
SUSPENDED
```

Payment statuses:

```text
UNPAID
PAID
FAILED
EXPIRED
```

Valid days:

```text
MONDAY
TUESDAY
WEDNESDAY
THURSDAY
FRIDAY
SATURDAY
SUNDAY
```

### Admin: Configure Business Hub

```http
POST /admin/business-hub/settings
Authorization: Bearer <admin-token>
```

Body:

```json
{
  "registrationFee": 50000,
  "paymentFrequency": "ANNUAL",
  "maxVehiclesAllowed": 3,
  "status": "ENABLED"
}
```

### Admin: Get Business Hub Settings

```http
GET /admin/business-hub/settings
Authorization: Bearer <admin-token>
```

### Admin: Get Estate Business Registrations

```http
GET /admin/business-hub/registrations
Authorization: Bearer <admin-token>
```

### Admin: Suspend Registration

```http
PATCH /admin/business-hub/registrations/:id/suspend
Authorization: Bearer <admin-token>
```

Body:

```json
{
  "reason": "Business pass misuse"
}
```

### Admin: Reactivate Registration

```http
PATCH /admin/business-hub/registrations/:id/activate
Authorization: Bearer <admin-token>
```

The registration must be paid and unexpired.

### Resident: Get Business Hub Settings

```http
GET /business-hub/settings
Authorization: Bearer <resident-token>
```

Use this before registration to display:

- Registration fee
- Payment frequency
- Maximum vehicles allowed
- Whether Business Hub is enabled

### Resident: Register Business

```http
POST /business-hub/registrations
Authorization: Bearer <resident-token>
```

Body:

```json
{
  "category": "SCHOOL",
  "validDays": ["MONDAY", "TUESDAY"],
  "startTime": "06:00",
  "endTime": "19:00",
  "payNow": true
}
```

If category is `OTHER`, include `otherCategory`:

```json
{
  "category": "OTHER",
  "otherCategory": "Pharmacy",
  "validDays": ["MONDAY", "TUESDAY", "WEDNESDAY"],
  "startTime": "08:00",
  "endTime": "18:00",
  "payNow": false
}
```

Time format is `HH:mm` 24-hour format.

`payNow: true`:

- Deducts the registration fee from the resident wallet.
- Creates an active registration.
- Sets `registrationStatus` to `ACTIVE`.
- Sets `paymentStatus` to `PAID`.
- Generates persistent `passcode`, `qrPayload`, and `qrCode`.

`payNow: false`:

- Saves the registration.
- Sets `registrationStatus` to `PENDING_PAYMENT`.
- Sets `paymentStatus` to `UNPAID`.
- The pass cannot be used until payment is completed.

### Resident: Get My Business Registrations

```http
GET /business-hub/registrations
Authorization: Bearer <resident-token>
```

### Resident: Pay Pending Registration

```http
POST /business-hub/registrations/pay
Authorization: Bearer <resident-token>
```

Body:

```json
{
  "registrationId": "business-registration-id"
}
```

Successful payment activates the registration and sets an expiry date based on the configured payment frequency.

### Resident: Get Business Pass

```http
GET /business-hub/registrations/:id/pass
Authorization: Bearer <resident-token>
```

Success response includes:

```json
{
  "id": "business-registration-id",
  "registrationStatus": "ACTIVE",
  "paymentStatus": "PAID",
  "passcode": "837492",
  "qrPayload": "BUSINESS:uuid-token",
  "qrCode": "data:image/png;base64,...",
  "validDays": ["MONDAY", "TUESDAY"],
  "startTime": "06:00",
  "endTime": "19:00",
  "maxVehiclesAllowed": 3,
  "expiresAt": "2027-07-28T12:00:00.000Z"
}
```

### Guard: Verify Business Pass

```http
POST /guard/business-hub/verify
Authorization: Bearer <guard-token>
```

Body with passcode:

```json
{
  "passcode": "837492",
  "gateName": "Main Gate",
  "vehiclePlate": "ABC-123XY"
}
```

Body with QR payload:

```json
{
  "qrPayload": "BUSINESS:uuid-token",
  "gateName": "Main Gate",
  "vehiclePlate": "ABC-123XY"
}
```

Validation checks:

- Business pass exists.
- Pass belongs to the guard/admin estate.
- Registration status is `ACTIVE`.
- Payment status is `PAID`.
- Registration is not expired.
- Current day is inside `validDays`.
- Current time is between `startTime` and `endTime`.
- Vehicle limit has not been reached for the day.

Access granted response:

```json
{
  "statusCode": 200,
  "status": "success",
  "title": "Access Granted",
  "message": "Business pass access granted",
  "data": {
    "allowed": true,
    "registration": {},
    "resident": {},
    "accessLog": {}
  }
}
```

Access denied response:

```json
{
  "statusCode": 200,
  "status": "success",
  "title": "Access Denied",
  "message": "Business pass is outside its valid time window",
  "data": {
    "allowed": false,
    "reason": "Business pass is outside its valid time window"
  }
}
```

Possible denial reasons include:

- `Business pass not found`
- `Business pass does not belong to this estate`
- `Business registration is pending_payment`
- `Business registration payment is unpaid`
- `Business registration has expired`
- `Business pass is not valid today`
- `Business pass is outside its valid time window`
- `Business vehicle limit reached`
