# Visitor Invitations: Accompanying Guests

## Overview

Visitor invitations now support accompanying guests. Existing invitations continue to work because the new fields default to:

```json
{
  "hasAccompanyingVisitor": false,
  "accompanyingVisitors": []
}
```

## Create Visitor

```http
POST /visitors
Authorization: Bearer <resident-token>
```

Existing fields still work. To add accompanying guests, include:

```json
{
  "name": "John Doe",
  "phone": "08012345678",
  "purpose": "Dinner visit",
  "visit_date": "2026-08-10T14:00:00.000Z",
  "total_entries": 2,
  "hasAccompanyingVisitor": true,
  "accompanyingVisitors": [
    {
      "name": "Adult Guest",
      "ageCategory": "ADULT_10_PLUS",
      "phoneNumber": "08011112222"
    },
    {
      "name": "Child Guest",
      "ageCategory": "CHILD_UNDER_10"
    }
  ]
}
```

## Update Visitor

```http
PATCH /visitors/:visitorId
Authorization: Bearer <resident-token>
```

Example:

```json
{
  "hasAccompanyingVisitor": true,
  "accompanyingVisitors": [
    {
      "name": "Adult Guest",
      "ageCategory": "ADULT_10_PLUS",
      "phoneNumber": "08011112222"
    }
  ]
}
```

To remove accompanying guests:

```json
{
  "hasAccompanyingVisitor": false
}
```

## Age Categories

```text
CHILD_UNDER_10
ADULT_10_PLUS
```

## Validation Rules

Child under 10:

- `name` is required.
- `ageCategory` must be `CHILD_UNDER_10`.
- `phoneNumber` is optional.

Adult 10+:

- `name` is required.
- `ageCategory` must be `ADULT_10_PLUS`.
- `phoneNumber` is required.
- `phoneNumber` must contain numbers only.

If `hasAccompanyingVisitor` is `true`, `accompanyingVisitors` must contain at least one guest.

## Response Shape

The visitor object now includes:

```json
{
  "hasAccompanyingVisitor": true,
  "accompanyingVisitors": [
    {
      "name": "Adult Guest",
      "ageCategory": "ADULT_10_PLUS",
      "phoneNumber": "08011112222"
    }
  ]
}
```
