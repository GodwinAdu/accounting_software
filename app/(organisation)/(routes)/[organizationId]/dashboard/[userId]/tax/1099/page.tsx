"use client";

import { useState, useEffect } from "react";
import { FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/table/data-table";
import { columns } from "./_components/columns";
import Heading from "@/components/commons/Header";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getContractorTaxCertificates } from "@/lib/actions/tax-certificate.action";
import { toast } from "sonner";

export default function Form1099Page() {
  const [forms, setForms] = useState<any[]>([]);
  const [year, setYear] = useState("2024");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCertificates();
  }, [year]);

  const fetchCertificates = async () => {
    setLoading(true);
    const result = await getContractorTaxCertificates(parseInt(year));
    if (result.error) {
      toast.error(result.error);
    } else {
      setForms(result.data || []);
    }
    setLoading(false);
  };

  const totalPayments = forms.reduce((sum, f) => sum + f.totalPayments, 0);
  const totalWHT = forms.reduce((sum, f) => sum + f.whtDeducted, 0);

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between">
        <Heading
          title="Contractor Tax Certificates"
          description="Manage withholding tax certificates for contractors and vendors"
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
            Generate All Certificates
          </Button>
        </div>
      </div>
      <Separator />

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-lg border bg-card p-6">
          <div className="flex flex-col space-y-1.5">
            <p className="text-sm font-medium text-muted-foreground">Total Contractors</p>
            <p className="text-2xl font-bold">{forms.length}</p>
          </div>
        </div>
        <div className="rounded-lg border bg-card p-6">
          <div className="flex flex-col space-y-1.5">
            <p className="text-sm font-medium text-muted-foreground">Total Payments</p>
            <p className="text-2xl font-bold">GHS {totalPayments.toLocaleString()}</p>
          </div>
        </div>
        <div className="rounded-lg border bg-card p-6">
          <div className="flex flex-col space-y-1.5">
            <p className="text-sm font-medium text-muted-foreground">Total WHT Deducted</p>
            <p className="text-2xl font-bold text-red-600">GHS {totalWHT.toLocaleString()}</p>
          </div>
        </div>
      </div>

      <div className="rounded-lg border bg-blue-50 p-4">
        <div className="flex items-start gap-3">
          <FileText className="h-5 w-5 text-blue-600 mt-0.5" />
          <div>
            <h4 className="font-medium text-blue-900">Withholding Tax Information</h4>
            <p className="text-sm text-blue-700 mt-1">
              Withholding tax certificates must be issued to contractors and service providers showing payments made and tax withheld.
              Standard WHT rates: Services (7.5%), Goods (3%), Professional Services (15%).
              Certificates must be filed with GRA by January 31st.
            </p>
          </div>
        </div>
      </div>

      <DataTable columns={columns} data={forms} loading={loading} />
    </div>
  );
}
