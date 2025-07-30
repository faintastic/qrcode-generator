'use client';

import { useEffect, useRef, useState } from 'react';
import QRCode from 'qrcode';
import { Button } from '../ui/button';

interface QRCodeProps {
  value: string;
  size?: number;
  bgColor?: string;
  fgColor?: string;
  watermarkImage?: string;
  errorCorrectionLevel?: 'L' | 'M' | 'Q' | 'H';
}

export default function QRCodeComponent({
  value,
  size = 256,
  bgColor = '#ffffff',
  fgColor = '#000000',
  watermarkImage,
  errorCorrectionLevel = 'M',
}: QRCodeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const watermarkRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [showDownload, setShowDownload] = useState(false);
  const [canHover, setCanHover] = useState(false);

  useEffect(() => {
    const generateQR = async () => {
      if (!canvasRef.current || !value) return;

      try {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
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
            ctx.drawImage(
              watermark,
              x,
              y,
              watermarkSize,
              watermarkSize
            );
            ctx.restore();
            ctx.globalAlpha = 1.0;
          };

          // Set crossOrigin to prevent canvas tainting
          watermark.crossOrigin = 'anonymous';
          
          if (watermark.complete && watermark.naturalHeight !== 0) {
            drawWatermark();
          } else {
            watermark.onload = drawWatermark;
            watermark.src = watermarkImage;
          }
        }
      } catch (error) {
        console.error('Error generating QR code:', error);
      }
    };

    generateQR();
  }, [value, size, bgColor, fgColor, watermarkImage, errorCorrectionLevel]);

  // Detect if the device supports hover
  useEffect(() => {
    const mediaQuery = window.matchMedia('(hover: hover)');
    setCanHover(mediaQuery.matches);
    
    const handleChange = (e: MediaQueryListEvent) => {
      setCanHover(e.matches);
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Handle clicks outside the component to hide download button
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowDownload(false);
      }
    };

    if (showDownload && !canHover) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showDownload, canHover]);

  const handleDownload = () => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      
      try {
        const image = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = image;
        link.download = 'qrcode.png';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } catch (error) {
        console.error('Canvas is tainted, using alternative download method:', error);
        
        const tempCanvas = document.createElement('canvas');
        const tempCtx = tempCanvas.getContext('2d');
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
        }).then(() => {
          const image = tempCanvas.toDataURL('image/png');
          const link = document.createElement('a');
          link.href = image;
          link.download = 'qrcode.png';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }).catch(err => {
          console.error('Failed to generate QR code for download:', err);
        });
      }
    }
  };

  const handleClick = () => {
    // Only allow click toggle on devices that don't support hover
    if (!canHover) {
      setShowDownload(!showDownload);
    }
  };

  return (
    <div 
      ref={containerRef}
      className={`group relative inline-block border border-gray-300 rounded-lg hover:shadow-lg transition-shadow duration-300 ${
        !canHover ? 'cursor-pointer' : ''
      }`}
      style={{ width: size, height: size }}
      onClick={handleClick}
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full rounded-lg"
      />

      {watermarkImage && (
        <img
          ref={watermarkRef}
          src={watermarkImage}
          alt="Watermark"
          className="hidden"
        />
      )}

      {/* Download button that appears on hover (desktop) or click (mobile) */}
      <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 bg-black/80 rounded-lg ${
        showDownload ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
      }`}>
        <Button
          onClick={(e) => {
            e.stopPropagation();
            handleDownload();
          }}
          className="bg-white text-black hover:bg-gray-100 shadow-lg"
          size="sm"
        >
          Download
        </Button>
      </div>
    </div>
  );
}