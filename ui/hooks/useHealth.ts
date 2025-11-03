import { useQuery } from "@tanstack/react-query";
import axios from "axios";

interface HealthResponse {
  status: string;
  components?: {
    [key: string]: {
      status: string;
      details?: any;
    };
  };
}

const healthApi = axios.create({
  baseURL: "http://34.237.223.247:8080", // Direct actuator endpoint without /api prefix
  timeout: 5000,
});

export const useHealth = () => {
  return useQuery<HealthResponse>({
    queryKey: ["health"],
    queryFn: async () => {
      const response = await healthApi.get("/actuator/health");
      return response.data;
    },
    refetchInterval: 30000, // Refetch every 30 seconds
    retry: 3,
    retryDelay: 1000,
  });
};
