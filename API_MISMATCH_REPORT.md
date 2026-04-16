# Frontend API Integration Mismatch Report

## Summary
Found **8 files** in the frontend that are still using **POST method** with JSON body for endpoints that have been converted to **GET method** with query parameters in the backend.

## Files Affected

### 1. ❌ `app/admin/(routes)/users/page.tsx` - Line 45
**Current (INCORRECT):**
```typescript
const body = {
  page: pagination.pageIndex + 1,
  pageSize: pagination.pageSize,
};

const response = await fetch(api_endpoints.getUsers, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${session?.accessToken}`
  },
  body: JSON.stringify(body)
});
```

**Should be (CORRECT):**
```typescript
const queryParams = new URLSearchParams({
  page: String(pagination.pageIndex + 1),
  pageSize: String(pagination.pageSize),
});

const response = await fetch(`${api_endpoints.getUsers}?${queryParams}`, {
  headers: {
    "Authorization": `Bearer ${session?.accessToken}`
  }
});
```

---

### 2. ❌ `app/admin/(routes)/devices/page.tsx` - Line 104
**Current (INCORRECT):**
```typescript
const body = {
  page: pagination.pageIndex + 1,
  pageSize: pagination.pageSize,
};

const response = await fetch(api_endpoints.getPosDevices, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${session?.accessToken}`
  },
  body: JSON.stringify(body)
});
```

**Should be (CORRECT):**
```typescript
const queryParams = new URLSearchParams({
  page: String(pagination.pageIndex + 1),
  pageSize: String(pagination.pageSize),
});

const response = await fetch(`${api_endpoints.getPosDevices}?${queryParams}`, {
  headers: {
    "Authorization": `Bearer ${session?.accessToken}`
  }
});
```

---

### 3. ❌ `app/admin/(routes)/apps/page.tsx` - Line 44
**Current (INCORRECT):**
```typescript
const body = {
  page: pagination.pageIndex + 1,
  pageSize: pagination.pageSize,
};

const response = await fetch(api_endpoints.getApps, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${session?.accessToken}`
  },
  body: JSON.stringify(body)
});
```

**Should be (CORRECT):**
```typescript
const queryParams = new URLSearchParams({
  page: String(pagination.pageIndex + 1),
  pageSize: String(pagination.pageSize),
});

const response = await fetch(`${api_endpoints.getApps}?${queryParams}`, {
  headers: {
    "Authorization": `Bearer ${session?.accessToken}`
  }
});
```

---

### 4. ❌ `app/admin/(routes)/apps/versions/page.tsx` - Line 42
**Current (INCORRECT):**
```typescript
const body = {
  page: pagination.pageIndex + 1,
  pageSize: pagination.pageSize,
};

const response = await fetch(api_endpoints.getAppVersions, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${session?.accessToken}`
  },
  body: JSON.stringify(body)
});
```

**Should be (CORRECT):**
```typescript
const queryParams = new URLSearchParams({
  page: String(pagination.pageIndex + 1),
  pageSize: String(pagination.pageSize),
});

const response = await fetch(`${api_endpoints.getAppVersions}?${queryParams}`, {
  headers: {
    "Authorization": `Bearer ${session?.accessToken}`
  }
});
```

---

### 5. ❌ `app/admin/(routes)/business/page.tsx` - Line 43
**Current (INCORRECT):**
```typescript
const body = {
  page: pagination.pageIndex + 1,
  pageSize: pagination.pageSize,
};

const response = await fetch(api_endpoints.getBusinesses, {
  method: "POST",
  headers: {
    "Content-Type": "businesslication/json",
    "Authorization": `Bearer ${session?.accessToken}`
  },
  body: JSON.stringify(body)
});
```

**Should be (CORRECT):**
```typescript
const queryParams = new URLSearchParams({
  page: String(pagination.pageIndex + 1),
  pageSize: String(pagination.pageSize),
});

const response = await fetch(`${api_endpoints.getBusinesses}?${queryParams}`, {
  headers: {
    "Authorization": `Bearer ${session?.accessToken}`
  }
});
```

---

### 6. ❌ `app/admin/(routes)/locations/page.tsx` - Line 53
**Current (INCORRECT):**
```typescript
const body = {
  page: pagination.pageIndex + 1,
  pageSize: pagination.pageSize,
};

const response = await fetch(api_endpoints.getLocations, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${session?.accessToken}`,
  },
  body: JSON.stringify(body),
});
```

**Should be (CORRECT):**
```typescript
const queryParams = new URLSearchParams({
  page: String(pagination.pageIndex + 1),
  pageSize: String(pagination.pageSize),
});

const response = await fetch(`${api_endpoints.getLocations}?${queryParams}`, {
  headers: {
    Authorization: `Bearer ${session?.accessToken}`,
  },
});
```

---

### 7. ❌ `components/custom/dashboard/dashboard-users.tsx` - Line 51
**Current (INCORRECT):**
```typescript
const body = {
  page: pagination.pageIndex + 1,
  pageSize: pagination.pageSize,
};

const response = await fetch(api_endpoints.getUsers, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${session?.accessToken}`,
  },
  body: JSON.stringify(body),
});
```

**Should be (CORRECT):**
```typescript
const queryParams = new URLSearchParams({
  page: String(pagination.pageIndex + 1),
  pageSize: String(pagination.pageSize),
});

const response = await fetch(`${api_endpoints.getUsers}?${queryParams}`, {
  headers: {
    Authorization: `Bearer ${session?.accessToken}`,
  },
});
```

---

### 8. ❌ `components/custom/dashboard/dashboard-recent-events.tsx` - Line 182
**Current (INCORRECT):**
```typescript
const body = { page: 1, pageSize: 10 };

const res = await fetch(api_endpoints.getEvents, {
  method: 'POST',
  headers: {
    Authorization: `Bearer ${session?.accessToken}`,
  },
  body: JSON.stringify(body),
});
```

**Should be (CORRECT):**
```typescript
const queryParams = new URLSearchParams({
  page: '1',
  pageSize: '10',
});

const res = await fetch(`${api_endpoints.getEvents}?${queryParams}`, {
  headers: {
    Authorization: `Bearer ${session?.accessToken}`,
  },
});
```

---

## Backend APIs Changed
- `GET /users/get` - was POST
- `GET /dashboard/events/get` - was POST
- `GET /pos/devices/get` - was POST
- `GET /apps/get` - was POST
- `GET /app/versions/get` - was POST
- `GET /locations/get` - was POST
- `GET /businesses/get` - was POST

All now accept query parameters: `?page=X&pageSize=Y&search=term`

---

## Action Required
🚨 **All 8 frontend files must be updated to use GET requests with query parameters instead of POST requests with JSON body.**

If not updated, the frontend will receive **405 Method Not Allowed** errors from the backend.

---

## Quick Fix Pattern
Replace this pattern in all 8 files:
```typescript
// OLD (DON'T USE)
const body = { page: pagination.pageIndex + 1, pageSize: pagination.pageSize };
const response = await fetch(endpoint, {
  method: "POST",
  headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
  body: JSON.stringify(body)
});
```

With this pattern:
```typescript
// NEW (USE THIS)
const queryParams = new URLSearchParams({
  page: String(pagination.pageIndex + 1),
  pageSize: String(pagination.pageSize),
});
const response = await fetch(`${endpoint}?${queryParams}`, {
  headers: { "Authorization": `Bearer ${token}` }
});
```

Always remember:
- ✅ Use `GET` method (or omit method, GET is default)
- ✅ Use `URLSearchParams` or string concatenation for query parameters
- ✅ Remove `Content-Type: application/json` header for GET requests
- ✅ Remove the `body` property entirely
