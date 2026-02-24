"use server"

import { revalidatePath } from "next/cache"
import { connectToDB } from "../connection/mongoose"
import Product from "../models/product.model"
import { withAuth, type User } from "../helpers/auth"
import { checkPermission } from "../helpers/check-permission"

async function _getReorderAlerts(user: User) {
  try {
    const hasPermission = await checkPermission("reorderAlerts_view")
    if (!hasPermission) {
      return { error: "You don't have permission to view reorder alerts" }
    }

    await connectToDB()

    const products = await Product.find({ 
      organizationId: user.organizationId, 
      del_flag: false,
      trackInventory: true,
      status: "active"
    }).lean()

    const alerts: any[] = []

    products.forEach(product => {
      if (product.hasVariants && product.variants && product.variants.length > 0) {
        // Check each variant
        product.variants.forEach(variant => {
          const stock = variant.stock || 0
          const reorderLevel = product.reorderLevel
          
          if (stock <= reorderLevel) {
            alerts.push({
              ...product,
              _id: `${product._id}_${variant.sku}`,
              productId: product._id,
              variantSku: variant.sku,
              variantName: variant.name,
              name: `${product.name} - ${variant.name}`,
              sku: variant.sku,
              currentStock: stock,
              costPrice: variant.costPrice,
              sellingPrice: variant.sellingPrice,
              isVariant: true
            })
          }
        })
      } else {
        // Regular product
        if (product.currentStock <= product.reorderLevel) {
          alerts.push({
            ...product,
            isVariant: false
          })
        }
      }
    })

    const lowStockProducts = alerts.filter(p => p.currentStock <= p.reorderLevel && p.currentStock > 0)
    const outOfStockProducts = alerts.filter(p => p.currentStock === 0)
    const criticalProducts = alerts.filter(p => p.currentStock < p.reorderLevel * 0.5)

    return { 
      success: true, 
      data: {
        products: JSON.parse(JSON.stringify(products)),
        lowStockProducts: JSON.parse(JSON.stringify(lowStockProducts)),
        outOfStockProducts: JSON.parse(JSON.stringify(outOfStockProducts)),
        criticalProducts: JSON.parse(JSON.stringify(criticalProducts)),
        totalAlerts: lowStockProducts.length + outOfStockProducts.length
      }
    }
  } catch (error: any) {
    console.error("Get reorder alerts error:", error)
    return { error: error.message || "Failed to fetch reorder alerts" }
  }
}

export const getReorderAlerts = await withAuth(_getReorderAlerts)
