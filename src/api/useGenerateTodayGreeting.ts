import { useCallback, useState } from 'react';
import { OLLAMA_CONFIG } from 'src/config/ollama.local';
import { database } from 'src/model';
import User from 'src/model/User';
import {
  buildTodayGreetingPrompt,
  getTodayGreetingFallback,
  getTodayGreetingCacheKey,
  sanitizeTodayGreeting,
  type TodayGreetingInput,
} from 'src/utils/todayGreeting';

type ModelEntry = {
  name: string;
  token?: string;
};

type OllamaGenerateResponse = {
  response?: string;
  message?: {
    content?: string;
  };
  error?: string;
};

const OLLAMA_BASE_URL = 'https://ollama.com';
const DEFAULT_MODELS = ['qwen3.5:397b-cloud', 'deepseek-v3.1:671b-cloud'];
const todayGreetingCache = new Map<string, string>();

const isModelUnavailableError = (errorMessage: string) => {
  const normalized = errorMessage.toLowerCase();
  return (
    normalized.includes('model') &&
    (normalized.includes('not found') ||
      normalized.includes('unavailable') ||
      normalized.includes('does not exist'))
  );
};

const extractContent = (payload: OllamaGenerateResponse) => {
  return payload.response ?? payload.message?.content;
};

const loadAvailableModels = async () => {
  let userModels: ModelEntry[] = [];

  try {
    const users = await database.get<User>('user').query().fetch();
    if (users.length > 0) {
      userModels = users[0].aiModels
        .filter(model => model.enabled !== false)
        .map(model => ({
          name: model.name,
          token: model.token || undefined,
        }));
    }
  } catch {
    return DEFAULT_MODELS.map(name => ({ name }));
  }

  const defaultModels: ModelEntry[] = DEFAULT_MODELS.map(name => ({ name }));
  return userModels.length > 0 ? [...userModels, ...defaultModels] : defaultModels;
};

export const useGenerateTodayGreeting = () => {
  const [data, setData] = useState<string | undefined>(undefined);
  const [isFetching, setIsFetching] = useState(false);
  const [isError, setIsError] = useState(false);

  const generateGreeting = useCallback(async (input: TodayGreetingInput) => {
    const cacheKey = getTodayGreetingCacheKey(input);
    const cachedGreeting = todayGreetingCache.get(cacheKey);

    if (cachedGreeting) {
      setData(cachedGreeting);
      setIsError(false);
      setIsFetching(false);
      return cachedGreeting;
    }

    setData(undefined);
    setIsFetching(true);
    setIsError(false);

    const endpoint = `${OLLAMA_BASE_URL}/api/generate`;
    const models = await loadAvailableModels();

    let lastError: unknown;

    for (const { name: model, token } of models) {
      try {
        const authToken = token || OLLAMA_CONFIG.apiKey;
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
          },
          body: JSON.stringify({
            model,
            prompt: buildTodayGreetingPrompt(input),
            stream: false,
          }),
        });

        const payload = (await response.json()) as OllamaGenerateResponse;
        if (!response.ok) {
          lastError = new Error(payload.error ?? 'Ollama request failed');
          if (payload.error && isModelUnavailableError(payload.error)) {
            continue;
          }
          continue;
        }

        const content = extractContent(payload);
        const sanitized = content ? sanitizeTodayGreeting(content) : '';

        if (!sanitized) {
          lastError = new Error('Empty response from Ollama');
          continue;
        }

        todayGreetingCache.set(cacheKey, sanitized);
        setData(sanitized);
        setIsError(false);
        setIsFetching(false);
        return sanitized;
      } catch (error) {
        lastError = error;
      }
    }

    setIsError(true);
    const fallback = getTodayGreetingFallback(input);
    todayGreetingCache.set(cacheKey, fallback);
    setData(fallback);
    setIsFetching(false);
    return fallback;
  }, []);

  return {
    data,
    isFetching,
    isError,
    generateGreeting,
  };
};