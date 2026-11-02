export const CLIMATES = [
  { id: 'tropical', label: 'Tropical', hint: 'Hot and wet year-round' },
  { id: 'dry', label: 'Dry', hint: 'Little rain' },
  { id: 'temperate', label: 'Temperate', hint: 'Mild seasons' },
  { id: 'continental', label: 'Continental', hint: 'Cold winters, warm summers' },
  { id: 'polar', label: 'Polar', hint: 'Cold most of the year' },
] as const;

export type ClimateName = (typeof CLIMATES)[number]['id'];

export interface CityClues {
  tempRange: string;
  rainfall: string;
  seasonFeel: string;
}

export interface RoundResponse {
  roundId: string;
  clues: CityClues;
}

export interface GuessResponse {
  correct: boolean;
  city: string;
  climate: ClimateName;
  explanation: string;
}

export interface ScoreResponse {
  correct: number;
  attempts: number;
}

export interface ClassifyRequest {
  averageHighC?: number | null;
  annualRainfallMm?: number | null;
  humidityPercent?: number | null;
}

export interface Classification {
  climate: ClimateName;
  reason: string;
  weatherNote: string;
}

export class ApiError extends Error {
  readonly status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

function messageFromBody(body: unknown, status: number): string {
  if (body && typeof body === 'object' && 'message' in body) {
    const message = (body as { message: unknown }).message;
    if (typeof message === 'string' && message.trim()) {
      return message;
    }
    if (Array.isArray(message)) {
      const lines = message.filter((item): item is string => typeof item === 'string' && item.trim() !== '');
      if (lines.length > 0) {
        return lines.join(' ');
      }
    }
  }
  if (status === 400) {
    return 'A required value is missing or out of range.';
  }
  return 'The climate service returned an error.';
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  let response: Response;
  try {
    response = await fetch(path, init);
  } catch {
    throw new ApiError(0, 'Could not reach the climate service.');
  }

  const text = await response.text();
  let body: unknown = null;
  if (text) {
    try {
      body = JSON.parse(text) as unknown;
    } catch {
      body = null;
    }
  }

  if (!response.ok) {
    throw new ApiError(response.status, messageFromBody(body, response.status));
  }

  return body as T;
}

export function startRound(): Promise<RoundResponse> {
  return request<RoundResponse>('/api/rounds', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: '{}',
  });
}

export function submitGuess(roundId: string, climate: ClimateName): Promise<GuessResponse> {
  return request<GuessResponse>('/api/guess', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ roundId, climate }),
  });
}

export function getScore(): Promise<ScoreResponse> {
  return request<ScoreResponse>('/api/score');
}

export function classifyClimate(input: ClassifyRequest): Promise<Classification> {
  const body: Record<string, number> = {};
  if (typeof input.averageHighC === 'number') {
    body.averageHighC = input.averageHighC;
  }
  if (typeof input.annualRainfallMm === 'number') {
    body.annualRainfallMm = input.annualRainfallMm;
  }
  if (typeof input.humidityPercent === 'number') {
    body.humidityPercent = input.humidityPercent;
  }
  return request<Classification>('/api/classify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
}

export function climateLabel(climate: ClimateName): string {
  const match = CLIMATES.find((item) => item.id === climate);
  return match ? match.label : climate;
}
