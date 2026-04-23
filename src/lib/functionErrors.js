const genericFunctionHttpMessage = "Edge Function returned a non-2xx status code";

function extractMessageFromPayload(payload) {
  if (!payload) {
    return "";
  }

  if (typeof payload === "string") {
    return payload.trim();
  }

  if (typeof payload.message === "string" && payload.message.trim()) {
    return payload.message.trim();
  }

  if (typeof payload.error === "string" && payload.error.trim()) {
    return payload.error.trim();
  }

  if (payload.error && typeof payload.error.message === "string" && payload.error.message.trim()) {
    return payload.error.message.trim();
  }

  return "";
}

async function extractMessageFromResponse(response) {
  if (!response || typeof response.text !== "function") {
    return "";
  }

  const readable = typeof response.clone === "function" ? response.clone() : response;
  const contentType = readable.headers?.get?.("Content-Type") || "";

  try {
    if (contentType.includes("application/json")) {
      const payload = await readable.json();
      const message = extractMessageFromPayload(payload);

      if (message) {
        return message;
      }
    }
  } catch {
    // Fall through to plain-text parsing below.
  }

  try {
    const text = (await readable.text()).trim();

    if (!text) {
      return "";
    }

    try {
      const payload = JSON.parse(text);
      return extractMessageFromPayload(payload) || text;
    } catch {
      return text;
    }
  } catch {
    return "";
  }
}

export async function normalizeFunctionError(error, fallback) {
  if (!error) {
    return fallback;
  }

  if (typeof error === "string") {
    return error;
  }

  const contextMessage = await extractMessageFromResponse(error.context);
  if (contextMessage) {
    return contextMessage;
  }

  if (error.message && error.message !== genericFunctionHttpMessage) {
    return error.message;
  }

  return fallback;
}
