"use client";

import { useState, useRef, ChangeEvent } from "react";
import QRCode from "./QRCode";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

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
    <div className="flex flex-col items-center justify-center bg-primary rounded-lg p-8 shadow-lg w-200 text-center border">
      <h1 className="text-4xl font-bold">QR Code Generator</h1>
      {value.trim() && (
        <div className="mt-6" ref={qrCodeRef}>
          <QRCode
            value={value}
            bgColor={bg}
            fgColor={fg}
            watermarkImage={watermark}
          />
        </div>
      )}

      <div className="grid w-full max-w-sm items-center gap-3 mt-6">
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