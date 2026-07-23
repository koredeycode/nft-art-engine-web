const BASE_URL = "/api";

async function request<T>(
  method: string,
  path: string,
  body?: unknown,
  customHeaders?: Record<string, string>,
): Promise<T> {
  const isFormData = body instanceof FormData;
  const headers: Record<string, string> = { ...customHeaders };

  if (body && !isFormData && !headers["Content-Type"]) {
    headers["Content-Type"] = "application/json";
  }

  const options: RequestInit = {
    method,
    headers,
    credentials: "include",
  };
  if (body) {
    options.body = isFormData ? (body as FormData) : JSON.stringify(body);
  }

  const res = await fetch(`${BASE_URL}${path}`, options);
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error ?? res.statusText);
  }
  return res.json();
}

export const api = {
  get: <T>(path: string) => request<T>("GET", path),
  post: <T>(path: string, body?: unknown) => request<T>("POST", path, body),
  patch: <T>(path: string, body?: unknown) => request<T>("PATCH", path, body),
  delete: <T>(path: string) => request<T>("DELETE", path),

  // Element file upload helper
  uploadElement: async (layerId: string, file: File, weight = 1): Promise<Element> => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("weight", weight.toString());
    return request<Element>("POST", `/layers/${layerId}/elements`, formData);
  },

  // Helper image URL generators
  getElementImageUrl: (elementId: string) => `${BASE_URL}/layers/elements/${elementId}/file`,
  getOutputImageUrl: (jobId: string, edition: number) =>
    `${BASE_URL}/exports/${jobId}/image/${edition}`,
};

export interface Project {
  id: string;
  userId: string;
  name: string;
  network: "eth" | "sol";
  namePrefix?: string;
  description?: string;
  baseUri?: string;
  canvasWidth: number;
  canvasHeight: number;
  smoothing: boolean;
  rarityDelim: string;
  dnaTolerance: number;
  bgGenerate: boolean;
  bgBrightness?: string;
  bgStatic: boolean;
  bgDefault?: string;
  shuffleOrder: boolean;
  extraMetadata?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
  layerCount?: number;
  elementCount?: number;
}

export interface Layer {
  id: string;
  projectId: string;
  name: string;
  order: number;
  blendMode: string;
  createdAt: string;
  updatedAt: string;
}

export interface Element {
  id: string;
  layerId: string;
  filename: string;
  weight: number;
  createdAt: string;
}

export interface GenerationJob {
  id: string;
  projectId: string;
  status: "queued" | "running" | "completed" | "failed" | "cancelled";
  totalEditions: number;
  currentEdition: number;
  progress: number;
  error?: string;
  startedAt?: string;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface NFTMetadata {
  name: string;
  description: string;
  image: string;
  dna: string;
  edition: number;
  date: number;
  attributes: Array<{ trait_type: string; value: string }>;
  compiler?: string;
}
