// Throw this from any controller: throw new ApiError(404, 'Room not found')
// errorHandler turns it into a JSON response with that status code.
export class ApiError extends Error {
  constructor(status, message, details) {
    super(message)
    this.status = status
    this.details = details
  }
}