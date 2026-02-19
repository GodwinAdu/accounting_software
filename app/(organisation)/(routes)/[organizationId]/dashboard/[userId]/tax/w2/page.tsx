"use client";

import { useState, useEffect } from "react";
import { FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/table/data-table";
import { columns } from "./_components/columns";
import Heading from "@/components/commons/Header";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getEmployeeTaxCertificates } from "@/lib/actions/tax-certificate.action";
import { toast } from "sonner";

export default function W2Page() {
  const [forms, setForms] = useState<any[]>([]);
  const [year, setYear] = useState("2024");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCertificates();
  }, [year]);

  const fetchCertificates = async () => {
    setLoading(true);
    const result = await getEmployeeTaxCertificates(parseInt(year));
    if (result.error) {
      toast.error(result.error);
    } else {
      setForms(result.data || []);
    }
    setLoading(false);
  };

  const totalGross = forms.reduce((sum, f) => sum + f.grossPay, 0);
  const totalTax = forms.reduce((sum, f) => sum + f.taxPaid, 0);
  const totalSSNIT = forms.reduce((sum, f) => sum + f.ssnit, 0);

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between">
        <Heading
          title="P9 Forms (Annual Tax Certificates)"
          description="Generate and manage employee annual tax certificates"
        />
        <div className="flex gap-3">
          <Select value={year} onValueChange={setYear}>
            <SelectTrigger className="w-[150px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2024">2024</SelectItem>
              <SelectItem value="2023">2023</SelectItem>
              <SelectItem value="2022">2022</SelectItem>
            </SelectContent>
          </Select>
          <Button className="bg-emerald-600 hover:bg-emerald-700">
            <FileText className="mr-2 h-4 w-4" />
            Generate All P9s
          </Button>
        </div>
      </div>
      <Separator />

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-lg border bg-card p-6">
          <div className="flex flex-col space-y-1.5">
            <p className="text-sm font-medium text-muted-foreground">Total Gross Pay</p>
            <p className="text-2xl font-bold">GHS {totalGross.toLocaleString()}</p>
          </div>
        </div>
        <div className="rounded-lg border bg-card p-6">
          <div className="flex flex-col space-y-1.5">
            <p className="text-sm font-medium text-muted-foreground">Total PAYE Tax</p>
            <p className="text-2xl font-bold text-red-600">GHS {totalTax.toLocaleString()}</p>
          </div>
        </div>
        <div className="rounded-lg border bg-card p-6">
          <div className="flex flex-col space-y-1.5">
            <p className="text-sm font-medium text-muted-foreground">Total SSNIT</p>
            <p className="text-2xl font-bold text-blue-600">GHS {totalSSNIT.toLocaleString()}</p>
          </div>
        </div>
      </div>

      <div className="rounded-lg border bg-blue-50 p-4">
        <div className="flex items-start gap-3">
          <FileText className="h-5 w-5 text-blue-600 mt-0.5" />
          <div>
            <h4 className="font-medium text-blue-900">P9 Form Information</h4>
            <p className="text-sm text-blue-700 mt-1">
              P9 forms (Annual Tax Certificates) must be issued to all employees by January 31st following the tax year.
              These forms show total earnings, PAYE tax deducted, and SSNIT contributions for the year.
            </p>
          </div>
        </div>
      </div>

      <DataTable columns={columns} data={forms} loading={loading} />
    </div>
  );
}
