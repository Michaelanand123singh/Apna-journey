import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  return NextResponse.json(
    { 
      success: false, 
      message: 'Registration is disabled. Please contact admin to create an account.' 
    },
    { status: 403 }
  )
}
