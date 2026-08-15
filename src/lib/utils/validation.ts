export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validatePassword(password: string): boolean {
  // Mínimo 8 caracteres
  return password.length >= 8;
}

export function validateRating(rating: number): boolean {
  return rating >= 1 && rating <= 10 && Number.isInteger(rating);
}

export function validateMovieId(id: unknown): id is number {
  return typeof id === "number" && id > 0;
}

export function validateUserId(id: unknown): id is string {
  return typeof id === "string" && id.length > 0;
}
