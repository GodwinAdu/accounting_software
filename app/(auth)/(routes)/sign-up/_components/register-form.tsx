"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Building2, CheckCircle2, ChevronLeft, ChevronRight, Eye, EyeOff, Loader2, User, Lock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import Link from "next/link"
import { toast } from "sonner"
import { registerOrganization } from "@/lib/actions/organization.action"

const companyInfoSchema = z.object({
    name: z.string().min(2, "Company name required"),
    email: z.string().email("Valid email required"),
    phone: z.string().min(5, "Phone required"),
    taxId: z.string().optional(),
    address: z.object({
        street: z.string().min(2, "Street required"),
        city: z.string().min(2, "City required"),
        state: z.string().min(2, "State required"),
        zipCode: z.string().min(2, "Zip required"),
        country: z.string().default("USA"),
    }),
})

const adminInfoSchema = z.object({
    fullName: z.string().min(2, "Name required"),
    email: z.string().email("Valid email required"),
    password: z.string().min(8, "Min 8 characters")
        .regex(/[A-Z]/, "Need uppercase")
        .regex(/[a-z]/, "Need lowercase")
        .regex(/[0-9]/, "Need number"),
    confirmPassword: z.string(),
    phone: z.string().min(5, "Phone required"),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
})

const planSchema = z.object({
    plan: z.enum(["starter", "professional", "enterprise"]),
    modules: z.object({
        dashboard: z.boolean().default(true),
        banking: z.boolean().default(true),
        sales: z.boolean().default(false),
        expenses: z.boolean().default(false),
        payroll: z.boolean().default(false),
        accounting: z.boolean().default(true),
        tax: z.boolean().default(false),
        products: z.boolean().default(false),
        reports: z.boolean().default(true),
        settings: z.boolean().default(true),
        projects: z.boolean().default(false),
        crm: z.boolean().default(false),
        budgeting: z.boolean().default(false),
        assets: z.boolean().default(false),
        ai: z.boolean().default(false),
    }),
    acceptTerms: z.literal(true),
})

type CompanyInfoValues = z.infer<typeof companyInfoSchema>
type AdminInfoValues = z.infer<typeof adminInfoSchema>
type PlanValues = z.infer<typeof planSchema>

const MODULE_PRICING = {
    sales: 30,
    expenses: 25,
    payroll: 50,
    tax: 35,
    products: 20,
}

const BASE_PRICING = {
    starter: 150,
    professional: 400,
    enterprise: 0, // Custom
}

export default function RegistrationForm() {
    const router = useRouter()
    const [step, setStep] = useState(1)
    const [formData, setFormData] = useState<CompanyInfoValues & AdminInfoValues & PlanValues>({
        name: "", email: "", phone: "", taxId: "",
        address: { street: "", city: "", state: "", zipCode: "", country: "USA" },
        fullName: "", password: "", confirmPassword: "",
        plan: "starter",
        modules: {
            dashboard: true,
            banking: true,
            sales: false,
            expenses: false,
            payroll: false,
            accounting: true,
            tax: false,
            products: false,
            reports: true,
            settings: true,
            projects: false,
            crm: false,
            budgeting: false,
            assets: false,
            ai: false,
        },
        acceptTerms: false,
    })
    const [showPassword, setShowPassword] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const companyForm = useForm<CompanyInfoValues>({
        resolver: zodResolver(companyInfoSchema),
        defaultValues: formData,
    })

    const adminForm = useForm<AdminInfoValues>({
        resolver: zodResolver(adminInfoSchema),
        defaultValues: formData,
    })

    const planForm = useForm<PlanValues>({
        resolver: zodResolver(planSchema),
        defaultValues: { plan: formData.plan, modules: formData.modules, acceptTerms: formData.acceptTerms },
    })

    const selectedPlan = planForm.watch("plan")
    const selectedModules = planForm.watch("modules")

    const calculateTotal = () => {
        if (selectedPlan === "enterprise") return "Custom"
        let total = BASE_PRICING[selectedPlan]
        Object.entries(selectedModules).forEach(([key, enabled]) => {
            if (enabled && MODULE_PRICING[key as keyof typeof MODULE_PRICING]) {
                total += MODULE_PRICING[key as keyof typeof MODULE_PRICING]
            }
        })
        return `GHS ${total}`
    }

    const onCompanySubmit = (data: CompanyInfoValues) => {
        setFormData({ ...formData, ...data })
        setStep(2)
    }

    const onAdminSubmit = (data: AdminInfoValues) => {
        setFormData({ ...formData, ...data })
        setStep(3)
    }

    const onPlanSubmit = async (data: PlanValues) => {
        setIsSubmitting(true)
        try {
            const result = await registerOrganization({ ...formData, ...data })
            if (!result.success) {
                toast.error("Registration Failed", { description: result.error })
                return
            }
            toast.success("Registration Successful")
            setStep(4)
        } catch (error) {
            toast.error("Registration Failed")
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="space-y-6">
            <div className="text-center space-y-3">
                <div className="flex items-center justify-center h-16 w-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 mx-auto shadow-lg">
                    <Building2 className="h-8 w-8 text-white" />
                </div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">Create Your Account</h1>
                <p className="text-muted-foreground text-lg">Start your 14-day free trial • No credit card required</p>
            </div>

            {step < 4 && (
                <div className="relative">
                    <Progress value={(step / 3) * 100} className="h-2" />
                    <div className="absolute top-4 w-full flex justify-between">
                        {[{ icon: Building2, label: "Company" }, { icon: User, label: "Admin" }, { icon: Lock, label: "Plan" }].map((item, i) => (
                            <div key={i} className={`flex flex-col items-center ${step >= i + 1 ? "text-emerald-600" : "text-muted-foreground"}`}>
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= i + 1 ? "bg-emerald-600 text-white" : "bg-muted"}`}>
                                    <item.icon className="h-4 w-4" />
                                </div>
                                <span className="text-xs mt-1">{item.label}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <Card className="shadow-xl border-emerald-100 mt-16">
                <CardContent className="pt-12 pb-8">
                    {step === 1 && (
                        <Form {...companyForm}>
                            <form onSubmit={companyForm.handleSubmit(onCompanySubmit)} className="space-y-4">
                                <div className="grid md:grid-cols-2 gap-4">
                                    <FormField control={companyForm.control} name="name" render={({ field }) => (
                                        <FormItem><FormLabel>Company Name*</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                                    )} />
                                    <FormField control={companyForm.control} name="email" render={({ field }) => (
                                        <FormItem><FormLabel>Company Email*</FormLabel><FormControl><Input type="email" {...field} /></FormControl><FormMessage /></FormItem>
                                    )} />
                                    <FormField control={companyForm.control} name="phone" render={({ field }) => (
                                        <FormItem><FormLabel>Phone*</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                                    )} />
                                    <FormField control={companyForm.control} name="taxId" render={({ field }) => (
                                        <FormItem><FormLabel>Tax ID (EIN)</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                                    )} />
                                </div>
                                <FormField control={companyForm.control} name="address.street" render={({ field }) => (
                                    <FormItem><FormLabel>Street*</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                                )} />
                                <div className="grid md:grid-cols-3 gap-4">
                                    <FormField control={companyForm.control} name="address.city" render={({ field }) => (
                                        <FormItem><FormLabel>City*</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                                    )} />
                                    <FormField control={companyForm.control} name="address.state" render={({ field }) => (
                                        <FormItem><FormLabel>State*</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                                    )} />
                                    <FormField control={companyForm.control} name="address.zipCode" render={({ field }) => (
                                        <FormItem><FormLabel>Zip*</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                                    )} />
                                </div>
                                <Button type="submit" className="w-full">Continue <ChevronRight className="ml-2 h-4 w-4" /></Button>
                            </form>
                        </Form>
                    )}

                    {step === 2 && (
                        <Form {...adminForm}>
                            <form onSubmit={adminForm.handleSubmit(onAdminSubmit)} className="space-y-4">
                                <div className="grid md:grid-cols-2 gap-4">
                                    <FormField control={adminForm.control} name="fullName" render={({ field }) => (
                                        <FormItem><FormLabel>Full Name*</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                                    )} />
                                    <FormField control={adminForm.control} name="email" render={({ field }) => (
                                        <FormItem><FormLabel>Email*</FormLabel><FormControl><Input type="email" {...field} /></FormControl><FormMessage /></FormItem>
                                    )} />
                                    <FormField control={adminForm.control} name="phone" render={({ field }) => (
                                        <FormItem><FormLabel>Phone*</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                                    )} />
                                </div>
                                <FormField control={adminForm.control} name="password" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Password*</FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <Input type={showPassword ? "text" : "password"} {...field} />
                                                <Button type="button" variant="ghost" size="sm" className="absolute right-0 top-0 h-full" onClick={() => setShowPassword(!showPassword)}>
                                                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                                </Button>
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                                <FormField control={adminForm.control} name="confirmPassword" render={({ field }) => (
                                    <FormItem><FormLabel>Confirm Password*</FormLabel><FormControl><Input type="password" {...field} /></FormControl><FormMessage /></FormItem>
                                )} />
                                <div className="flex justify-between">
                                    <Button type="button" variant="outline" onClick={() => setStep(1)}><ChevronLeft className="mr-2 h-4 w-4" /> Back</Button>
                                    <Button type="submit">Continue <ChevronRight className="ml-2 h-4 w-4" /></Button>
                                </div>
                            </form>
                        </Form>
                    )}

                    {step === 3 && (
                        <Form {...planForm}>
                            <form onSubmit={planForm.handleSubmit(onPlanSubmit)} className="space-y-6">
                                <FormField control={planForm.control} name="plan" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-lg font-semibold">Select Base Plan</FormLabel>
                                        <FormControl>
                                            <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="grid md:grid-cols-3 gap-4">
                                                {[
                                                    { value: "starter", label: "Starter", price: "GHS 150/mo", desc: "Up to 10 employees" },
                                                    { value: "professional", label: "Professional", price: "GHS 400/mo", desc: "Up to 100 employees" },
                                                    { value: "enterprise", label: "Enterprise", price: "Custom", desc: "Unlimited employees" },
                                                ].map((plan) => (
                                                    <FormItem key={plan.value} className="flex items-center space-x-3 space-y-0">
                                                        <FormControl><RadioGroupItem value={plan.value} /></FormControl>
                                                        <div className="flex-1 p-4 border rounded-lg hover:border-emerald-500 transition-colors">
                                                            <FormLabel className="font-semibold text-base cursor-pointer">{plan.label}</FormLabel>
                                                            <p className="text-emerald-600 font-medium">{plan.price}</p>
                                                            <p className="text-sm text-muted-foreground">{plan.desc}</p>
                                                        </div>
                                                    </FormItem>
                                                ))}
                                            </RadioGroup>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />

                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <FormLabel className="text-lg font-semibold">Select Modules</FormLabel>
                                        <span className="text-sm text-muted-foreground">Core modules included</span>
                                    </div>
                                    <div className="grid md:grid-cols-2 gap-3">
                                        {[
                                            { key: "dashboard", label: "Dashboard", price: 0, core: true },
                                            { key: "banking", label: "Banking", price: 0, core: true },
                                            { key: "accounting", label: "Accounting", price: 0, core: true },
                                            { key: "reports", label: "Reports", price: 0, core: true },
                                            { key: "settings", label: "Settings", price: 0, core: true },
                                            { key: "sales", label: "Sales & Invoicing", price: 30 },
                                            { key: "expenses", label: "Expenses & Bills", price: 25 },
                                            { key: "payroll", label: "Payroll", price: 50 },
                                            { key: "tax", label: "Tax Management", price: 35 },
                                            { key: "products", label: "Products & Services", price: 20 },
                                            { key: "projects", label: "Projects", price: 25 },
                                            { key: "crm", label: "CRM", price: 30 },
                                            { key: "budgeting", label: "Budgeting", price: 40 },
                                            { key: "assets", label: "Fixed Assets", price: 20 },
                                            { key: "ai", label: "AI Assistant", price: 50 },
                                        ].map((module) => (
                                            <FormField key={module.key} control={planForm.control} name={`modules.${module.key}` as any} render={({ field }) => (
                                                <FormItem className={`flex items-center space-x-3 space-y-0 border rounded-lg p-4 ${module.core ? 'bg-emerald-50/50 border-emerald-200' : 'hover:border-emerald-300'}`}>
                                                    <FormControl>
                                                        <Checkbox 
                                                            checked={field.value} 
                                                            onCheckedChange={field.onChange}
                                                            disabled={module.core}
                                                        />
                                                    </FormControl>
                                                    <div className="flex-1">
                                                        <FormLabel className={`font-medium cursor-pointer ${module.core ? 'text-emerald-700' : ''}`}>
                                                            {module.label}
                                                            {module.core && <span className="ml-2 text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded">Core</span>}
                                                        </FormLabel>
                                                        <p className="text-sm text-muted-foreground">
                                                            {module.price === 0 ? 'Included' : `+GHS ${module.price}/mo`}
                                                        </p>
                                                    </div>
                                                </FormItem>
                                            )} />
                                        ))}
                                    </div>
                                </div>

                                <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-lg p-6">
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <p className="text-sm text-muted-foreground">Total Monthly Cost</p>
                                            <p className="text-3xl font-bold text-emerald-600">{calculateTotal()}<span className="text-lg">/mo</span></p>
                                        </div>
                                        <div className="text-right text-sm text-muted-foreground">
                                            <p>14-day free trial</p>
                                            <p>Cancel anytime</p>
                                        </div>
                                    </div>
                                </div>

                                <FormField control={planForm.control} name="acceptTerms" render={({ field }) => (
                                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 border p-4 rounded-md">
                                        <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                                        <FormLabel>I accept the <Link href="/terms" className="text-emerald-600 underline">Terms</Link> and <Link href="/privacy" className="text-emerald-600 underline">Privacy Policy</Link></FormLabel>
                                    </FormItem>
                                )} />
                                <div className="flex justify-between">
                                    <Button type="button" variant="outline" onClick={() => setStep(2)}><ChevronLeft className="mr-2 h-4 w-4" /> Back</Button>
                                    <Button type="submit" disabled={isSubmitting || !planForm.watch("acceptTerms")}>
                                        {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Processing</> : "Complete Registration"}
                                    </Button>
                                </div>
                            </form>
                        </Form>
                    )}

                    {step === 4 && (
                        <div className="text-center space-y-6 py-6">
                            <div className="w-20 h-20 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto">
                                <CheckCircle2 className="h-10 w-10 text-emerald-600" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold">Registration Complete!</h3>
                                <p className="text-muted-foreground mt-2">Your account is ready to use</p>
                            </div>
                            <div className="bg-muted/50 rounded-lg p-6 max-w-md mx-auto text-left space-y-2">
                                <div className="flex justify-between"><span className="text-muted-foreground">Company:</span><span className="font-medium">{formData.name}</span></div>
                                <div className="flex justify-between"><span className="text-muted-foreground">Email:</span><span className="font-medium">{formData.email}</span></div>
                                <div className="flex justify-between"><span className="text-muted-foreground">Plan:</span><span className="font-medium capitalize">{formData.plan}</span></div>
                            </div>
                            <Button onClick={() => router.push("/sign-in")} className="w-full">Go to Sign In</Button>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
