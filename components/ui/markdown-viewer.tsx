"use client";

import * as React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { cn } from "@/lib/utils";

interface MarkdownViewerProps extends React.HTMLAttributes<HTMLDivElement> {
  content: string;
}

const MarkdownViewer = React.forwardRef<HTMLDivElement, MarkdownViewerProps>(
  ({ className, content, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "markdown-viewer text-sm",
          "[&_h1]:text-2xl [&_h1]:font-bold [&_h1]:text-zinc-900 [&_h1]:dark:text-zinc-50 [&_h1]:mt-6 [&_h1]:mb-4 [&_h1]:border-b [&_h1]:border-zinc-200 [&_h1]:dark:border-zinc-800 [&_h1]:pb-2",
          "[&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-zinc-900 [&_h2]:dark:text-zinc-50 [&_h2]:mt-5 [&_h2]:mb-3",
          "[&_h3]:text-lg [&_h3]:font-semibold [&_h3]:text-zinc-900 [&_h3]:dark:text-zinc-50 [&_h3]:mt-4 [&_h3]:mb-2",
          "[&_h4]:text-base [&_h4]:font-semibold [&_h4]:text-zinc-900 [&_h4]:dark:text-zinc-50 [&_h4]:mt-3 [&_h4]:mb-2",
          "[&_p]:text-zinc-700 [&_p]:dark:text-zinc-300 [&_p]:mb-4 [&_p]:leading-relaxed",
          "[&_strong]:font-semibold [&_strong]:text-zinc-900 [&_strong]:dark:text-zinc-50",
          "[&_em]:italic",
          "[&_ul]:list-disc [&_ul]:ml-6 [&_ul]:mb-4 [&_ul]:text-zinc-700 [&_ul]:dark:text-zinc-300",
          "[&_ol]:list-decimal [&_ol]:ml-6 [&_ol]:mb-4 [&_ol]:text-zinc-700 [&_ol]:dark:text-zinc-300",
          "[&_li]:mb-1 [&_li]:text-zinc-700 [&_li]:dark:text-zinc-300",
          "[&_code]:bg-zinc-100 [&_code]:dark:bg-zinc-800 [&_code]:text-zinc-900 [&_code]:dark:text-zinc-50 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-xs [&_code]:font-mono",
          "[&_pre]:bg-zinc-900 [&_pre]:dark:bg-zinc-950 [&_pre]:text-zinc-100 [&_pre]:p-4 [&_pre]:rounded-md [&_pre]:overflow-x-auto [&_pre]:mb-4",
          "[&_pre_code]:bg-transparent [&_pre_code]:p-0 [&_pre_code]:text-inherit",
          "[&_a]:text-blue-600 [&_a]:dark:text-blue-400 [&_a]:underline [&_a]:hover:text-blue-700 [&_a]:dark:hover:text-blue-300",
          "[&_blockquote]:border-l-4 [&_blockquote]:border-zinc-300 [&_blockquote]:dark:border-zinc-700 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-zinc-600 [&_blockquote]:dark:text-zinc-400 [&_blockquote]:my-4",
          "[&_table]:w-full [&_table]:border-collapse [&_table]:my-4",
          "[&_th]:border [&_th]:border-zinc-300 [&_th]:dark:border-zinc-700 [&_th]:px-4 [&_th]:py-2 [&_th]:text-left [&_th]:font-semibold [&_th]:bg-zinc-50 [&_th]:dark:bg-zinc-800",
          "[&_td]:border [&_td]:border-zinc-300 [&_td]:dark:border-zinc-700 [&_td]:px-4 [&_td]:py-2",
          "[&_hr]:my-6 [&_hr]:border-t [&_hr]:border-zinc-300 [&_hr]:dark:border-zinc-700",
          className
        )}
        {...props}
      >
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
      </div>
    );
  }
);

MarkdownViewer.displayName = "MarkdownViewer";

export { MarkdownViewer };

