"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Sparkles, TrendingUp, AlertCircle, Loader2, Bot, User, Download, Trash2, Copy, Check, Mic, MicOff, History, BookOpen, Calculator, FileText, DollarSign, BarChart3, MessageSquare, Plus, Clock, X, Search, Share2, Tag, RefreshCw, Edit2, Tags } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { chatWithAI, getFinancialInsights, getConversationHistory, getConversation, deleteConversation, searchConversations, shareConversation, updateConversationTags, regenerateResponse, editMessage } from "@/lib/actions/ai.action";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ShareDialog } from "./_components/share-dialog";

type Message = {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  followUpQuestions?: string[];
};

export default function AIAssistantPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hello! I'm SyncBooks AI, your financial assistant. I can help you with accounting questions, explain financial reports, guide you through features, and provide insights. How can I assist you today?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [insights, setInsights] = useState<any>(null);
  const [loadingInsights, setLoadingInsights] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [conversations, setConversations] = useState<any[]>([]);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const [loadingConversations, setLoadingConversations] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [streamingMessage, setStreamingMessage] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [followUpQuestions, setFollowUpQuestions] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [shareLink, setShareLink] = useState("");
  const [conversationTags, setConversationTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [editingMessageIndex, setEditingMessageIndex] = useState<number | null>(null);
  const [editContent, setEditContent] = useState("");

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    loadInsights();
    loadConversations();
  }, []);

  const loadInsights = async () => {
    setLoadingInsights(true);
    const result = await getFinancialInsights();
    if (result.success) {
      setInsights(result);
    }
    setLoadingInsights(false);
  };

  const loadConversations = async () => {
    setLoadingConversations(true);
    const result = await getConversationHistory(20);
    if (result.success) {
      setConversations(result.conversations);
    }
    setLoadingConversations(false);
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      role: "user",
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);
    setIsStreaming(true);
    setStreamingMessage("");

    try {
      const conversationHistory = messages.map((msg) => ({
        role: msg.role,
        content: msg.content,
      }));

      const result = await chatWithAI(input, conversationHistory, currentConversationId || undefined);

      if (result.success && result.message) {
        const fullMessage = result.message;
        let currentIndex = 0;

        const streamInterval = setInterval(() => {
          if (currentIndex < fullMessage.length) {
            const chunkSize = Math.floor(Math.random() * 5) + 5;
            currentIndex += chunkSize;
            setStreamingMessage(fullMessage.slice(0, currentIndex));
          } else {
            clearInterval(streamInterval);
            setIsStreaming(false);
            const assistantMessage: Message = {
              role: "assistant",
              content: fullMessage,
              timestamp: new Date(),
              followUpQuestions: result.followUpQuestions || [],
            };
            setMessages((prev) => [...prev, assistantMessage]);
            setFollowUpQuestions(result.followUpQuestions || []);
            setStreamingMessage("");
            if (!currentConversationId) {
              loadConversations();
            }
          }
        }, 10);
      } else {
        setIsStreaming(false);
        toast.error(result.error || "Failed to get response");
      }
    } catch (error) {
      setIsStreaming(false);
      toast.error("Failed to send message");
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([{
      role: "assistant",
      content: "Hello! I'm SyncBooks AI, your financial assistant. I can help you with accounting questions, explain financial reports, guide you through features, and provide insights. How can I assist you today?",
      timestamp: new Date(),
    }]);
    setCurrentConversationId(null);
    toast.success("Chat cleared");
  };

  const exportChat = () => {
    const chatText = messages.map(msg => 
      `[${msg.timestamp.toLocaleString()}] ${msg.role.toUpperCase()}: ${msg.content}`
    ).join("\n\n");
    
    const blob = new Blob([chatText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `syncbooks-ai-chat-${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    toast.success("Chat exported");
  };

  const copyMessage = (content: string, index: number) => {
    navigator.clipboard.writeText(content);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
    toast.success("Copied to clipboard");
  };

  const startVoiceInput = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => {
        setIsListening(true);
        toast.info("Listening...");
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        setIsListening(false);
      };

      recognition.onerror = () => {
        setIsListening(false);
        toast.error("Voice input failed");
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } else {
      toast.error("Voice input not supported in this browser");
    }
  };

  const loadConversationById = async (id: string) => {
    const result = await getConversation(id);
    if (result.success && result.conversation) {
      setMessages(result.conversation.messages.map((msg: any) => ({
        role: msg.role,
        content: msg.content,
        timestamp: new Date(msg.timestamp),
        followUpQuestions: msg.followUpQuestions || [],
      })));
      setCurrentConversationId(id);
      setConversationTags(result.conversation.tags || []);
      const lastMsg = result.conversation.messages[result.conversation.messages.length - 1];
      setFollowUpQuestions(lastMsg?.followUpQuestions || []);
      setShowHistory(false);
      toast.success("Conversation loaded");
    } else {
      toast.error("Failed to load conversation");
    }
  };

  const handleDeleteConversation = async (id: string) => {
    const result = await deleteConversation(id, window.location.pathname);
    if (result.success) {
      setConversations(conversations.filter(c => c.id !== id));
      if (currentConversationId === id) {
        clearChat();
      }
      toast.success("Conversation deleted");
    } else {
      toast.error("Failed to delete conversation");
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    setIsSearching(true);
    const result = await searchConversations(searchQuery);
    if (result.success) {
      setSearchResults(result.results);
    } else {
      toast.error("Search failed");
    }
    setIsSearching(false);
  };

  const handleShare = async () => {
    if (!currentConversationId) return;
    const result = await shareConversation(currentConversationId);
    if (result.success) {
      const link = `${window.location.origin}/shared/${result.shareToken}`;
      setShareLink(link);
      setShowShareDialog(true);
    } else {
      toast.error("Failed to share");
    }
  };

  const handleAddTag = async () => {
    if (!tagInput.trim() || !currentConversationId) return;
    const newTags = [...conversationTags, tagInput.trim()];
    const result = await updateConversationTags(currentConversationId, newTags);
    if (result.success) {
      setConversationTags(newTags);
      setTagInput("");
      toast.success("Tag added");
    } else {
      toast.error("Failed to add tag");
    }
  };

  const handleRemoveTag = async (tag: string) => {
    if (!currentConversationId) return;
    const newTags = conversationTags.filter(t => t !== tag);
    const result = await updateConversationTags(currentConversationId, newTags);
    if (result.success) {
      setConversationTags(newTags);
      toast.success("Tag removed");
    } else {
      toast.error("Failed to remove tag");
    }
  };

  const handleRegenerate = async (index: number) => {
    if (!currentConversationId) return;
    setIsLoading(true);
    const result = await regenerateResponse(currentConversationId, index);
    if (result.success) {
      await loadConversationById(currentConversationId);
      toast.success("Response regenerated");
    } else {
      toast.error("Failed to regenerate");
    }
    setIsLoading(false);
  };

  const handleEditMessage = async (index: number) => {
    if (!currentConversationId || !editContent.trim()) return;
    setIsLoading(true);
    const result = await editMessage(currentConversationId, index, editContent);
    if (result.success) {
      await loadConversationById(currentConversationId);
      setEditingMessageIndex(null);
      setEditContent("");
      toast.success("Message edited");
    } else {
      toast.error("Failed to edit message");
    }
    setIsLoading(false);
  };

  const quickQuestions = [
    "How do I reconcile my bank account in SyncBooks?",
    "What's the difference between cash and accrual accounting?",
    "How do I create a journal entry for depreciation?",
    "Explain my current cash flow situation",
    "What are the key financial reports I should review monthly?",
    "How do I categorize business expenses for tax purposes?",
    "Help me understand my profit margin",
    "What's the best way to manage overdue invoices?",
    "How do I track inventory in SyncBooks?",
    "What's the difference between revenue and profit?",
    "How do I handle foreign currency transactions?",
    "Explain accounts receivable vs accounts payable",
  ];

  const categoryQuestions = {
    accounting: [
      "How do I set up my chart of accounts?",
      "Explain double-entry bookkeeping",
      "How do I record a journal entry?",
      "What's the difference between assets and liabilities?",
      "How do I handle bad debt write-offs?",
      "What are contra accounts?",
      "How do I record prepaid expenses?",
      "Explain accrued expenses vs deferred expenses",
    ],
    reports: [
      "How do I generate a profit & loss statement?",
      "Explain my balance sheet",
      "How do I analyze cash flow trends?",
      "What KPIs should I track?",
      "How do I create a budget vs actual report?",
      "What's an aging report and how do I use it?",
      "How do I analyze my expense trends?",
      "What financial ratios should I monitor?",
    ],
    tax: [
      "How do I calculate VAT on invoices?",
      "What are my tax filing deadlines?",
      "How do I handle payroll taxes?",
      "What expenses are tax-deductible?",
      "How do I prepare for tax season?",
      "What's the difference between tax deduction and tax credit?",
      "How do I handle sales tax compliance?",
      "What records should I keep for tax purposes?",
    ],
    payroll: [
      "How do I run payroll in SyncBooks?",
      "How do I calculate employee deductions?",
      "What are statutory deductions?",
      "How do I generate payslips?",
      "How do I handle employee benefits?",
      "What's the difference between gross and net pay?",
      "How do I process year-end payroll?",
      "How do I handle overtime calculations?",
    ],
  };

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <ShareDialog 
        open={showShareDialog} 
        onOpenChange={setShowShareDialog} 
        shareLink={shareLink}
        title="SyncBooks AI Conversation"
      />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-3">
        {showHistory && (
          <Card className="shadow-md">
            <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-purple-600" />
                  History
                </CardTitle>
                <Button variant="ghost" size="icon" onClick={() => setShowHistory(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[calc(100vh-350px)]">
                <div className="p-4 space-y-2">
                  <div className="flex gap-2 mb-3">
                    <Input
                      placeholder="Search conversations..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                      className="text-sm"
                    />
                    <Button variant="outline" size="icon" onClick={handleSearch} disabled={isSearching}>
                      {isSearching ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                    </Button>
                  </div>
                  <Button
                    variant="outline"
                    className="w-full justify-start gap-2 bg-emerald-50 border-emerald-200 hover:bg-emerald-100"
                    onClick={clearChat}
                  >
                    <Plus className="h-4 w-4" />
                    New Chat
                  </Button>
                  {searchQuery && searchResults.length > 0 ? (
                    searchResults.map((result) => (
                      <div
                        key={result.id}
                        className="group relative rounded-lg border p-3 hover:bg-accent cursor-pointer transition-all"
                        onClick={() => {
                          loadConversationById(result.id);
                          setSearchQuery("");
                          setSearchResults([]);
                        }}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium line-clamp-2">{result.title}</p>
                            <p className="text-xs text-muted-foreground line-clamp-1 mt-1">{result.preview}</p>
                            <div className="flex items-center gap-2 mt-1 flex-wrap">
                              <Badge variant="secondary" className="text-xs">
                                {result.matchCount} matches
                              </Badge>
                              {result.tags?.map((tag: string) => (
                                <Badge key={tag} variant="outline" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : loadingConversations ? (
                    <div className="flex justify-center py-8">
                      <Loader2 className="h-6 w-6 animate-spin text-purple-600" />
                    </div>
                  ) : conversations.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-8">No conversations yet</p>
                  ) : (
                    conversations.map((conv) => (
                      <div
                        key={conv.id}
                        className={`group relative rounded-lg border p-3 hover:bg-accent cursor-pointer transition-all ${
                          currentConversationId === conv.id ? "bg-accent border-emerald-300" : ""
                        }`}
                        onClick={() => loadConversationById(conv.id)}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium line-clamp-2">{conv.title}</p>
                            <div className="flex items-center gap-2 mt-1 flex-wrap">
                              <Badge variant="secondary" className="text-xs">
                                {conv.messageCount} msgs
                              </Badge>
                              <span className="text-xs text-muted-foreground flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {new Date(conv.lastMessageAt).toLocaleDateString()}
                              </span>
                              {conv.tags?.map((tag: string) => (
                                <Badge key={tag} variant="outline" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 opacity-0 group-hover:opacity-100"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteConversation(conv.id);
                            }}
                          >
                            <Trash2 className="h-3 w-3 text-red-600" />
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        )}

        <div className={showHistory ? "lg:col-span-2" : "lg:col-span-3"}>
          <Card className="flex flex-col h-[calc(100vh-250px)] shadow-lg">
            <CardHeader className="border-b bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 flex-shrink-0">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-white">
                  <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <Sparkles className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-lg font-semibold">SyncBooks AI Assistant</div>
                    <div className="text-xs font-normal text-white/80">Powered by GPT-4</div>
                  </div>
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                    {messages.length - 1} messages
                  </Badge>
                  {currentConversationId && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-white hover:bg-white/20"
                      onClick={handleShare}
                    >
                      <Share2 className="h-4 w-4" />
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-white hover:bg-white/20"
                    onClick={() => setShowHistory(!showHistory)}
                  >
                    <MessageSquare className="h-4 w-4" />
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
                        <History className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={exportChat}>
                        <Download className="h-4 w-4 mr-2" />
                        Export Chat
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={clearChat} className="text-red-600">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Clear Chat
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </CardHeader>
            
            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gradient-to-b from-gray-50/50 to-white dark:from-gray-900/50 dark:to-gray-950">
              {currentConversationId && conversationTags.length > 0 && (
                <div className="flex items-center gap-2 flex-wrap pb-2 border-b">
                  <Tags className="h-4 w-4 text-muted-foreground" />
                  {conversationTags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="gap-1">
                      {tag}
                      <X className="h-3 w-3 cursor-pointer" onClick={() => handleRemoveTag(tag)} />
                    </Badge>
                  ))}
                </div>
              )}
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex gap-3 animate-in fade-in slide-in-from-bottom-2 duration-300 ${
                    message.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  {message.role === "assistant" && (
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-600 flex items-center justify-center flex-shrink-0 shadow-md">
                      <Bot className="h-5 w-5 text-white" />
                    </div>
                  )}
                  <div
                    className={`max-w-[75%] rounded-2xl p-4 shadow-sm group relative ${
                      message.role === "user"
                        ? "bg-gradient-to-br from-emerald-600 to-teal-600 text-white"
                        : "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
                    }`}
                  >
                    {editingMessageIndex === index && message.role === "user" ? (
                      <div className="space-y-2">
                        <Input
                          value={editContent}
                          onChange={(e) => setEditContent(e.target.value)}
                          className="text-sm"
                        />
                        <div className="flex gap-2">
                          <Button size="sm" onClick={() => handleEditMessage(index)}>Save</Button>
                          <Button size="sm" variant="outline" onClick={() => setEditingMessageIndex(null)}>Cancel</Button>
                        </div>
                      </div>
                    ) : (
                      <div className="prose prose-sm dark:prose-invert max-w-none">
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        rehypePlugins={[rehypeHighlight]}
                        components={{
                          code: ({ node, inline, className, children, ...props }: any) => {
                            return inline ? (
                              <code className="bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded text-sm" {...props}>
                                {children}
                              </code>
                            ) : (
                              <code className={className} {...props}>
                                {children}
                              </code>
                            );
                          },
                          p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                          ul: ({ children }) => <ul className="list-disc pl-4 mb-2 space-y-1">{children}</ul>,
                          ol: ({ children }) => <ol className="list-decimal pl-4 mb-2 space-y-1">{children}</ol>,
                          li: ({ children }) => <li className="text-sm">{children}</li>,
                          h1: ({ children }) => <h1 className="text-xl font-bold mb-2 mt-4">{children}</h1>,
                          h2: ({ children }) => <h2 className="text-lg font-bold mb-2 mt-3">{children}</h2>,
                          h3: ({ children }) => <h3 className="text-base font-bold mb-1 mt-2">{children}</h3>,
                          blockquote: ({ children }) => (
                            <blockquote className="border-l-4 border-gray-300 dark:border-gray-700 pl-4 italic my-2">
                              {children}
                            </blockquote>
                          ),
                          table: ({ children }) => (
                            <div className="overflow-x-auto my-2">
                              <table className="min-w-full border border-gray-300 dark:border-gray-700">{children}</table>
                            </div>
                          ),
                          th: ({ children }) => (
                            <th className="border border-gray-300 dark:border-gray-700 px-2 py-1 bg-gray-100 dark:bg-gray-800 font-semibold text-left">
                              {children}
                            </th>
                          ),
                          td: ({ children }) => (
                            <td className="border border-gray-300 dark:border-gray-700 px-2 py-1">{children}</td>
                          ),
                        }}
                      >
                        {message.content}
                      </ReactMarkdown>
                    </div>
                    )}
                    <div className="flex items-center justify-between mt-2">
                      <p className={`text-xs ${
                        message.role === "user" ? "text-white/70" : "text-muted-foreground"
                      }`}>
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                      <div className="flex gap-1">
                        {message.role === "assistant" && currentConversationId && index > 0 && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => handleRegenerate(index - 1)}
                            title="Regenerate response"
                          >
                            <RefreshCw className="h-3 w-3" />
                          </Button>
                        )}
                        {message.role === "user" && currentConversationId && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => {
                              setEditingMessageIndex(index);
                              setEditContent(message.content);
                            }}
                            title="Edit message"
                          >
                            <Edit2 className="h-3 w-3" />
                          </Button>
                        )}
                        {message.role === "assistant" && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => copyMessage(message.content, index)}
                          >
                            {copiedIndex === index ? (
                              <Check className="h-3 w-3 text-emerald-600" />
                            ) : (
                              <Copy className="h-3 w-3" />
                            )}
                          </Button>
                        )}
                      </div>
                    </div>
                    {message.role === "assistant" && message.followUpQuestions && message.followUpQuestions.length > 0 && index === messages.length - 1 && (
                      <div className="mt-3 pt-3 border-t space-y-2">
                        <p className="text-xs font-semibold text-muted-foreground">Suggested follow-ups:</p>
                        {message.followUpQuestions.map((q, i) => (
                          <Button
                            key={i}
                            variant="ghost"
                            size="sm"
                            className="w-full justify-start text-xs h-auto py-2 px-3 hover:bg-emerald-50"
                            onClick={() => setInput(q)}
                          >
                            {q}
                          </Button>
                        ))}
                      </div>
                    )}
                  </div>
                  {message.role === "user" && (
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-600 flex items-center justify-center flex-shrink-0 shadow-md">
                      <User className="h-5 w-5 text-white" />
                    </div>
                  )}
                </div>
              ))}
              {isStreaming && streamingMessage && (
                <div className="flex gap-3 justify-start animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-600 flex items-center justify-center shadow-md">
                    <Bot className="h-5 w-5 text-white" />
                  </div>
                  <div className="max-w-[75%] bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-4 shadow-sm">
                    <div className="prose prose-sm dark:prose-invert max-w-none">
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        rehypePlugins={[rehypeHighlight]}
                        components={{
                          code: ({ node, inline, className, children, ...props }: any) => {
                            return inline ? (
                              <code className="bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded text-sm" {...props}>
                                {children}
                              </code>
                            ) : (
                              <code className={className} {...props}>
                                {children}
                              </code>
                            );
                          },
                          p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                        }}
                      >
                        {streamingMessage}
                      </ReactMarkdown>
                    </div>
                    <div className="flex items-center gap-1 mt-2">
                      <div className="w-2 h-2 bg-emerald-600 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                      <div className="w-2 h-2 bg-emerald-600 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                      <div className="w-2 h-2 bg-emerald-600 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                  </div>
                </div>
              )}
              {isLoading && !isStreaming && (
                <div className="flex gap-3 justify-start animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-600 flex items-center justify-center shadow-md">
                    <Bot className="h-5 w-5 text-white" />
                  </div>
                  <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-4 shadow-sm">
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin text-emerald-600" />
                      <span className="text-sm text-muted-foreground">Thinking...</span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="border-t bg-white dark:bg-gray-900 p-4 flex-shrink-0">
              {currentConversationId && (
                <div className="flex gap-2 mb-3">
                  <Input
                    placeholder="Add tag (e.g., Tax, Payroll, Reports)..."
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleAddTag()}
                    className="text-sm"
                  />
                  <Button variant="outline" size="sm" onClick={handleAddTag}>
                    <Tag className="h-4 w-4" />
                  </Button>
                </div>
              )}
              <div className="flex gap-2">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
                  placeholder="Ask me anything about accounting..."
                  disabled={isLoading}
                  className="flex-1 rounded-xl border-gray-300 dark:border-gray-700 focus-visible:ring-emerald-600"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={startVoiceInput}
                  disabled={isLoading || isListening}
                  className="rounded-xl"
                >
                  {isListening ? (
                    <MicOff className="h-4 w-4 text-red-600 animate-pulse" />
                  ) : (
                    <Mic className="h-4 w-4" />
                  )}
                </Button>
                <Button
                  onClick={handleSend}
                  disabled={isLoading || !input.trim()}
                  className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 rounded-xl px-6 shadow-md"
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-2 text-center">
                Press Enter to send • Shift + Enter for new line • Click mic for voice input
              </p>
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="shadow-md">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20">
              <CardTitle className="text-lg flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-blue-600" />
                Quick Questions
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
                <TabsList className="grid w-full grid-cols-2 mb-4">
                  <TabsTrigger value="all" className="text-xs">
                    <BookOpen className="h-3 w-3 mr-1" />
                    All
                  </TabsTrigger>
                  <TabsTrigger value="accounting" className="text-xs">
                    <Calculator className="h-3 w-3 mr-1" />
                    Accounting
                  </TabsTrigger>
                </TabsList>
                <TabsList className="grid w-full grid-cols-2 mb-4">
                  <TabsTrigger value="reports" className="text-xs">
                    <BarChart3 className="h-3 w-3 mr-1" />
                    Reports
                  </TabsTrigger>
                  <TabsTrigger value="tax" className="text-xs">
                    <FileText className="h-3 w-3 mr-1" />
                    Tax
                  </TabsTrigger>
                </TabsList>
                <TabsList className="grid w-full grid-cols-1 mb-4">
                  <TabsTrigger value="payroll" className="text-xs">
                    <DollarSign className="h-3 w-3 mr-1" />
                    Payroll
                  </TabsTrigger>
                </TabsList>

                <ScrollArea className="h-[calc(100vh-550px)]">
                  <div className="pr-4">
                  <TabsContent value="all" className="space-y-2 mt-0">
                    {quickQuestions.map((question, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        className="w-full text-left justify-start h-auto py-3 px-4 hover:bg-emerald-50 hover:border-emerald-300 dark:hover:bg-emerald-950/20 transition-all"
                        onClick={() => setInput(question)}
                      >
                        <span className="text-sm line-clamp-2">{question}</span>
                      </Button>
                    ))}
                  </TabsContent>

                  {Object.entries(categoryQuestions).map(([category, questions]) => (
                    <TabsContent key={category} value={category} className="space-y-2 mt-0">
                      {questions.map((question, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          className="w-full text-left justify-start h-auto py-3 px-4 hover:bg-emerald-50 hover:border-emerald-300 dark:hover:bg-emerald-950/20 transition-all"
                          onClick={() => setInput(question)}
                        >
                          <span className="text-sm line-clamp-2">{question}</span>
                        </Button>
                      ))}
                    </TabsContent>
                  ))}
                  </div>
                </ScrollArea>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
