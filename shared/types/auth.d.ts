declare module '#auth-utils' {
  interface User {
    email: string
    level: AuthLevel
  }
}

export type AuthLevel = 'admin' | 'user'
