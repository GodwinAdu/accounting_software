import { Document, Model, model, models, Schema } from "mongoose"

export interface IProductCategory extends Document {
  organizationId: Schema.Types.ObjectId
  name: string
  description?: string
  status: "active" | "inactive"
  
  // Audit fields
  createdBy: Schema.Types.ObjectId
  modifiedBy?: Schema.Types.ObjectId
  deletedBy?: Schema.Types.ObjectId
  mod_flag: boolean
  del_flag: boolean
}

const ProductCategorySchema: Schema<IProductCategory> = new Schema({
  organizationId: {
    type: Schema.Types.ObjectId,
    ref: "Organization",
    required: true,
    index: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: String,
  status: {
    type: String,
    enum: ["active", "inactive"],
    default: "active"
  },
  
  // Audit fields
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  modifiedBy: {
    type: Schema.Types.ObjectId,
    ref: "User"
  },
  deletedBy: {
    type: Schema.Types.ObjectId,
    ref: "User"
  },
  mod_flag: {
    type: Boolean,
    default: false
  },
  del_flag: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true,
  versionKey: false
})

// Compound indexes
ProductCategorySchema.index({ organizationId: 1, name: 1 }, { unique: true })
ProductCategorySchema.index({ organizationId: 1, del_flag: 1 })

type ProductCategoryModel = Model<IProductCategory>

const ProductCategory: ProductCategoryModel = models.ProductCategory ?? model<IProductCategory>("ProductCategory", ProductCategorySchema)

export default ProductCategory
