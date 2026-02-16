"use client"

import { motion } from "framer-motion"
import { Shield, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { MagicLinkForm } from "./_components/magic-link-form"

export default function MagicLinkLoginPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md"
            >
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-200 dark:border-gray-700">
                    <div className="text-center mb-8">
                        <div className="flex items-center justify-center mb-4">
                            <Shield className="h-8 w-8 text-cyan-600 dark:text-cyan-400" />
                        </div>
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Magic Link</h2>
                        <p className="text-gray-600 dark:text-gray-400 mt-2">
                            Sign in without a password
                        </p>
                    </div>

                    <MagicLinkForm className="space-y-6" />

                    <div className="mt-8 text-center">
                        <Link 
                            href="/login" 
                            className="inline-flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors"
                        >
                            <ArrowLeft className="h-4 w-4 mr-1" />
                            Back to login
                        </Link>
                    </div>
                </div>
            </motion.div>
        </div>
    )
}