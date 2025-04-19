'use client';

import { useState, useRef } from 'react';
import { Button } from '@kit/ui/button';
import { Loader2 } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@kit/ui/tooltip';
import { usePdfGenerator } from '~/hooks/usePdfGenerator';

interface PdfButtonProps {
  contentRef: React.RefObject<HTMLElement>;
  title?: string;
  filename?: string;
}

/**
 * PDF出力ボタンコンポーネント
 */
export function PdfButton({
  contentRef,
  title,
  filename = 'document.pdf',
}: PdfButtonProps) {
  const { generatePdf, isGenerating, error } = usePdfGenerator(contentRef);
  const [tooltipOpen, setTooltipOpen] = useState(false);

  const handleGeneratePdf = async () => {
    await generatePdf({
      title,
      filename,
    });

    if (error) {
      setTooltipOpen(true);
      setTimeout(() => {
        setTooltipOpen(false);
      }, 3000);
    }
  };

  return (
    <TooltipProvider>
      <Tooltip open={tooltipOpen && !!error}>
        <TooltipTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            onClick={handleGeneratePdf}
            disabled={isGenerating}
            className="flex items-center gap-1"
          >
            {isGenerating ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-labelledby="pdf-icon-title"
              >
                <title id="pdf-icon-title">PDFアイコン</title>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"
                />
              </svg>
            )}
            {isGenerating ? 'PDF生成中...' : 'PDFで保存'}
          </Button>
        </TooltipTrigger>
        {error && (
          <TooltipContent>
            <p className="text-red-500">{error}</p>
          </TooltipContent>
        )}
      </Tooltip>
    </TooltipProvider>
  );
}
