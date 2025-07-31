"use client";

import { useState, useEffect } from "react";
import QRCode from "../QRCodeSaved";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
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
import Badges from "../Badges";
import database from "@/lib/database";

interface SavedQR {
  value: string;
  bg: string;
  fg: string;
  watermark: string;
  timestamp: number;
}

export default function Saved() {
  const [savedQRs, setSavedQRs] = useState<SavedQR[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadSavedQRs = async () => {
      try {
        const saved = await database.get("savedQrs") || [];
        setSavedQRs(saved);
      } catch (error) {
        console.error("Failed to load saved QR codes:", error);
      }
      setLoading(false);
    };

    loadSavedQRs();
  }, []);

  const handleDelete = async (index: number) => {
    try {
      const updatedQRs = savedQRs.filter((_, i) => i !== index);
      setSavedQRs(updatedQRs);
      await database.set("savedQrs", updatedQRs);
    } catch (error) {
      console.error("Failed to delete QR code:", error);
    }
  };

  const handleClearAll = async () => {
    try {
      setSavedQRs([]);
      await database.set("savedQrs", []);
    } catch (error) {
      console.error("Failed to clear all QR codes:", error);
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="w-full">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2">
          Saved QR Codes
        </h1>

        <Badges className="w-full flex justify-center mt-2" />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4 sm:mt-6 px-2">
          {[...Array(4)].map((_, index) => (
            <div key={index} className="p-4 border rounded-lg">
              <div className="flex flex-col items-center space-y-3">
                <Skeleton className="h-48 w-48" />
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-8 w-20" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2">
          Saved QR Codes
        </h1>

      <Badges className="w-full flex justify-center mt-2" />

      {savedQRs.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="text-6xl mb-4">📱</div>
          <h2 className="text-xl font-semibold mb-2">No saved QR codes yet</h2>
          <p className="text-muted-foreground">
            Create a QR code and click the save button to see it here
          </p>
        </div>
      ) : (
        <div className="h-96 overflow-y-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4 sm:mt-6 px-2">
            {savedQRs.map((qr, index) => (
              <div key={index} className="p-4 border rounded-lg bg-primary hover:shadow-md transition-shadow">
                <div className="flex flex-col items-center space-y-3">
                  <QRCode
                    value={qr.value}
                    bgColor={qr.bg}
                    fgColor={qr.fg}
                    watermarkImage={qr.watermark}
                    size={164}
                    onDelete={() => handleDelete(index)}
                  />
                  
                  <div className="text-center space-y-1 w-full">
                    <p className="text-sm text-muted-foreground">
                      Saved on {formatDate(qr.timestamp)}
                    </p>
                    <p className="text-sm font-medium break-all max-w-full">
                      {qr.value.length > 50 ? `${qr.value.substring(0, 50)}...` : qr.value}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}