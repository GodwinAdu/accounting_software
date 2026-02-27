import { getSharedConversation } from "@/lib/actions/ai.action";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bot, User, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";

export default async function SharedConversationPage({ params }: { params: Promise<{ shareToken: string }> }) {
  const { shareToken } = await params;
  const result = await getSharedConversation(shareToken);

  if (!result.success || !result.conversation) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8">
        <Card className="max-w-md">
          <CardContent className="pt-6 text-center">
            <p className="text-muted-foreground">Conversation not found or no longer shared</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { conversation } = result;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950 p-8">
      <div className="max-w-4xl mx-auto">
        <Card className="shadow-lg">
          <CardHeader className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600">
            <CardTitle className="flex items-center gap-2 text-white">
              <Sparkles className="h-5 w-5" />
              <div>
                <div className="text-lg font-semibold">{conversation.title}</div>
                <div className="text-xs font-normal text-white/80">Shared PayFlow AI Conversation</div>
              </div>
            </CardTitle>
            {conversation.tags && conversation.tags.length > 0 && (
              <div className="flex gap-2 mt-3 flex-wrap">
                {conversation.tags.map((tag: string) => (
                  <Badge key={tag} variant="secondary" className="bg-white/20 text-white border-white/30">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            {conversation.messages.map((message: any, index: number) => (
              <div
                key={index}
                className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {message.role === "assistant" && (
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-600 flex items-center justify-center flex-shrink-0 shadow-md">
                    <Bot className="h-5 w-5 text-white" />
                  </div>
                )}
                <div
                  className={`max-w-[75%] rounded-2xl p-4 shadow-sm ${
                    message.role === "user"
                      ? "bg-gradient-to-br from-emerald-600 to-teal-600 text-white"
                      : "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
                  }`}
                >
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
                      {message.content}
                    </ReactMarkdown>
                  </div>
                  <p className={`text-xs mt-2 ${message.role === "user" ? "text-white/70" : "text-muted-foreground"}`}>
                    {new Date(message.timestamp).toLocaleString()}
                  </p>
                </div>
                {message.role === "user" && (
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-600 flex items-center justify-center flex-shrink-0 shadow-md">
                    <User className="h-5 w-5 text-white" />
                  </div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
