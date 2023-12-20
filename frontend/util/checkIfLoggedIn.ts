import { useAuth } from "./useAuth";
export async function checkIfLoggedIn(): Promise<boolean> {
  const present = new Date();
  const auth = useAuth();
  const config = useRuntimeConfig().public;
  if (auth.value) {
    if (new Date(Date.parse(auth.value["expiresAt"])) < present) {
      try {
        const data: any = await $fetch(`${config.backendUrl}/auth/refresh`, {
          method: "POST",
          headers: {
            "X-Token-Id": auth.value.tokenId,
            authorization: `Bearer ${auth.value.refreshToken}`,
          },
        });
        auth.value = data;
        return true;
      } catch (e) {
        return false;
      }
    }
    return true;
  }
  return false;
}
