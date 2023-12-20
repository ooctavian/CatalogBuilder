import type { Token } from "@/types/Token";
export function useAuth() {
  return useCookie<Token>("auth");
}
