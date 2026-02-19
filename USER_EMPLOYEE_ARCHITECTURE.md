# User vs Employee Model Architecture

## Overview
The User and Employee models are now properly separated with clear responsibilities and an optional link between them.

## User Model (Authentication & System Access)

**Purpose:** System authentication and access control

**Fields:**
- `organizationId` - Multi-tenant organization reference
- `fullName` - User's display name
- `email` - Login email (unique)
- `password` - Hashed password
- `phone` - Contact number
- `imgUrl` - Profile picture
- `role` - Role reference for permissions

**Auth & Security:**
- `emailVerified` - Email verification status
- `emailVerificationToken` / `emailVerificationExpiry` - Email verification
- `resetPasswordToken` / `resetPasswordExpiry` - Password reset
- `twoFactorAuthEnabled` / `twoFactorSecret` - 2FA
- `loginAttempts` / `lockoutUntil` - Brute force protection
- `lastLogin` - Last login timestamp

**Status:**
- `isActive` - Account active status
- `suspended` - Account suspension flag

**Use Cases:**
- Login/logout
- Password management
- 2FA setup
- Role-based access control
- Session management

## Employee Model (HR & Payroll Data)

**Purpose:** HR records and payroll processing

**Fields:**
- `organizationId` - Multi-tenant organization reference
- `userId` - **Optional** link to User account (not all employees need system access)
- `employeeNumber` - Auto-generated EMP-XXXXXX
- `firstName` / `lastName` - Legal names
- `email` / `phone` - Contact info
- `dateOfBirth` / `gender` - Personal info
- `address` - Physical address (street, city, region, country)

**Employment:**
- `department` / `position` - Job details
- `employmentType` - full-time, part-time, contract, intern
- `hireDate` / `terminationDate` - Employment dates
- `status` - active, inactive, terminated

**Payroll:**
- `salary` - Compensation amount
- `paymentFrequency` - monthly, bi-weekly, weekly
- `bankDetails` - Bank account for direct deposit
- `taxInfo` - TIN, SSNIT numbers (Ghana-specific)

**Use Cases:**
- Payroll processing
- Leave management
- Time tracking
- HR reports
- Tax compliance

## Relationship: User ← Employee

```
User (1) ←→ (0..1) Employee
```

**Key Points:**

1. **Not all Users are Employees**
   - External accountants, consultants, auditors can have User accounts
   - They need system access but no payroll/HR data

2. **Not all Employees are Users**
   - Some employees may not need system access
   - Example: Factory workers, field staff who don't use the system

3. **Optional Link via `userId`**
   - Employee.userId references User._id
   - When present, links HR data to system account
   - When null, employee has no system access

## Data Flow Examples

### Scenario 1: Employee with System Access
```javascript
// User record (for login)
{
  _id: "user123",
  email: "kwame@company.com",
  password: "hashed...",
  role: "manager",
  emailVerified: true
}

// Employee record (for payroll)
{
  _id: "emp456",
  userId: "user123", // Links to User
  employeeNumber: "EMP-000001",
  firstName: "Kwame",
  lastName: "Mensah",
  salary: 8500,
  department: "Engineering"
}
```

### Scenario 2: Employee without System Access
```javascript
// No User record

// Employee record only
{
  _id: "emp789",
  userId: null, // No system access
  employeeNumber: "EMP-000002",
  firstName: "Ama",
  lastName: "Asante",
  salary: 3500,
  department: "Operations"
}
```

### Scenario 3: User without Employee Record
```javascript
// User record (external consultant)
{
  _id: "user999",
  email: "consultant@external.com",
  password: "hashed...",
  role: "accountant",
  emailVerified: true
}

// No Employee record (not on payroll)
```

## Benefits of This Architecture

### 1. Clear Separation of Concerns
- Authentication logic separate from HR logic
- Easier to maintain and test
- Single Responsibility Principle

### 2. Flexibility
- Can have employees without system access
- Can have users without payroll data
- Easy to add/remove system access

### 3. Security
- Sensitive payroll data separate from auth data
- Can apply different access controls
- Easier to audit

### 4. Scalability
- Can scale auth and HR systems independently
- Different caching strategies
- Optimized queries per use case

### 5. Data Integrity
- No duplicate data between models
- Single source of truth for each data type
- Easier to maintain consistency

## Migration Notes

**Removed from User Model:**
- ❌ `employment` object (employeeID, dateOfJoining, jobTitle, etc.)
- ❌ `payroll` object (salaryAmount, payFrequency, bankDetails)
- ❌ `taxInfo` object (ssn, taxId, w4Info)
- ❌ `address` object (moved to Employee)

**Added to Employee Model:**
- ✅ `userId` - Optional reference to User

**Kept in User Model:**
- ✅ Authentication fields (email, password, tokens)
- ✅ Security fields (2FA, lockout, login attempts)
- ✅ Status fields (isActive, suspended)
- ✅ Basic info (fullName, phone, imgUrl, role)

## Query Examples

### Get Employee with User Account
```javascript
const employee = await Employee.findById(empId).populate('userId', 'email fullName role');
// Returns employee with linked user data
```

### Get User with Employee Record
```javascript
const user = await User.findById(userId);
const employee = await Employee.findOne({ userId: user._id });
// Returns both records if employee exists
```

### Get All Employees (with or without system access)
```javascript
const employees = await Employee.find({ organizationId, del_flag: false })
  .populate('userId', 'email role');
// userId will be null for employees without system access
```

## Recommendations

1. **When creating a new employee:**
   - Always create Employee record
   - Optionally create User record if they need system access
   - Link them via Employee.userId

2. **When onboarding a user:**
   - Create User record first
   - If they're an employee, create Employee record with userId
   - If external (consultant), skip Employee record

3. **When terminating an employee:**
   - Set Employee.status = "terminated"
   - Optionally set User.isActive = false (to revoke access)
   - Keep both records for audit trail

4. **For payroll processing:**
   - Query Employee model only
   - No need to join with User
   - Faster queries, better performance

5. **For authentication:**
   - Query User model only
   - No need to join with Employee
   - Faster login, better security
