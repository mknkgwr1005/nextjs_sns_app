export async function getLoginUserId(apiBaseUrl: string, token: string) {
  if (!token) return null;

  const res = await fetch(`${apiBaseUrl}/users/find`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  if (!res.ok) return null;

  const data = await res.json();
  return data.user?.id ?? null;
}
