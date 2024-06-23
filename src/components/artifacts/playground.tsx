"use client";

import React, { useEffect, useState } from "react";
import { LiveEditor, LiveError, LivePreview, LiveProvider } from "react-live";
import * as phosphorIcons from "@phosphor-icons/react";
import * as recharts from "recharts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import * as shadcnComponents from "@/components/ui";

import { PreviewScreen } from "./preview-screen";

interface PlaygroundProps {
  initialCode: string;
  isCodeLoading: boolean;
}

export function Playground({ initialCode, isCodeLoading }: PlaygroundProps) {
  const [code, setCode] = useState(initialCode);

  const scope = {
    ...shadcnComponents,
    ...phosphorIcons,
    ...recharts,
    // Add any other components or functions you want to make available
  };

  // This is a wrapper component that will be used by LivePreview
  const PreviewWrapper = () => {
    return <PreviewScreen code={code} />;
  };

  useEffect(() => {
    setCode(initialCode);
  }, [initialCode]);

  return (
    <LiveProvider code={code} scope={scope} noInline={true}>
      <Tabs defaultValue="preview" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          {!isCodeLoading && <TabsTrigger value="preview">Preview</TabsTrigger>}
          <TabsTrigger value="code">Code</TabsTrigger>
        </TabsList>
        {!isCodeLoading && (
          <TabsContent value="preview">
            <div className="mt-4 rounded-lg border p-4">
              <LivePreview Component={PreviewWrapper} />
            </div>
          </TabsContent>
        )}
        <TabsContent value="code">
          <div className="mt-4 rounded-lg border p-4">
            <LiveEditor
              onChange={setCode}
              style={{
                fontFamily: '"Fira code", "Fira Mono", monospace',
                fontSize: 14,
                minHeight: "300px",
                backgroundColor: "#f4f4f4",
                borderRadius: "4px",
                padding: "10px",
              }}
            />
          </div>
        </TabsContent>
      </Tabs>
    </LiveProvider>
  );
}
