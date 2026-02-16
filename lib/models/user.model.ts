import { Model, model, models, Schema } from "mongoose";

interface IUser extends Document {
    organizationId: Schema.Types.ObjectId
    fullName: string
    email: string
    password: string
    phone?: string
    imgUrl?: string
    role: string
    
    // Employment Info
    employment: {
        employeeID: string
        dateOfJoining: Date
        jobTitle?: string
        departmentId?: Schema.Types.ObjectId
        workSchedule?: "Full-time" | "Part-time" | "Contract"
        employmentType?: "W-2" | "1099"
    }
    
    // Payroll Info
    payroll: {
        salaryAmount?: number
        payFrequency?: "Weekly" | "Bi-weekly" | "Semi-monthly" | "Monthly"
        bankDetails?: {
            accountName?: string
            accountNumber?: string
            bankName?: string
            routingNumber?: string
        }
    }
    
    // Tax Info
    taxInfo: {
        ssn?: string
        taxId?: string
        w4Info?: object
    }
    
    // Address
    address?: {
        street?: string
        city?: string
        state?: string
        zipCode?: string
        country?: string
    }
    
    // Auth & Security
    emailVerified: boolean
    emailVerificationToken?: string
    emailVerificationExpiry?: Date
    resetPasswordToken?: string
    resetPasswordExpiry?: Date
    twoFactorAuthEnabled: boolean
    twoFactorSecret?: string
    loginAttempts: number
    lockoutUntil?: Date
    lastLogin?: Date
    
    // Status
    isActive: boolean
    suspended: boolean
    
    // Audit
    createdBy?: Schema.Types.ObjectId
    modifiedBy?: Schema.Types.ObjectId
    deletedBy?: Schema.Types.ObjectId
    deletedAt?: Date
    mod_flag: boolean
    del_flag: boolean
}

const UserSchema = new Schema<IUser>({
    organizationId: {
        type: Schema.Types.ObjectId,
        ref: "Organization",
        required: true,
        index: true
    },
    fullName: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    phone: String,
    imgUrl: String,
    role: {
        type: String,
        required: true,
        default: "employee"
    },
    
    employment: {
        employeeID: { type: String, required: true, unique: true },
        dateOfJoining: { type: Date, required: true },
        jobTitle: String,
        departmentId: {
            type: Schema.Types.ObjectId,
            ref: 'Department'
        },
        workSchedule: { 
            type: String, 
            enum: ["Full-time", "Part-time", "Contract"],
            default: "Full-time"
        },
        employmentType: {
            type: String,
            enum: ["W-2", "1099"],
            default: "W-2"
        }
    },
    
    payroll: {
        salaryAmount: Number,
        payFrequency: {
            type: String,
            enum: ["Weekly", "Bi-weekly", "Semi-monthly", "Monthly"]
        },
        bankDetails: {
            accountName: String,
            accountNumber: String,
            bankName: String,
            routingNumber: String
        }
    },
    
    taxInfo: {
        ssn: String,
        taxId: String,
        w4Info: Schema.Types.Mixed
    },
    
    address: {
        street: String,
        city: String,
        state: String,
        zipCode: String,
        country: { type: String, default: "USA" }
    },
    
    emailVerified: { type: Boolean, default: false },
    emailVerificationToken: String,
    emailVerificationExpiry: Date,
    resetPasswordToken: String,
    resetPasswordExpiry: Date,
    twoFactorAuthEnabled: { type: Boolean, default: false },
    twoFactorSecret: String,
    loginAttempts: { type: Number, default: 0 },
    lockoutUntil: Date,
    lastLogin: Date,
    
    isActive: { type: Boolean, default: true },
    suspended: { type: Boolean, default: false },
    
    createdBy: { type: Schema.Types.ObjectId, ref: "User" },
    modifiedBy: { type: Schema.Types.ObjectId, ref: "User" },
    deletedBy: { type: Schema.Types.ObjectId, ref: "User" },
    deletedAt: Date,
    mod_flag: { type: Boolean, default: false },
    del_flag: { type: Boolean, default: false },
}, {
    timestamps: true,
    versionKey: false,
})

UserSchema.index({ organizationId: 1, email: 1 })
UserSchema.index({ 'employment.employeeID': 1 })

type UserModelType = Model<IUser>

const User: UserModelType = models.User ?? model<IUser>("User", UserSchema)

export default User
