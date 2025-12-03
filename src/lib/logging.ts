type LogLevel = 'info' | 'error' | 'warn';

interface LogMeta {
  event: string;
  context?: Record<string, unknown>;
  error?: unknown;
}

function format(level: LogLevel, meta: LogMeta) {
  const payload = {
    level,
    event: meta.event,
    context: meta.context ?? {},
    error: meta.error instanceof Error ? { message: meta.error.message, stack: meta.error.stack } : meta.error,
    timestamp: new Date().toISOString(),
  };
  return JSON.stringify(payload);
}

export function logInfo(event: string, context?: Record<string, unknown>) {
  console.log(format('info', { event, context }));
}

export function logWarn(event: string, context?: Record<string, unknown>) {
  console.warn(format('warn', { event, context }));
}

export function logError(event: string, error: unknown, context?: Record<string, unknown>) {
  console.error(format('error', { event, error, context }));
}
