import { Schema, model, models, Model } from "mongoose";

export interface ITeam  extends Document {
    organizationId: Schema.Types.ObjectId
    name: string
    members: Schema.Types.ObjectId[]
    createdBy?: Schema.Types.ObjectId | null
    modifiedBy?: Schema.Types.ObjectId | null
    deletedBy?: Schema.Types.ObjectId | null
    mod_flag?: boolean
    del_flag?: boolean
    action_type?: string
}

const TeamSchema = new Schema<ITeam>({
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
    members: [{
        type: Schema.Types.ObjectId,
        ref: "User",
    }],
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

type TeamModel = Model<ITeam>
// Create or retrieve the model
const Team:TeamModel = models.Team ?? model<ITeam>("Team", TeamSchema);

export default Team;