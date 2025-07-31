"use client";

import { useState, ChangeEvent, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import QRCode from "../QRCode";
import Badges from "../Badges";
import database from "@/lib/database";

interface Config {
  bg: string;
  fg: string;
  watermark?: string;
}

export default function Settings() {
  const [watermark, setWatermark] = useState<string>("");
  const [bg, setBg] = useState<string>("#ffffff");
  const [fg, setFg] = useState<string>("#000000");
  const [loading, setLoading] = useState<boolean>(true);

  const [defaultSettings, setDefaultSettings] = useState<boolean>(false);
  const [clearAllData, setClearAllData] = useState<boolean>(false);

  useEffect(() => {
    const loadConfig = async () => {
      try {
        const savedConfig = await database.get("config") as Config | null;
        if (savedConfig) {
          setBg(savedConfig.bg || "#ffffff");
          setFg(savedConfig.fg || "#000000");
          setWatermark(savedConfig.watermark || "");
        } else {
          const defaultConfig: Config = {
            bg: "#ffffff",
            fg: "#000000",
            watermark: "",
          };

          await database.set("config", defaultConfig);
          setBg(defaultConfig.bg);
          setFg(defaultConfig.fg);
          setWatermark(defaultConfig.watermark || "");
        }
      } catch (error) {
        console.error("Failed to load config:", error);
      }

      setLoading(false);
    };

    loadConfig();
  }, []);

  function handleWatermarkChange(e: ChangeEvent<HTMLInputElement>) {
    const newWatermark = e.target.value;
    setWatermark(newWatermark);

    // Auto-save config
    const newConfig: Config = { bg, fg, watermark: newWatermark };
    database.set("config", newConfig).catch(console.error);
  }

  function handleBgChange(e: ChangeEvent<HTMLInputElement>) {
    const newBg = e.target.value;
    setBg(newBg);

    // Auto-save config
    const newConfig: Config = { bg: newBg, fg, watermark };
    database.set("config", newConfig).catch(console.error);
  }

  function handleFgChange(e: ChangeEvent<HTMLInputElement>) {
    const newFg = e.target.value;
    setFg(newFg);

    // Auto-save config
    const newConfig: Config = { bg, fg: newFg, watermark };
    database.set("config", newConfig).catch(console.error);
  }

  const handleResetDefaults = async () => {
    const defaultConfig: Config = {
      bg: "#ffffff",
      fg: "#000000",
      watermark: "",
    };

    try {
      await database.set("config", defaultConfig);
      setBg(defaultConfig.bg);
      setFg(defaultConfig.fg);
      setWatermark(defaultConfig.watermark || "");
    } catch (error) {
      console.error("Failed to reset config:", error);
    }
  };

  const handleClearData = async () => {
    try {
      await database.delete("config");
      await database.delete("savedQRs");
      setBg("#ffffff");
      setFg("#000000");
      setWatermark("");
    } catch (error) {
      console.error("Failed to clear data:", error);
    }
  };

  if (loading) {
    return (
      <div className="w-full">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2">
          Settings
        </h1>

        <Badges className="w-full flex justify-center mt-2" />

        <div className="grid w-full items-center gap-4 mt-4 sm:mt-6 px-2">
          {/* Default Colors Section */}
          <div className="space-y-3">
            <Skeleton className="h-5 w-32" />

            <div className="flex flex-col sm:flex-row gap-2 w-full">
              <div className="flex flex-col w-full gap-2">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-10 w-full" />
              </div>
              <div className="flex flex-col w-full gap-2">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-10 w-full" />
              </div>
            </div>
          </div>

          {/* Default Watermark Section */}
          <div className="space-y-3">
            <Skeleton className="h-5 w-36" />
            <Skeleton className="h-10 w-full" />
          </div>

          {/* Actions Section */}
          <div className="space-y-3">
            <Skeleton className="h-5 w-20" />
            <div className="flex flex-col sm:flex-row gap-2">
              <Skeleton className="h-10 w-full sm:w-32" />
              <Skeleton className="h-10 w-full sm:w-28" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2">
        Settings
      </h1>

      <Badges className="w-full flex justify-center mt-2" />

      <div className="grid w-full items-center gap-6 mt-4 sm:mt-6 px-2">
        <div className="space-y-3">
          <h2 className="text-lg font-semibold">Default Colors</h2>

          <div className="flex flex-col sm:flex-row gap-2 w-full">
            <div className="flex flex-col w-full gap-2">
              <Label htmlFor="default-bg-color">Background Color</Label>
              <Input
                type="color"
                id="default-bg-color"
                value={bg}
                onChange={handleBgChange}
              />
            </div>
            <div className="flex flex-col w-full gap-2">
              <Label htmlFor="default-fg-color" className="ml-0 sm:ml-auto">
                Foreground Color
              </Label>
              <Input
                type="color"
                id="default-fg-color"
                value={fg}
                onChange={handleFgChange}
              />
            </div>
          </div>

          <div className="flex flex-col space-y-2 p-2 border rounded-lg bg-primary">
            <div className="flex flex-col items-center justify-center">
              <span className="text-lg font-medium mb-3">Preview</span>

              <QRCode
                value={"https://qr.typescript.rocks"}
                bgColor={bg}
                fgColor={fg}
                watermarkImage={watermark}
                size={128}
                hoverMenu={false}
              />
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <h2 className="text-lg font-semibold">Default Watermark</h2>
          <Label htmlFor="default-watermark">Watermark Image URL</Label>
          <Input
            type="text"
            id="default-watermark"
            placeholder="https://example.com/logo.png"
            value={watermark}
            onChange={handleWatermarkChange}
          />
        </div>

        <div className="space-y-3">
          <h2 className="text-lg font-semibold">Actions</h2>
          <div className="flex gap-2 w-full">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" className="flex-1 hover:bg-input/20">
                  Reset to Defaults
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will reset all of your
                    settings to the default values.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleResetDefaults}>
                    Continue
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" className="flex-1">
                  Clear All Data
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will delete All
                    of your config, and saved QR codes.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleClearData}>
                    Delete all data
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </div>
    </div>
  );
}
