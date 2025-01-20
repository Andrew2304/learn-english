import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/**
 * Custom decorator to extract a specific header value
 * @param headerName The name of the header to extract
 */
export const HeadersDecorator = createParamDecorator(
  (headerName: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return headerName
      ? request.headers[headerName.toLowerCase()]
      : request.headers;
  },
);
