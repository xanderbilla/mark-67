"use client";

import { useHealth } from "@/hooks/useHealth";
import { CheckCircle, XCircle, AlertCircle, Loader2 } from "lucide-react";

export default function HealthIndicator() {
  const { data: health, isLoading, error } = useHealth();

  const getStatusInfo = () => {
    if (isLoading) {
      return {
        icon: <Loader2 className="h-4 w-4 animate-spin" />,
        text: "Checking...",
        color: "text-gray-500",
        bgColor: "bg-gray-100",
      };
    }

    if (error) {
      return {
        icon: <XCircle className="h-4 w-4" />,
        text: "Offline",
        color: "text-red-600",
        bgColor: "bg-red-50",
      };
    }

    if (health?.status === "UP") {
      return {
        icon: <CheckCircle className="h-4 w-4" />,
        text: "Online",
        color: "text-green-600",
        bgColor: "bg-green-50",
      };
    }

    return {
      icon: <AlertCircle className="h-4 w-4" />,
      text: "Issues",
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
    };
  };

  const statusInfo = getStatusInfo();

  return (
    <div
      className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${statusInfo.color} ${statusInfo.bgColor}`}
    >
      {statusInfo.icon}
      <span>Backend {statusInfo.text}</span>
    </div>
  );
}
