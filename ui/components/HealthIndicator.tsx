"use client";

import { useHealth } from "@/hooks/useHealth";

export default function HealthIndicator() {
  const { data: health, isLoading, error } = useHealth();

  const getStatusInfo = () => {
    if (isLoading) {
      return {
        dot: "bg-gray-400 animate-pulse",
        text: "API Checking...",
      };
    }

    if (error) {
      return {
        dot: "bg-red-500",
        text: "API Disconnected",
      };
    }

    if (health?.status === "UP") {
      return {
        dot: "bg-green-500",
        text: "API Connected",
      };
    }

    return {
      dot: "bg-yellow-500",
      text: "API Issues",
    };
  };

  const statusInfo = getStatusInfo();

  return (
    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium text-gray-600 bg-gray-100">
      <div className={`w-2 h-2 rounded-full ${statusInfo.dot}`}></div>
      <span>{statusInfo.text}</span>
    </div>
  );
}
