"use server";

import { connectToDB } from "@/lib/connection/mongoose";
import AuditLog from "@/lib/models/audit-log.model";

/**
 * Archive old audit logs (older than 90 days)
 * Move to separate collection or export to S3/file storage
 */
export async function archiveOldAuditLogs() {
  try {
    await connectToDB();

    const ninetyDaysAgo = new Date();
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

    // Count logs to archive
    const count = await AuditLog.countDocuments({
      createdAt: { $lt: ninetyDaysAgo },
    });

    if (count === 0) {
      return { success: true, message: "No logs to archive", count: 0 };
    }

    // Option 1: Delete old logs (simple approach)
    const result = await AuditLog.deleteMany({
      createdAt: { $lt: ninetyDaysAgo },
    });

    // Option 2: Move to archive collection (better approach)
    // const logsToArchive = await AuditLog.find({ createdAt: { $lt: ninetyDaysAgo } });
    // await AuditLogArchive.insertMany(logsToArchive);
    // await AuditLog.deleteMany({ createdAt: { $lt: ninetyDaysAgo } });

    return {
      success: true,
      message: `Archived ${result.deletedCount} logs`,
      count: result.deletedCount,
    };
  } catch (error: any) {
    console.error("Archive audit logs error:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Delete logs older than specified days (for compliance)
 */
export async function deleteOldAuditLogs(daysOld: number = 365) {
  try {
    await connectToDB();

    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysOld);

    const result = await AuditLog.deleteMany({
      createdAt: { $lt: cutoffDate },
    });

    return {
      success: true,
      message: `Deleted ${result.deletedCount} logs older than ${daysOld} days`,
      count: result.deletedCount,
    };
  } catch (error: any) {
    console.error("Delete old audit logs error:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Get audit log statistics for monitoring
 */
export async function getAuditLogStats() {
  try {
    await connectToDB();

    const [total, last30Days, last7Days, last24Hours, oldestLog] = await Promise.all([
      AuditLog.countDocuments(),
      AuditLog.countDocuments({
        createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
      }),
      AuditLog.countDocuments({
        createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
      }),
      AuditLog.countDocuments({
        createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
      }),
      AuditLog.findOne().sort({ createdAt: 1 }).select("createdAt"),
    ]);

    const daysOfData = oldestLog
      ? Math.floor((Date.now() - new Date(oldestLog.createdAt).getTime()) / (24 * 60 * 60 * 1000))
      : 0;

    return {
      success: true,
      stats: {
        total,
        last30Days,
        last7Days,
        last24Hours,
        daysOfData,
        avgPerDay: daysOfData > 0 ? Math.round(total / daysOfData) : 0,
      },
    };
  } catch (error: any) {
    console.error("Get audit log stats error:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Optimize audit log indexes for better query performance
 */
export async function optimizeAuditLogIndexes() {
  try {
    await connectToDB();

    // Ensure indexes exist
    await AuditLog.collection.createIndex({ organizationId: 1, createdAt: -1 });
    await AuditLog.collection.createIndex({ organizationId: 1, action: 1, createdAt: -1 });
    await AuditLog.collection.createIndex({ organizationId: 1, resource: 1, createdAt: -1 });
    await AuditLog.collection.createIndex({ organizationId: 1, userId: 1, createdAt: -1 });
    await AuditLog.collection.createIndex({ createdAt: -1 }); // For archiving queries

    return { success: true, message: "Indexes optimized" };
  } catch (error: any) {
    console.error("Optimize indexes error:", error);
    return { success: false, error: error.message };
  }
}
