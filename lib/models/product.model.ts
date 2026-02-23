import { Model, model, models, Schema } from "mongoose"

export interface IProduct {
  _id?: string
  organizationId: Schema.Types.ObjectId
  sku: string
  barcode?: string
  name: string
  description?: string
  categoryId?: Schema.Types.ObjectId
  type: "product" | "service"
  
  // Pricing
  costPrice: number
  sellingPrice: number
  margin?: number
  taxable: boolean
  taxRate?: number
  
  // Inventory
  trackInventory: boolean
  currentStock: number
  reorderLevel: number
  reorderQuantity?: number
  unit: string
  
  // Images
  images?: string[]
  primaryImage?: string
  
  // Status
  status: "active" | "inactive" | "discontinued"
  
  // Accounting
  inventoryAccountId?: Schema.Types.ObjectId
  cogsAccountId?: Schema.Types.ObjectId
  revenueAccountId?: Schema.Types.ObjectId
  
  // Audit fields
  createdBy: Schema.Types.ObjectId
  modifiedBy?: Schema.Types.ObjectId
  deletedBy?: Schema.Types.ObjectId
  mod_flag: boolean
  del_flag: boolean
}

const ProductSchema: Schema<IProduct> = new Schema({
  organizationId: {
    type: Schema.Types.ObjectId,
    ref: "Organization",
    required: true,
    index: true
  },
  sku: {
    type: String,
    required: true,
    uppercase: true,
    trim: true
  },
  barcode: {
    type: String,
    trim: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: String,
  categoryId: {
    type: Schema.Types.ObjectId,
    ref: "ProductCategory"
  },
  type: {
    type: String,
    enum: ["product", "service"],
    default: "product"
  },
  
  // Pricing
  costPrice: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  },
  sellingPrice: {
    type: Number,
    required: true,
    min: 0
  },
  margin: Number,
  taxable: {
    type: Boolean,
    default: true
  },
  taxRate: {
    type: Number,
    min: 0,
    max: 100
  },
  
  // Inventory
  trackInventory: {
    type: Boolean,
    default: true
  },
  currentStock: {
    type: Number,
    default: 0,
    min: 0
  },
  reorderLevel: {
    type: Number,
    default: 20,
    min: 0
  },
  reorderQuantity: {
    type: Number,
    min: 0
  },
  unit: {
    type: String,
    default: "pcs"
  },
  
  // Images
  images: [String],
  primaryImage: String,
  
  // Status
  status: {
    type: String,
    enum: ["active", "inactive", "discontinued"],
    default: "active"
  },
  
  // Accounting
  inventoryAccountId: {
    type: Schema.Types.ObjectId,
    ref: "Account"
  },
  cogsAccountId: {
    type: Schema.Types.ObjectId,
    ref: "Account"
  },
  revenueAccountId: {
    type: Schema.Types.ObjectId,
    ref: "Account"
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

// Compound indexes for multi-tenancy and performance
ProductSchema.index({ organizationId: 1, sku: 1 }, { unique: true })
ProductSchema.index({ organizationId: 1, del_flag: 1, status: 1 })
ProductSchema.index({ organizationId: 1, categoryId: 1 })
ProductSchema.index({ organizationId: 1, currentStock: 1 })

type ProductModel = Model<IProduct>

const Product: ProductModel = models.Product ?? model<IProduct>("Product", ProductSchema)

export default Product
