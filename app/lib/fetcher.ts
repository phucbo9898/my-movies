export async function fetcher<T>(
  input: RequestInfo,
  init: RequestInit = {},
): Promise<T> {
  const headers = {
    "Content-Type": "application/json",
    ...(init.headers ?? {}),
  } as Record<string, string>;

  const body =
    init.body &&
    typeof init.body !== "string" &&
    !(init.body instanceof FormData)
      ? JSON.stringify(init.body)
      : init.body;

  const response = await fetch(input, {
    ...init,
    headers,
    body,
  });

  if (!response.ok) {
    const bodyText = await response.text();
    const message = bodyText || response.statusText;
    throw new Error(`Fetch failed (${response.status}): ${message}`);
  }

  return (await response.json()) as T;
}
