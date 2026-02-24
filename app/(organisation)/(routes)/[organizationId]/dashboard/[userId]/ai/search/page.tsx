"use client";

import { useState } from "react";
import { Search, Loader2, Sparkles, FileText, DollarSign, Users, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { smartSearch } from "@/lib/actions/ai.action";
import { toast } from "sonner";
import Heading from "@/components/commons/Header";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

export default function SmartSearchPage() {
  const [query, setQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) {
      toast.error("Please enter a search query");
      return;
    }

    setIsSearching(true);
    try {
      const data = await smartSearch(query);
      setResult(data);
      if (!data.success) {
        toast.error(data.error || "Something went wrong. Please try again.");
      }
    } catch (error) {
      toast.error("Oops! Something went wrong. Please try again.");
    } finally {
      setIsSearching(false);
    }
  };

  const quickSearches = [
    "Show unpaid invoices",
    "Expenses over 1000",
    "Overdue invoices",
    "All paid invoices",
    "Recent expenses",
    "Draft invoices",
    "High value expenses",
    "This month revenue",
  ];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "invoice": return <FileText className="h-5 w-5 text-blue-600" />;
      case "expense": return <DollarSign className="h-5 w-5 text-red-600" />;
      case "customer": return <Users className="h-5 w-5 text-green-600" />;
      default: return <Package className="h-5 w-5 text-purple-600" />;
    }
  };

  return (
    <div className="space-y-6">
      <Heading
        title="Smart Search"
        description="Search your data using natural language"
      />
      <Separator />

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-purple-600" />
            AI-Powered Search
          </CardTitle>
          <CardDescription>
            Ask questions in plain English - AI will find what you need
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder='Try: "Show unpaid invoices over GHS 500"'
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="flex-1"
              />
              <Button 
                type="submit" 
                disabled={isSearching}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              >
                {isSearching ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Search className="h-4 w-4" />
                )}
              </Button>
            </div>

            <div className="flex flex-wrap gap-2">
              <span className="text-xs text-muted-foreground">Quick searches:</span>
              {quickSearches.map((q, i) => (
                <Badge
                  key={i}
                  variant="outline"
                  className="cursor-pointer hover:bg-accent"
                  onClick={() => setQuery(q)}
                >
                  {q}
                </Badge>
              ))}
            </div>
          </form>
        </CardContent>
      </Card>

      {result && result.success && (
        <>
          {result.response && (
            <Card className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 border-purple-200">
              <CardContent className="pt-6">
                <p className="text-sm leading-relaxed">{result.response}</p>
              </CardContent>
            </Card>
          )}

          {result.results && result.results.length > 0 ? (
            <Card>
              <CardHeader>
                <CardTitle>Found {result.results.length} {result.results.length === 1 ? 'result' : 'results'}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {result.results.map((item: any, index: number) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent transition-colors">
                      <div className="flex items-center gap-3">
                        {getTypeIcon(item.type)}
                        <div>
                          <p className="font-medium">
                            {item.number || item.description || item.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {item.type} • {new Date(item.date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">GHS {item.amount?.toLocaleString()}</p>
                        {item.status && (
                          <Badge variant="outline" className="text-xs">
                            {item.status}
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="border-dashed">
              <CardContent className="pt-6 text-center">
                <div className="flex flex-col items-center gap-3 py-8">
                  <div className="rounded-full bg-muted p-3">
                    <Search className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">No results found</h3>
                    <p className="text-sm text-muted-foreground max-w-md">
                      I couldn't find anything matching your search. Try rephrasing your query or use one of the quick searches above.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
}
