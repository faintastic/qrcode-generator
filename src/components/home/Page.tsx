"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Generator from "./tabs/Generator";
import Saved from "./tabs/Saved";
import Settings from "./tabs/Settings";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

function HomePageContent() {
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState("generator");

  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab && ["generator", "saved", "settings"].includes(tab)) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full max-w-sm sm:max-w-md md:max-w-lg">
      <div className="flex flex-col items-center justify-center bg-primary rounded-lg p-4 sm:p-6 md:p-8 shadow-lg w-full mx-auto text-center border">
        <TabsContent value="generator" className="w-full">
          <Generator />
        </TabsContent>
        <TabsContent value="saved" className="w-full">
          <Saved />
        </TabsContent>
        <TabsContent value="settings" className="w-full">
          <Settings />
        </TabsContent>
      </div>

      <TabsList className="mt-2 w-full h-12 p-2 border">
        <TabsTrigger value="generator">Generator</TabsTrigger>
        <TabsTrigger value="saved">Saved</TabsTrigger>
        <TabsTrigger value="settings">Settings</TabsTrigger>
      </TabsList>
    </Tabs>
  );
}

export default function HomePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HomePageContent />
    </Suspense>
  );
}
