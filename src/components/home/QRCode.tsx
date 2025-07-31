"use client";

import { useEffect, useRef, useState } from "react";
import QRCode from "qrcode";
import { Button } from "../ui/button";
import { HardDriveUpload, Download, Check } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import database from "@/lib/database";

interface SavedQR {
  value: string;
  bg: string;
  fg: string;
  watermark: string;
  timestamp: number;
}

interface QRCodeProps {
  value: string;
  size?: number;
  bgColor?: string;
  fgColor?: string;
  watermarkImage?: string;
  errorCorrectionLevel?: "L" | "M" | "Q" | "H";
  hoverMenu?: boolean;
}

export default function QRCodeComponent({
  value,
  size = 256,
  bgColor = "#ffffff",
  fgColor = "#000000",
  watermarkImage,
  errorCorrectionLevel = "M",
  hoverMenu = true,
}: QRCodeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const watermarkRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [showDownload, setShowDownload] = useState(false);
  const [canHover, setCanHover] = useState(false);
  const [saveState, setSaveState] = useState<'idle' | 'saving' | 'saved' | 'exists'>('idle');

  useEffect(() => {
    const generateQR = async () => {
      if (!canvasRef.current || !value) return;

      try {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        canvas.width = size;
        canvas.height = size;

        await QRCode.toCanvas(canvas, value, {
          width: size,
          margin: 2,
          color: {
            dark: fgColor,
            light: bgColor,
          },
          errorCorrectionLevel,
        });

        if (watermarkImage && watermarkRef.current) {
          const watermark = watermarkRef.current;

          const drawWatermark = () => {
            const watermarkSize = Math.min(60, size * 0.25);
            const x = (size - watermarkSize) / 2;
            const y = (size - watermarkSize) / 2;

            ctx.fillStyle = bgColor;
            ctx.beginPath();
            ctx.arc(size / 2, size / 2, watermarkSize / 2 + 5, 0, 2 * Math.PI);
            ctx.fill();

            ctx.globalAlpha = 0.9;
            ctx.save();
            ctx.beginPath();
            ctx.arc(size / 2, size / 2, watermarkSize / 2, 0, 2 * Math.PI);
            ctx.clip();
            ctx.drawImage(watermark, x, y, watermarkSize, watermarkSize);
            ctx.restore();
            ctx.globalAlpha = 1.0;
          };

          watermark.crossOrigin = "anonymous";

          if (watermark.complete && watermark.naturalHeight !== 0) {
            drawWatermark();
          } else {
            watermark.onload = drawWatermark;
            watermark.src = watermarkImage;
          }
        }
      } catch (error) {
        console.error("Error generating QR code:", error);
      }
    };

    generateQR();
  }, [value, size, bgColor, fgColor, watermarkImage, errorCorrectionLevel]);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(hover: hover)");
    setCanHover(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setCanHover(e.matches);
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setShowDownload(false);
      }
    };

    if (showDownload && !canHover) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showDownload, canHover]);

  const handleSave = async () => {
    try {
      setSaveState('saving');
      
      const existingSavedQrs = (await database.get("savedQrs") as SavedQR[]) || [];
      
      const newQR: SavedQR = {
        value,
        bg: bgColor,
        fg: fgColor,
        watermark: watermarkImage || "",
        timestamp: Date.now()
      };
      
      const exists = existingSavedQrs.some((qr: SavedQR) => 
        qr.value === newQR.value && 
        qr.bg === newQR.bg && 
        qr.fg === newQR.fg && 
        qr.watermark === newQR.watermark
      );
      
      if (!exists) {
        const updatedSavedQrs = [newQR, ...existingSavedQrs];
        
        await database.set("savedQrs", updatedSavedQrs);
        
        setSaveState('saved');
        console.log("QR code saved successfully!");
      } else {
        setSaveState('exists');
        console.log("QR code already exists in saved collection");
      }
      
      setTimeout(() => {
        setSaveState('idle');
      }, 2000);
      
    } catch (error) {
      console.error("Failed to save QR code:", error);
      setSaveState('idle');
    }
  };

  const handleDownload = () => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;

      try {
        const image = canvas.toDataURL("image/png");
        const link = document.createElement("a");
        link.href = image;
        link.download = "qrcode.png";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } catch (error) {
        console.error(
          "Canvas is tainted, using alternative download method:",
          error
        );

        const tempCanvas = document.createElement("canvas");
        const tempCtx = tempCanvas.getContext("2d");
        if (!tempCtx) return;

        tempCanvas.width = size;
        tempCanvas.height = size;

        QRCode.toCanvas(tempCanvas, value, {
          width: size,
          margin: 2,
          color: {
            dark: fgColor,
            light: bgColor,
          },
          errorCorrectionLevel,
        })
          .then(() => {
            const image = tempCanvas.toDataURL("image/png");
            const link = document.createElement("a");
            link.href = image;
            link.download = "qrcode.png";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          })
          .catch((err) => {
            console.error("Failed to generate QR code for download:", err);
          });
      }
    }
  };

  const handleClick = () => {
    if (!canHover) {
      setShowDownload(!showDownload);
    }
  };

  return (
    <div
      ref={containerRef}
      className={`group relative inline-block rounded-lg hover:shadow-lg transition-shadow duration-300 ${
        !canHover ? "cursor-pointer" : ""
      }`}
      style={{ width: size, height: size }}
      onClick={handleClick}
    >
      <canvas ref={canvasRef} className="w-full h-full rounded-lg" />

      {watermarkImage && (
        <img
          ref={watermarkRef}
          src={watermarkImage}
          alt="Watermark"
          className="hidden"
        />
      )}

      {hoverMenu && (
        <div
          className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 bg-black/80 rounded-lg ${
            showDownload ? "opacity-100" : "opacity-0 group-hover:opacity-100"
          }`}
        >
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  if (saveState === 'idle') {
                    handleSave();
                  }
                }}
                className={`absolute top-2 left-2 transition-all duration-300 ${
                  saveState === 'saved' || saveState === 'exists' 
                    ? 'bg-green-500 hover:bg-green-600 border-green-500' 
                    : ''
                }`}
                size="lg"
                variant={"outline"}
                disabled={saveState !== 'idle'}
              >
                <div className={`transition-transform duration-300 ${
                  saveState === 'saved' || saveState === 'exists' ? 'scale-110' : 'scale-100'
                }`}>
                  {saveState === 'saving' && (
                    <HardDriveUpload className="animate-pulse" />
                  )}
                  {saveState === 'saved' && (
                    <Check className="animate-in fade-in-0 zoom-in-50 duration-300" />
                  )}
                  {saveState === 'exists' && (
                    <Check className="animate-in fade-in-0 zoom-in-50 duration-300" />
                  )}
                  {saveState === 'idle' && <HardDriveUpload />}
                </div>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              {saveState === 'saved' && 'QR code saved!'}
              {saveState === 'exists' && 'Already saved'}
              {saveState === 'saving' && 'Saving...'}
              {saveState === 'idle' && 'Click to save QR code'}
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDownload();
                }}
                className="absolute top-2 right-2"
                size="lg"
                variant={"outline"}
              >
                <Download />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Click to download QR code</TooltipContent>
          </Tooltip>
        </div>
      )}
    </div>
  );
}
