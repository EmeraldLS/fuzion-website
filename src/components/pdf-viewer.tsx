"use client";

import { useState, useEffect } from "react";
import { ChevronDown, ChevronUp, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PDFViewer({ pdfUrl }: { pdfUrl: string }) {
  const [viewerHeight, setViewerHeight] = useState("600px");
  const fileName = pdfUrl.split("/").pop();

  useEffect(() => {
    const updateViewerHeight = () => {
      const windowHeight = window.innerHeight;
      const newHeight = Math.max(400, windowHeight - 200);
      setViewerHeight(`${newHeight}px`);
    };

    updateViewerHeight();
    window.addEventListener("resize", updateViewerHeight);
    return () => window.removeEventListener("resize", updateViewerHeight);
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">PDF Viewer</h1>
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="bg-gray-100 p-4 flex justify-between items-center">
          <span className="font-semibold">{fileName}</span>
          <div className="flex space-x-2">
            <Button asChild size="sm">
              <a href={pdfUrl} download>
                <Download className="h-4 w-4 mr-1" />
                Download
              </a>
            </Button>
          </div>
        </div>
        <div
          style={{ height: viewerHeight }}
          className="w-full transition-all duration-300 ease-in-out"
        >
          <iframe
            src={`${pdfUrl}#view=FitH`}
            width="100%"
            height="100%"
            style={{ border: "none" }}
          >
            <p className="p-4">
              It appears you don't have a PDF plugin for this browser. No
              worries, you can
              <a href={pdfUrl} className="text-primary hover:underline ml-1">
                click here to download the PDF file.
              </a>
            </p>
          </iframe>
        </div>
      </div>
    </div>
  );
}
