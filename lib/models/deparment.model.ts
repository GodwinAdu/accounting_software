import { Schema, model, models, Model } from "mongoose";

export interface IDepartment  extends Document {
    organizationId: Schema.Types.ObjectId
    name: string
    createdBy?: Schema.Types.ObjectId | null
    modifiedBy?: Schema.Types.ObjectId | null
    deletedBy?: Schema.Types.ObjectId | null
    mod_flag?: boolean
    del_flag?: boolean
    action_type?: string
}

const DepartmentSchema = new Schema<IDepartment>({
    organizationId:{
        type: Schema.Types.ObjectId,
        ref: "Organization",
        required: true,
    },
    name: {
        type: String,
        required: true, // Ensure the name is required
        trim: true,
        index: true,
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: "User",
        default: null,
    },
    mod_flag: {
        type: Boolean,
        default: false,
    },
    del_flag: {
        type: Boolean,
        default: false,
    },
    modifiedBy: {
        type: Schema.Types.ObjectId,
        ref: "User",
        default: null,
    },
    deletedBy: {
        type: Schema.Types.ObjectId,
        ref: "User",
        default: null,
    },
    action_type: {
        type: String,
        default: null,
    }
}, {
    timestamps: true, // Automatically manages `createdAt` and `updatedAt`
    versionKey: false, // Removes the `__v` version key
});

type DepartmentModel = Model<IDepartment>
// Create or retrieve the model
const Department:DepartmentModel = models.Department ?? model<IDepartment>("Department", DepartmentSchema);

export default Department;