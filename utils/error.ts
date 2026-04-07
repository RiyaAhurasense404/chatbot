// utils/errors.ts

export class AppError extends Error {
    public code: string
    public statusCode: number
  
    constructor(message: string, code: string, statusCode: number) {
      super(message)
      this.name = 'AppError'
      this.code = code
      this.statusCode = statusCode
    }
  }
  
  export class ValidationError extends AppError {
    constructor(message: string) {
      super(message, 'VALIDATION_ERROR', 400)
      this.name = 'ValidationError'
    }
  }
  
  export class DatabaseError extends AppError {
    constructor(message: string) {
      super(message, 'DATABASE_ERROR', 500)
      this.name = 'DatabaseError'
    }
  }
  
  export class ProviderError extends AppError {
    constructor(message: string) {
      super(message, 'PROVIDER_ERROR', 502)
      this.name = 'ProviderError'
    }
  }
  
  export class ConfigError extends AppError {
    constructor(message: string) {
      super(message, 'CONFIG_ERROR', 500)
      this.name = 'ConfigError'
    }
  }
  
  export function handleApiError(error: unknown): Response {
    console.error('[API Error]', error)
  
    if (error instanceof AppError) {
      return Response.json(
        { error: error.message, code: error.code },
        { status: error.statusCode }
      )
    }
  
    return Response.json(
      { error: 'Something went wrong', code: 'INTERNAL_ERROR' },
      { status: 500 }
    )
  }