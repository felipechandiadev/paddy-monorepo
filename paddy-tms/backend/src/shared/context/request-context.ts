export const REQUEST_CONTEXT_KEY = '__request_context__';

export interface RequestContext {
  requestId: string;
  correlationId: string;
}

export function setRequestContext(request: any, context: RequestContext) {
  request[REQUEST_CONTEXT_KEY] = context;
}

export function getRequestContext(request: any): RequestContext | undefined {
  return request[REQUEST_CONTEXT_KEY];
}
