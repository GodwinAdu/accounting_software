import { Model, model, models, Schema } from "mongoose"

export interface IStockAdjustment {
  _id?: string
  organizationId: Schema.Types.ObjectId
  productId: Schema.Types.ObjectId
  type: "increase" | "decrease"
  quantity: number
  reason: string
  notes?: string
  
  // Stock levels at time of adjustment
  previousStock: number
  newStock: number
  
  // Audit fields
  createdBy: Schema.Types.ObjectId
  modifiedBy?: Schema.Types.ObjectId
  deletedBy?: Schema.Types.ObjectId
  mod_flag: boolean
  del_flag: boolean
}

const StockAdjustmentSchema: Schema<IStockAdjustment> = new Schema({
  organizationId: {
    type: Schema.Types.ObjectId,
    ref: "Organization",
    required: true,
    index: true
  },
  productId: {
    type: Schema.Types.ObjectId,
    ref: "Product",
    required: true,
    index: true
  },
  type: {
    type: String,
    enum: ["increase", "decrease"],
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 0
  },
  reason: {
    type: String,
    required: true
  },
  notes: String,
  
  // Stock levels
  previousStock: {
    type: Number,
    required: true
  },
  newStock: {
    type: Number,
    required: true
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
StockAdjustmentSchema.index({ organizationId: 1, productId: 1, createdAt: -1 })
StockAdjustmentSchema.index({ organizationId: 1, del_flag: 1 })

type StockAdjustmentModel = Model<IStockAdjustment>

const StockAdjustment: StockAdjustmentModel = models.StockAdjustment ?? model<IStockAdjustment>("StockAdjustment", StockAdjustmentSchema)

export default StockAdjustment
