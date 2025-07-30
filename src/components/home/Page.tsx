"use client";

import { useState, useRef, ChangeEvent } from "react";
import QRCode from "./QRCode";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { BadgeCheckIcon, Rss } from "lucide-react";
import { Badge } from "../ui/badge";
import Link from "next/link";

export default function HomePage() {
  const [value, setValue] = useState<string>("");
  const [watermark, setWatermark] = useState<string>("");
  const [bg, setBg] = useState<string>("#ffffff");
  const [fg, setFg] = useState<string>("#000000");

  const qrCodeRef = useRef<HTMLDivElement>(null);

  function handleInputChange(e: ChangeEvent<HTMLInputElement>) {
    setValue(e.target.value);
  }

  function handleWatermarkChange(e: ChangeEvent<HTMLInputElement>) {
    setWatermark(e.target.value);
  }

  function handleBgChange(e: ChangeEvent<HTMLInputElement>) {
    setBg(e.target.value);
  }

  function handleFgChange(e: ChangeEvent<HTMLInputElement>) {
    setFg(e.target.value);
  }

  return (
    <div className="flex flex-col items-center justify-center bg-primary rounded-lg p-4 sm:p-6 md:p-8 shadow-lg w-full max-w-sm sm:max-w-md md:max-w-lg mx-auto text-center border">
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2">QR Code Generator</h1>
      <div className="flex flex-row gap-2">
        <Badge
          variant="nothing"
          className="bg-blue-500 text-white"
          asChild
        >
          <Link href="https://github.com/faintastic/qrcode-generator" target="_blank">
            <BadgeCheckIcon />
            Open Source
          </Link>
        </Badge>
        <Badge
          variant="nothing"
          className="bg-[#373737] text-white"
          asChild
        >
          <Link href="https://nextjs.org" target="_blank">
            <Rss />
            Next.js
          </Link>
        </Badge>
      </div>
      {value.trim() && (
        <div className="mt-4 sm:mt-6 w-full flex justify-center" ref={qrCodeRef}>
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

        <Label htmlFor="bg-color">Background Color</Label>
        <Input
          type="color"
          id="bg-color"
          value={bg}
          onChange={handleBgChange}
        />

        <Label htmlFor="fg-color">Foreground Color</Label>
        <Input
          type="color"
          id="fg-color"
          value={fg}
          onChange={handleFgChange}
        />

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