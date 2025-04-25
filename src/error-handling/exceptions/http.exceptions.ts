
import createError from 'http-errors';
import { HTTPMessages } from '../http/http-messages.js';
import { HTTPStatusCode } from '../http/http-status-codes.enum.js';


export class BadRequestException {
  constructor(message = HTTPMessages.BAD_REQUEST) {
    throw createError(HTTPStatusCode.BadRequest, message);
  }
}

export class UnauthorizedException {
  constructor(message = HTTPMessages.UNAUTHORIZED) {
    throw createError(HTTPStatusCode.Unauthorized, message);
  }
}

export class ForbiddenException {
  constructor(message = HTTPMessages.FORBIDDEN) {
    throw createError(HTTPStatusCode.Forbidden, message);
  }
}

export class NotFoundException {
  constructor(message = HTTPMessages.NOT_FOUND) {
    throw createError(HTTPStatusCode.NotFound, message);
  }
}

export class ConflictException {
  constructor(message = HTTPMessages.CONFLICT) {
    throw createError(HTTPStatusCode.Conflict, message);
  }
}

export class UnprocessableEntityException {
  constructor(message = HTTPMessages.UNPROCESSABLE_ENTITY) {
    throw createError(HTTPStatusCode.UnprocessableEntity, message);
  }
}

export class TooManyRequestsException {
  constructor(message = HTTPMessages.TOO_MANY_REQUESTS) {
    throw createError(HTTPStatusCode.TooManyRequests, message);
  }
}

export class InternalServerErrorException {
  constructor(message = HTTPMessages.INTERNAL_SERVER_ERROR) {
    throw createError(HTTPStatusCode.InternalServerError, message);
  }
}

export class BadGatewayException {
  constructor(message = HTTPMessages.BAD_GATEWAY) {
    throw createError(HTTPStatusCode.BadGateway, message);
  }
}

export class ServiceUnavailableException {
  constructor(message = HTTPMessages.SERVICE_UNAVAILABLE) {
    throw createError(HTTPStatusCode.ServiceUnavailable, message);
  }
}
