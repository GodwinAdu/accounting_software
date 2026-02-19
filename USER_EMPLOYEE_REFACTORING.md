# User-Employee Refactoring Complete ✅

## Changes Made

### Employee Model - Removed Duplicate Fields
**Removed:**
- ❌ `firstName` - Now in User.fullName
- ❌ `lastName` - Now in User.fullName
- ❌ `email` - Now in User.email
- ❌ `phone` - Now in User.phone

**Changed:**
- ✅ `userId` - Now **required** and **unique** (was optional)

**Kept (HR/Payroll specific):**
- ✅ `employeeNumber` - Auto EMP-XXXXXX
- ✅ `dateOfBirth`, `gender`, `address` - Personal info
- ✅ `department`, `position`, `employmentType` - Job details
- ✅ `hireDate`, `terminationDate`, `status` - Employment dates
- ✅ `salary`, `paymentFrequency`, `bankDetails` - Payroll info
- ✅ `taxInfo` - TIN, SSNIT numbers

### User Model - Clean Authentication Focus
**Kept:**
- ✅ `fullName`, `email`, `phone` - Basic contact info
- ✅ `password`, `emailVerified`, tokens - Authentication
- ✅ `twoFactorAuthEnabled`, `twoFactorSecret` - 2FA
- ✅ `loginAttempts`, `lockoutUntil`, `lastLogin` - Security
- ✅ `isActive`, `suspended` - Account status
- ✅ `role` - Permission role reference

## New Architecture

### One-to-One Relationship
```
User (1) ←→ (1) Employee
```

**Every Employee MUST have a User account**
- userId is required in Employee model
- userId is unique (one employee per user)
- All employees can log into the system

### Data Access Pattern

**Query Employee with User Data:**
```javascript
const employee = await Employee.findById(id)
  .populate('userId', 'fullName email phone');

// Access: employee.userId.fullName, employee.userId.email
```

**Nested Population (for related models):**
```javascript
const leaveRequest = await LeaveRequest.findById(id)
  .populate({
    path: 'employeeId',
    select: 'employeeNumber userId',
    populate: { path: 'userId', select: 'fullName' }
  });

// Access: leaveRequest.employeeId.userId.fullName
```

## Updated Actions

### employee.action.ts
- All queries now populate `userId` with `fullName email phone`
- Returns employee with nested user data

### leave-request.action.ts
- Nested population: `employeeId` → `userId` → `fullName`
- Access pattern: `req.employeeId.userId.fullName`

### time-entry.action.ts
- Nested population: `employeeId` → `userId` → `fullName`
- Access pattern: `entry.employeeId.userId.fullName`

### payroll-run.action.ts
- Nested population in employeePayments array
- Access pattern: `payment.employeeId.userId.fullName`

## Updated UI Pages

### employees/page.tsx
```javascript
name: emp.userId?.fullName || "N/A"
email: emp.userId?.email || "N/A"
phone: emp.userId?.phone || "N/A"
```

### leave/page.tsx
```javascript
employee: req.employeeId?.userId?.fullName || "N/A"
```

### time-tracking/page.tsx
```javascript
employee: entry.employeeId?.userId?.fullName || "N/A"
```

### run/page.tsx
```javascript
name: emp.userId?.fullName || "N/A"
```

## Benefits

### 1. No Data Duplication
- Single source of truth for name, email, phone
- Update in User model, reflects everywhere
- Eliminates sync issues

### 2. Cleaner Models
- User = Authentication only
- Employee = HR/Payroll only
- Clear separation of concerns

### 3. Enforced System Access
- All employees must have User accounts
- Consistent authentication across system
- Easier permission management

### 4. Better Data Integrity
- Unique constraint on userId prevents duplicates
- Required constraint ensures link exists
- Referential integrity via MongoDB refs

## Migration Considerations

### For Existing Data
If you have existing employees without userId:

```javascript
// Migration script needed
const employees = await Employee.find({ userId: null });

for (const emp of employees) {
  // Create User account
  const user = await User.create({
    organizationId: emp.organizationId,
    fullName: `${emp.firstName} ${emp.lastName}`,
    email: emp.email,
    phone: emp.phone,
    password: 'temporary_password', // Force reset on first login
    role: 'employee',
    createdBy: emp.createdBy
  });
  
  // Link to Employee
  emp.userId = user._id;
  await emp.save();
}
```

### Creating New Employees
**New workflow:**
1. Create User account first
2. Create Employee record with userId
3. Both records linked automatically

```javascript
// Step 1: Create User
const user = await User.create({
  organizationId,
  fullName: "Kwame Mensah",
  email: "kwame@company.com",
  password: hashedPassword,
  phone: "+233 24 123 4567",
  role: "employee"
});

// Step 2: Create Employee
const employee = await Employee.create({
  organizationId,
  userId: user._id,
  department: "Engineering",
  position: "Software Engineer",
  salary: 8500,
  hireDate: new Date()
});
```

## Query Performance

### Before (Separate Fields)
```javascript
// Simple query, no joins
const employees = await Employee.find({ organizationId });
// Fast, but data duplicated
```

### After (With Population)
```javascript
// Query with population
const employees = await Employee.find({ organizationId })
  .populate('userId', 'fullName email phone');
// Slightly slower, but no duplication
```

**Performance Impact:**
- Minimal overhead (MongoDB populate is optimized)
- Can use lean() for read-only operations
- Can cache populated results
- Trade-off: Slight performance cost for data integrity

## Recommendations

### 1. Always Populate userId
When fetching employees, always populate userId to get name/email:
```javascript
.populate('userId', 'fullName email phone')
```

### 2. Use Lean for Performance
For read-only operations:
```javascript
.populate('userId', 'fullName email phone').lean()
```

### 3. Handle Null Safety
Always use optional chaining:
```javascript
emp.userId?.fullName || "N/A"
```

### 4. Index Optimization
Ensure indexes exist:
- Employee.userId (unique, indexed)
- User.email (unique, indexed)
- User.organizationId (indexed)

## Status: Complete ✅

All models, actions, and UI pages have been updated to use the new User-Employee architecture with no data duplication.
