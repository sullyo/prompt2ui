"use client";

import { ClientChat } from "@/components/artifacts/chat";
import { Playground } from "@/components/artifacts/playground";
import React from "react";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";

const initialCode = `
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';

function MyComponent() {
  return (
    <Card className="p-4">
      <h2 className="text-lg font-bold mb-2">My Form</h2>
      <Input className="mb-2" placeholder="Enter your name" />
      <Button>Submit</Button>
    </Card>
  );
}

export default MyComponent;
`;

export default function Page() {
  const [code, setCode] = React.useState(initialCode);
  const [isCodeLoading, setIsCodeLoading] = React.useState(false);

  return (
    <div className="h-screen">
      <ResizablePanelGroup direction="horizontal" className="h-full">
        <ResizablePanel defaultSize={50} minSize={30}>
          <div className="overflow-auto h-full p-4">
            <ClientChat
              setArtifactContent={setCode}
              setIsCodeLoading={setIsCodeLoading}
            />
          </div>
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel defaultSize={50} minSize={30}>
          <div className="overflow-auto h-full p-4">
            <Playground initialCode={code} isCodeLoading={isCodeLoading} />
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
