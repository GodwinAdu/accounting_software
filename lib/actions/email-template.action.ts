"use server"

import { withAuth, type User } from "../helpers/auth"
import EmailTemplate from "../models/email-template.model"
import { connectToDB } from "../connection/mongoose"
import mongoose from "mongoose"
import { logAudit } from "../helpers/audit"

async function _fetchEmailTemplates(user: User) {
  try {
    if (!user) throw new Error("User not authenticated")

    const organizationId = user.organizationId as string

    if (!organizationId) {
      throw new Error("User does not belong to any organization")
    }

    await connectToDB()

    const templates = await EmailTemplate.find({ organizationId }).sort({ createdAt: -1 })

    return { success: true, templates: JSON.parse(JSON.stringify(templates)) }
  } catch (error) {
    console.error("Fetch email templates error:", error)
    return { success: false, error: "Failed to fetch email templates" }
  }
}

export const fetchEmailTemplates = await withAuth(_fetchEmailTemplates)

async function _createEmailTemplate(
  user: User,
  data: {
    name: string
    type: string
    subject: string
    body: string
    variables?: string[]
    isActive?: boolean
  }
) {
  try {
    if (!user) throw new Error("User not authenticated")

    const organizationId = user.organizationId as string

    if (!organizationId) {
      throw new Error("User does not belong to any organization")
    }

    await connectToDB()

    const template = await EmailTemplate.create({
      organizationId,
      name: data.name,
      type: data.type,
      subject: data.subject,
      body: data.body,
      variables: data.variables || [],
      isActive: data.isActive ?? true,
      createdBy: new mongoose.Types.ObjectId(String(user._id || user.id)),
    })

    await logAudit({
      organizationId,
      userId: String(user._id || user.id),
      action: "create",
      resource: "email-template",
      resourceId: template._id.toString(),
      details: { after: data },
    })

    return { success: true, template: JSON.parse(JSON.stringify(template)) }
  } catch (error) {
    console.error("Create email template error:", error)
    return { success: false, error: "Failed to create email template" }
  }
}

export const createEmailTemplate = await withAuth(_createEmailTemplate)

async function _updateEmailTemplate(
  user: User,
  templateId: string,
  data: {
    name?: string
    type?: string
    subject?: string
    body?: string
    variables?: string[]
    isActive?: boolean
  }
) {
  try {
    if (!user) throw new Error("User not authenticated")

    const organizationId = user.organizationId as string

    if (!organizationId) {
      throw new Error("User does not belong to any organization")
    }

    await connectToDB()

    const before = await EmailTemplate.findOne({ _id: templateId, organizationId })

    const template = await EmailTemplate.findOneAndUpdate(
      { _id: templateId, organizationId },
      data,
      { new: true }
    )

    if (!template) {
      return { success: false, error: "Template not found" }
    }

    await logAudit({
      organizationId,
      userId: String(user._id || user.id),
      action: "update",
      resource: "email-template",
      resourceId: templateId,
      details: {
        before: JSON.parse(JSON.stringify(before)),
        after: data,
      },
    })

    return { success: true, template: JSON.parse(JSON.stringify(template)) }
  } catch (error) {
    console.error("Update email template error:", error)
    return { success: false, error: "Failed to update email template" }
  }
}

export const updateEmailTemplate = await withAuth(_updateEmailTemplate)

async function _deleteEmailTemplate(user: User, templateId: string) {
  try {
    if (!user) throw new Error("User not authenticated")

    const organizationId = user.organizationId as string

    if (!organizationId) {
      throw new Error("User does not belong to any organization")
    }

    await connectToDB()

    const template = await EmailTemplate.findOne({ _id: templateId, organizationId })

    if (!template) {
      return { success: false, error: "Template not found" }
    }

    await EmailTemplate.findOneAndDelete({ _id: templateId, organizationId })

    await logAudit({
      organizationId,
      userId: String(user._id || user.id),
      action: "delete",
      resource: "email-template",
      resourceId: templateId,
      details: { before: JSON.parse(JSON.stringify(template)) },
    })

    return { success: true }
  } catch (error) {
    console.error("Delete email template error:", error)
    return { success: false, error: "Failed to delete email template" }
  }
}

export const deleteEmailTemplate = await withAuth(_deleteEmailTemplate)

async function _fetchEmailTemplateById(user: User, templateId: string) {
  try {
    if (!user) throw new Error("User not authenticated")

    const organizationId = user.organizationId as string

    if (!organizationId) {
      throw new Error("User does not belong to any organization")
    }

    await connectToDB()

    const template = await EmailTemplate.findOne({ _id: templateId, organizationId })

    if (!template) {
      return { success: false, error: "Template not found" }
    }

    return { success: true, template: JSON.parse(JSON.stringify(template)) }
  } catch (error) {
    console.error("Fetch email template error:", error)
    return { success: false, error: "Failed to fetch email template" }
  }
}

export const fetchEmailTemplateById = await withAuth(_fetchEmailTemplateById)
