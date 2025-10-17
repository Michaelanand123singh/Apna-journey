import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET!
const ADMIN_JWT_SECRET = process.env.ADMIN_JWT_SECRET!

export interface TokenPayload {
  userId: string
  email: string
  role: string
}

export function generateToken(payload: TokenPayload): string {
  if (!JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined')
  }
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' })
}

export function generateAdminToken(payload: TokenPayload): string {
  if (!ADMIN_JWT_SECRET) {
    throw new Error('ADMIN_JWT_SECRET is not defined')
  }
  return jwt.sign(payload, ADMIN_JWT_SECRET, { expiresIn: '12h' })
}

export function verifyToken(token: string): TokenPayload | null {
  if (!JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined')
  }
  try {
    return jwt.verify(token, JWT_SECRET) as TokenPayload
  } catch (error) {
    console.error('Token verification failed:', error)
    return null
  }
}

export function verifyAdminToken(token: string): TokenPayload | null {
  if (!ADMIN_JWT_SECRET) {
    throw new Error('ADMIN_JWT_SECRET is not defined')
  }
  try {
    return jwt.verify(token, ADMIN_JWT_SECRET) as TokenPayload
  } catch (error) {
    console.error('Admin token verification failed:', error)
    return null
  }
}

export function extractTokenFromHeader(authHeader: string | null): string | null {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null
  }
  return authHeader.substring(7)
}
