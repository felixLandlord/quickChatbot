import type {
  UIMessage,
  UIMessagePart,
} from 'ai';
import { type ClassValue, clsx } from 'clsx';
import { formatISO } from 'date-fns';
import { twMerge } from 'tailwind-merge';
import type { DBMessage, Document } from '@/lib/db/schema';
import { ChatbotError, type ErrorCode } from './errors';
import type { ChatMessage, ChatTools, CustomUIDataTypes } from './types';

export type Geo = {
  city?: string;
  country?: string;
  latitude?: string;
  longitude?: string;
};

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const fetcher = async (url: string) => {
  const response = await fetch(url);

  if (!response.ok) {
    const { code, cause } = await response.json();
    throw new ChatbotError(code as ErrorCode, cause);
  }

  return response.json();
};

export async function fetchWithErrorHandlers(
  input: RequestInfo | URL,
  init?: RequestInit,
) {
  try {
    const response = await fetch(input, init);

    if (!response.ok) {
      const { code, cause } = await response.json();
      throw new ChatbotError(code as ErrorCode, cause);
    }

    return response;
  } catch (error: unknown) {
    if (typeof navigator !== 'undefined' && !navigator.onLine) {
      throw new ChatbotError('offline:chat');
    }

    throw error;
  }
}

export function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export function getDocumentTimestampByIndex(
  documents: Document[],
  index: number,
) {
  if (!documents) { return new Date(); }
  if (index > documents.length) { return new Date(); }

  return documents[index].createdAt;
}

export function sanitizeText(text: string) {
  return text.replace('<has_function_call>', '');
}

export function convertToUIMessages(messages: DBMessage[]): ChatMessage[] {
  return messages.map((message) => ({
    id: message.id,
    role: message.role as 'user' | 'assistant' | 'system',
    parts: message.parts as UIMessagePart<CustomUIDataTypes, ChatTools>[],
    metadata: {
      createdAt: formatISO(message.createdAt),
    },
  }));
}

export function getTextFromMessage(message: ChatMessage | UIMessage): string {
  return message.parts
    .filter((part) => part.type === 'text')
    .map((part) => (part as { type: 'text'; text: string}).text)
    .join('');
}

export function getIpAddress(request: Request): string | undefined {
  const forwardedFor = request.headers.get('x-forwarded-for');
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim();
  }
  
  const realIp = request.headers.get('x-real-ip');
  if (realIp) {
    return realIp;
  }
  
  return undefined;
}

export function getGeolocation(request: Request): Geo {
  const cfCity = request.headers.get('cf-ipcity');
  const cfCountry = request.headers.get('cf-ipcountry');
  const cfLatitude = request.headers.get('cf-ip-lat');
  const cfLongitude = request.headers.get('cf-ip-lon');
  
  if (cfCity || cfCountry) {
    return {
      city: cfCity ?? undefined,
      country: cfCountry ?? undefined,
      latitude: cfLatitude ?? undefined,
      longitude: cfLongitude ?? undefined,
    };
  }
  
  const vercelCity = request.headers.get('x-vercel-ip-city');
  const vercelCountry = request.headers.get('x-vercel-ip-country');
  const vercelLatitude = request.headers.get('x-vercel-ip-latitude');
  const vercelLongitude = request.headers.get('x-vercel-ip-longitude');
  
  if (vercelCity || vercelCountry) {
    return {
      city: vercelCity ?? undefined,
      country: vercelCountry ?? undefined,
      latitude: vercelLatitude ?? undefined,
      longitude: vercelLongitude ?? undefined,
    };
  }
  
  return {
    city: undefined,
    country: undefined,
    latitude: undefined,
    longitude: undefined,
  };
}
