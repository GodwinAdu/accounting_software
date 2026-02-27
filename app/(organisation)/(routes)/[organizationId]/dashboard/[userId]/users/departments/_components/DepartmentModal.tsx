"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { PlusCircle, Edit } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createDepartment, updateDepartment } from "@/lib/actions/department.action";
import { useState, useEffect } from "react";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "name must be at least 2 characters.",
  }),
});

interface DepartmentModalProps {
  department?: { _id: string; name: string } | null;
  trigger?: React.ReactNode;
}

export function DepartmentModal({ department, trigger }: DepartmentModalProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const isEdit = !!department;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: department?.name || "",
    },
  });

  useEffect(() => {
    if (department) {
      form.reset({ name: department.name });
    }
  }, [department, form]);

  const { isSubmitting } = form.formState;

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      if (isEdit && department) {
        await updateDepartment(department._id, values);
        toast.success("Department updated successfully!");
      } else {
        await createDepartment(values);
        toast.success("Department created successfully!");
      }
      router.refresh();
      form.reset();
      setOpen(false);
    } catch (error) {
      console.log("error happened", error);
      toast.error(`Failed to ${isEdit ? "update" : "create"} department. Please try again.`);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className={cn(buttonVariants())}>
            <PlusCircle className="w-4 h-4 mr-2" />
            Add
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] w-[96%]">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit" : "Create"} Department</DialogTitle>
          <DialogDescription>
            {isEdit ? "Update department information" : "Add a new department to your organization"}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Department Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g. Finance, HR, Sales, IT"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button disabled={isSubmitting} type="submit">
                {isSubmitting ? (isEdit ? "Updating..." : "Creating...") : (isEdit ? "Update" : "Create")}
              </Button>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}