import { useResizeObserver } from "@wojtekmaj/react-hooks";
import { useCallback, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";

import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";

import type { PDFDocumentProxy } from "pdfjs-dist";

import file from "../assets/brochure_2024.pdf";

const resizeObserverOptions = {};
const maxWidth = 1200;

export default function Brochure() {
  const [numPages, setNumPages] = useState<number>();
  const [containerRef, setContainerRef] = useState<HTMLElement | null>(null);
  const [containerWidth, setContainerWidth] = useState<number>();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const onResize = useCallback<ResizeObserverCallback>((entries) => {
    const [entry] = entries;
    if (entry) {
      setContainerWidth(entry.contentRect.width);
    }
  }, []);

  useResizeObserver(containerRef, resizeObserverOptions, onResize);

  function onDocumentLoadSuccess({
    numPages: nextNumPages,
  }: PDFDocumentProxy): void {
    setNumPages(nextNumPages);
    setIsLoading(false);
  }

  function onDocumentLoadError(error: Error): void {
    setError(error.message);
    setIsLoading(false);
  }

  const renderPages = () => {
    if (!numPages) return null;

    return Array.from(new Array(numPages), (_, index) => (
      <div key={`page_${index + 1}`} className="mb-4">
        <Page
          pageNumber={index + 1}
          width={containerWidth ? Math.min(containerWidth, maxWidth) : maxWidth}
          renderAnnotationLayer={false}
          renderTextLayer={false}
        />
      </div>
    ));
  };

  return (
    <div className="w-full max-w-[1200px] mx-auto p-4">
      <div ref={setContainerRef} className="relative">
        {isLoading && (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        )}

        {error && (
          <div className="text-red-500 text-center py-8">
            Error loading PDF: {error}
          </div>
        )}

        <Document
          file={file}
          onLoadSuccess={onDocumentLoadSuccess}
          onLoadError={onDocumentLoadError}
          loading={
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
          }
        >
          {renderPages()}
        </Document>
      </div>
    </div>
  );
}
