import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { connectToDB } from '@/lib/connection/mongoose';
import User from '@/lib/models/user.model';

export async function POST(request: Request) {
  try {
    const { refreshToken } = await request.json();

    if (!refreshToken) {
      return NextResponse.json({ error: 'Refresh token required' }, { status: 401 });
    }

    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET!) as any;

    await connectToDB();
    const user = await User.findById(decoded.sub);

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 401 });
    }

    const accessToken = jwt.sign(
      {
        sub: user._id.toString(),
        email: user.email,
        name: user.fullName,
        roles: [user.role],
        emailVerified: user.emailVerified,
        phoneVerified: user.phoneVerified,
        mfaEnabled: user.twoFactorAuthEnabled,
      },
      process.env.JWT_ACCESS_SECRET!,
      { expiresIn: '15m' }
    );

    const newRefreshToken = jwt.sign(
      { sub: user._id.toString() },
      process.env.JWT_REFRESH_SECRET!,
      { expiresIn: '7d' }
    );

    return NextResponse.json({ accessToken, refreshToken: newRefreshToken });
  } catch (error) {
    return NextResponse.json({ error: 'Invalid refresh token' }, { status: 401 });
  }
}
