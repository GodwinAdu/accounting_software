"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Upload, FileText, Loader2, CheckCircle, Sparkles, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { extractInvoiceData } from "@/lib/actions/ai.action";
import { toast } from "sonner";
import Heading from "@/components/commons/Header";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function InvoiceOCRPage() {
  const params = useParams();
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isConverting, setIsConverting] = useState(false);
  const [extractedData, setExtractedData] = useState<any>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    if (selectedFile.size > 10 * 1024 * 1024) {
      toast.error("File size exceeds 10MB limit");
      return;
    }
    
    const fileType = selectedFile.type;
    if (!fileType.startsWith('image/') && fileType !== 'application/pdf') {
      toast.error("Please upload an image or PDF file");
      return;
    }

    setFile(selectedFile);
    setExtractedData(null);
    
    if (fileType === 'application/pdf') {
      setIsConverting(true);
      try {
        const pdfjsLib = await import('pdfjs-dist');
        pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf-worker/pdf.worker.min.mjs';
        
        const arrayBuffer = await selectedFile.arrayBuffer();
        const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
        const pdf = await loadingTask.promise;
        const page = await pdf.getPage(1);
        const viewport = page.getViewport({ scale: 2.5 });
        
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        if (!context) throw new Error('Canvas context not available');
        
        canvas.height = viewport.height;
        canvas.width = viewport.width;
        
        await page.render({ canvasContext: context, viewport }).promise;
        const imageData = canvas.toDataURL('image/jpeg', 0.95);
        setPreview(imageData);
        toast.success("PDF processed successfully");
      } catch (error: any) {
        console.error('PDF processing error:', error);
        toast.error(error.message || "Unable to process PDF file");
        setFile(null);
        setPreview("");
      } finally {
        setIsConverting(false);
      }
    } else {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.onerror = () => {
        toast.error("Failed to read file");
        setFile(null);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleExtract = async () => {
    if (!preview) return;

    setIsProcessing(true);
    try {
      const base64 = preview.split(",")[1];
      if (!base64) throw new Error("Invalid image data");
      
      const result = await extractInvoiceData(base64);

      if (result.success && result.data) {
        setExtractedData(result.data);
        toast.success("Invoice data extracted successfully");
      } else {
        toast.error(result.error || "Unable to extract invoice data");
      }
    } catch (error: any) {
      console.error('Extraction error:', error);
      toast.error(error.message || "An error occurred during extraction");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setPreview("");
    setExtractedData(null);
  };

  const handleCreateExpense = () => {
    if (!extractedData) return;
    const data = encodeURIComponent(JSON.stringify({
      vendor: extractedData.vendor,
      amount: extractedData.amount,
      date: extractedData.date,
      description: `Invoice ${extractedData.invoiceNumber || ''}`,
      tax: extractedData.tax
    }));
    router.push(`/${params.organizationId}/dashboard/${params.userId}/expenses/all/new?ocr=${data}`);
  };

  const handleCreateBill = () => {
    if (!extractedData) return;
    const data = encodeURIComponent(JSON.stringify({
      vendor: extractedData.vendor,
      amount: extractedData.amount,
      date: extractedData.date,
      invoiceNumber: extractedData.invoiceNumber,
      items: extractedData.items,
      tax: extractedData.tax
    }));
    router.push(`/${params.organizationId}/dashboard/${params.userId}/expenses/bills/new?ocr=${data}`);
  };

  const getConfidenceBadge = (confidence: string) => {
    const colors = {
      high: "bg-emerald-100 text-emerald-700",
      medium: "bg-amber-100 text-amber-700",
      low: "bg-red-100 text-red-700",
    };
    return colors[confidence as keyof typeof colors] || colors.medium;
  };

  return (
    <div className="space-y-6">
      <Heading
        title="Invoice OCR"
        description="Extract data from invoice images automatically"
      />
      <Separator />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5 text-purple-600" />
              Upload Invoice
            </CardTitle>
            <CardDescription>
              Upload an image or PDF of your invoice
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {isConverting ? (
              <div className="flex flex-col items-center justify-center py-16 space-y-4">
                <Loader2 className="h-12 w-12 animate-spin text-purple-600" />
                <p className="text-sm text-muted-foreground">Processing PDF document...</p>
              </div>
            ) : !preview ? (
              <div>
                <label htmlFor="file-upload" className="cursor-pointer">
                  <div className="border-2 border-dashed rounded-lg p-12 text-center hover:border-purple-400 hover:bg-purple-50/50 transition-all">
                    <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-sm font-medium mb-2">
                      Upload Invoice or Receipt
                    </p>
                    <p className="text-xs text-muted-foreground mb-4">
                      Supports PNG, JPG, JPEG, PDF (Max 10MB)
                    </p>
                    <div className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-md text-sm font-medium hover:bg-purple-700 transition-colors">
                      Choose File
                    </div>
                  </div>
                </label>
                <Input
                  id="file-upload"
                  type="file"
                  accept="image/png,image/jpeg,image/jpg,application/pdf"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <Alert className="mt-4">
                  <AlertDescription className="text-xs">
                    AI will automatically extract vendor, amount, date, items, and tax information from your document.
                  </AlertDescription>
                </Alert>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="relative rounded-lg overflow-hidden border bg-muted/30">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 z-10 bg-background/80 backdrop-blur-sm"
                    onClick={handleReset}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                  <img
                    src={preview}
                    alt="Document preview"
                    className="w-full h-auto max-h-96 object-contain"
                  />
                </div>
                <Button
                  onClick={handleExtract}
                  disabled={isProcessing}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                  size="lg"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Extracting Data...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4 mr-2" />
                      Extract Invoice Data
                    </>
                  )}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-purple-600" />
              Extracted Data
            </CardTitle>
            <CardDescription>
              AI-extracted invoice information
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!extractedData ? (
              <div className="text-center py-16">
                <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4 opacity-50" />
                <p className="text-sm font-medium text-muted-foreground mb-1">
                  No Data Yet
                </p>
                <p className="text-xs text-muted-foreground">
                  Upload a document and extract to view results
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-4 border-b">
                  <Badge className={getConfidenceBadge(extractedData.confidence)} variant="secondary">
                    {extractedData.confidence?.toUpperCase()} CONFIDENCE
                  </Badge>
                  <CheckCircle className="h-5 w-5 text-emerald-600" />
                </div>

                <div className="space-y-4">
                  <div className="bg-muted/50 rounded-lg p-4">
                    <Label className="text-xs text-muted-foreground uppercase tracking-wide">Vendor Name</Label>
                    <p className="font-semibold text-lg mt-1">{extractedData.vendor || "Not detected"}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-emerald-50 dark:bg-emerald-950/20 rounded-lg p-4 border border-emerald-200 dark:border-emerald-900">
                      <Label className="text-xs text-emerald-700 dark:text-emerald-400 uppercase tracking-wide">Total Amount</Label>
                      <p className="font-bold text-2xl text-emerald-700 dark:text-emerald-400 mt-1">
                        GHS {extractedData.amount?.toLocaleString() || "0.00"}
                      </p>
                    </div>
                    <div className="bg-muted/50 rounded-lg p-4">
                      <Label className="text-xs text-muted-foreground uppercase tracking-wide">Tax Amount</Label>
                      <p className="font-semibold text-lg mt-1">
                        GHS {extractedData.tax?.toLocaleString() || "0.00"}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-muted/50 rounded-lg p-4">
                      <Label className="text-xs text-muted-foreground uppercase tracking-wide">Invoice Date</Label>
                      <p className="font-semibold mt-1">{extractedData.date || "Not detected"}</p>
                    </div>
                    <div className="bg-muted/50 rounded-lg p-4">
                      <Label className="text-xs text-muted-foreground uppercase tracking-wide">Invoice Number</Label>
                      <p className="font-semibold mt-1">{extractedData.invoiceNumber || "Not detected"}</p>
                    </div>
                  </div>

                  {extractedData.items && extractedData.items.length > 0 && (
                    <div>
                      <Label className="text-xs text-muted-foreground uppercase tracking-wide mb-3 block">Line Items</Label>
                      <div className="space-y-2">
                        {extractedData.items.map((item: any, index: number) => (
                          <div key={index} className="flex justify-between items-center text-sm p-3 bg-muted/50 rounded-lg border">
                            <div className="flex-1">
                              <p className="font-medium">{item.description || "Item"}</p>
                              <p className="text-xs text-muted-foreground">Qty: {item.quantity || 1}</p>
                            </div>
                            <span className="font-semibold">
                              GHS {item.price?.toLocaleString() || "0.00"}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <Separator />

                <div className="grid grid-cols-2 gap-3">
                  <Button onClick={handleCreateExpense} size="lg" className="w-full">
                    <FileText className="h-4 w-4 mr-2" />
                    Create Expense
                  </Button>
                  <Button onClick={handleCreateBill} size="lg" className="w-full">
                    <FileText className="h-4 w-4 mr-2" />
                    Create Bill
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 border-purple-200">
        <CardHeader>
          <CardTitle className="text-lg">How It Works</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center flex-shrink-0 font-bold">
                1
              </div>
              <div>
                <h4 className="font-semibold mb-1">Upload</h4>
                <p className="text-sm text-muted-foreground">
                  Upload invoice image or PDF
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center flex-shrink-0 font-bold">
                2
              </div>
              <div>
                <h4 className="font-semibold mb-1">Extract</h4>
                <p className="text-sm text-muted-foreground">
                  AI extracts all key information
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center flex-shrink-0 font-bold">
                3
              </div>
              <div>
                <h4 className="font-semibold mb-1">Create</h4>
                <p className="text-sm text-muted-foreground">
                  Auto-fill expense or bill form
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
