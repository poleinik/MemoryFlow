import { useCallback, useState } from 'react';
import { OLLAMA_CONFIG } from 'src/config/ollama.local';
import { database } from 'src/model';
import User from 'src/model/User';

type CardQaItem = {
  question: string;
  answer: string;
};

type GenerateCardQaData = CardQaItem[] | string;

type ModelEntry = {
  name: string;
  token?: string;
};

type GenerateCardQaArgs = {
  text: string;
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

const buildPrompt = (text: string) => {
  return `Представь, что ты студент, который готовится к экзамену. У тебя есть конспект. Выдели из него ключевые тезисы.

Требования к каждому тезису:
• Перефразируй, не копируй дословно
• Сформулируй в виде вопроса и ответа
• Вопрос должен быть по теме

Формат ответа:
[
    {"question": "Это тезис?","answer":"Это ответ."},
]
Пример ответа:
[
    {"question": "Какие бывают паттерны?","answer":"Паттерны бывают..."},
    {"question": "Что такое энергия покоя?","answer":"Энергия покоя это..."},
]

Текст: ${text}`;
};


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
    console.log('Extracting content from payload:', payload);
  return payload.response ?? payload.message?.content;
};

export const useGenerateCardQa = () => {
  const [isFetching, setIsFetching] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [data, setData] = useState<GenerateCardQaData | undefined>(undefined);

  const generateCardQa = useCallback(
    async ({ text }: GenerateCardQaArgs) => {
      setIsFetching(true);
      setIsError(false);
      setIsSuccess(false);
      setData(undefined);

      const endpoint = `${OLLAMA_BASE_URL}/api/generate`;
      const trimmedText = text.trim();

      if (!trimmedText) {
        setIsFetching(false);
        setIsError(true);
        return;
      }

      // Load user-saved models from DB
      let userModels: ModelEntry[] = [];
      try {
        const users = await database.get<User>('user').query().fetch();
        if (users.length > 0) {
          userModels = users[0].aiModels
            .filter(m => m.enabled !== false)
            .map(m => ({
              name: m.name,
              token: m.token || undefined,
            }));
        }
      } catch {
        // ignore DB errors, fall back to defaults
      }

      const defaultModels: ModelEntry[] = DEFAULT_MODELS.map(name => ({ name }));
      const models: ModelEntry[] = userModels.length > 0
        ? [...userModels, ...defaultModels]
        : defaultModels;

      let lastError: unknown;

      for (const { name: model, token } of models) {
        try {
          const authToken = token || OLLAMA_CONFIG.apiKey;
          const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              ...(authToken
                ? { Authorization: `Bearer ${authToken}` }
                : {}),
            },
            body: JSON.stringify({
              model,
              prompt: buildPrompt(trimmedText),
              stream: false,
            }),
          });

          const payload = (await response.json()) as OllamaGenerateResponse;

          console.log(`Ollama response for model ${model}:`, payload);
          if (!response.ok) {
            lastError = new Error(payload.error ?? 'Ollama request failed');
            if (payload.error && isModelUnavailableError(payload.error)) {
              continue;
            }
            continue;
          }

          const content = extractContent(payload);
          if (!content) {
            lastError = new Error('Empty response from Ollama');
            continue;
          }

          let resolvedData: GenerateCardQaData = content;
          try {
            resolvedData = JSON.parse(content) as CardQaItem[];
          } catch {
            resolvedData = content;
          }

          setData(resolvedData);
          setIsSuccess(true);
          setIsError(false);
          setIsFetching(false);
          return;
        } catch (error) {
          lastError = error;
          continue;
        }
      }

      console.log('generateCardQa failed', lastError);
      setData(undefined);
      setIsSuccess(false);
      setIsError(true);
      setIsFetching(false);
    },
    [],
  );

  return {
    generateCardQa,
    isFetching,
    isError,
    isSuccess,
    data,
  };
};