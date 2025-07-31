"use client";

import { useState, useRef, ChangeEvent, useEffect } from "react";
import QRCode from "../QRCode";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import Badges from "../Badges";
import database from "@/lib/database";

interface Config {
  bg: string;
  fg: string;
  watermark?: string;
}

export default function Generator() {
  const [value, setValue] = useState<string>("");
  const [watermark, setWatermark] = useState<string>("");
  const [bg, setBg] = useState<string>("#ffffff");
  const [fg, setFg] = useState<string>("#000000");
  const [loading, setLoading] = useState<boolean>(true);

  const qrCodeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadConfig = async () => {
      try {
        const savedConfig = (await database.get("config")) as Config | null;
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

  function handleInputChange(e: ChangeEvent<HTMLInputElement>) {
    setValue(e.target.value);
  }

  function handleWatermarkChange(e: ChangeEvent<HTMLInputElement>) {
    const newWatermark = e.target.value;
    setWatermark(newWatermark);
  }

  function handleBgChange(e: ChangeEvent<HTMLInputElement>) {
    const newBg = e.target.value;
    setBg(newBg);
  }

  function handleFgChange(e: ChangeEvent<HTMLInputElement>) {
    const newFg = e.target.value;
    setFg(newFg);
  }

  if (loading) {
    return (
      <div className="w-full">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2">
          Generator
        </h1>

        <Badges className="w-full flex justify-center mt-2" />

        <div className="grid w-full items-center gap-3 mt-4 sm:mt-6 px-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-10 w-full" />

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

          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-10 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2">
        Generator
      </h1>

      <Badges className="w-full flex justify-center mt-2" />

      {value.trim() && (
        <div
          className="mt-4 sm:mt-6 w-full flex justify-center"
          ref={qrCodeRef}
        >
          <QRCode
            value={value}
            bgColor={bg}
            fgColor={fg}
            watermarkImage={watermark}
            size={256}
          />
        </div>
      )}

      <div className="grid w-full items-center gap-3 mt-4 sm:mt-6 px-2">
        <Label htmlFor="text-or-url">Text or URL</Label>
        <Input
          type="text"
          id="text-or-url"
          placeholder="https://typescript.rocks"
          value={value}
          onChange={handleInputChange}
        />

        <div className="flex flex-col sm:flex-row gap-2 w-full">
          <div className="flex flex-col w-full gap-2">
            <Label htmlFor="bg-color">Background Color</Label>
            <Input
              type="color"
              id="bg-color"
              value={bg}
              onChange={handleBgChange}
            />
          </div>
          <div className="flex flex-col w-full gap-2">
            <Label htmlFor="fg-color" className="ml-0 sm:ml-auto">
              Foreground Color
            </Label>
            <Input
              type="color"
              id="fg-color"
              value={fg}
              onChange={handleFgChange}
            />
          </div>
        </div>

        <Label htmlFor="watermark">Watermark Image URL (optional)</Label>
        <Input
          type="text"
          id="watermark"
          placeholder="https://example.com/logo.png"
          value={watermark}
          onChange={handleWatermarkChange}
        />
      </div>
    </div>
  );
}
