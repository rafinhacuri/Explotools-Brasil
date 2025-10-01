declare module '#auth-utils'{
  interface User{
    email: string,
    level: 'admin' | 'user',
  }
}
