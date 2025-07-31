import { BadgeCheckIcon, Rss } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function Badges({ className }: { className?: string }) {
  return (
    <div className={cn("flex flex-row gap-2", className)}>
      <Badge variant="nothing" className="bg-blue-500 text-white" asChild>
        <Link
          href="https://github.com/faintastic/qrcode-generator"
          target="_blank"
        >
          <BadgeCheckIcon />
          Open Source
        </Link>
      </Badge>
      <Badge variant="nothing" className="bg-[#373737] text-white" asChild>
        <Link href="https://nextjs.org" target="_blank">
          <Rss />
          Next.js
        </Link>
      </Badge>
    </div>
  );
}
