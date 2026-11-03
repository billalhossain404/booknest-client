import { betterAuth } from "better-auth";
import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { MongoClient } from "mongodb";
import { Resend } from "resend";
import { jwt } from "better-auth/plugins";

const client = new MongoClient(
  process.env.BETTER_AUTH_DB_URL || process.env.BATTER_AUTH_DB_URL || "",
  {
    serverApi: {
      version: "1",
      strict: true,
      deprecationErrors: true,
    },
  },
);
const db = client.db();
const resend = new Resend(process.env.RESEND_API_KEY);

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL,
  secret: process.env.BETTER_AUTH_SECRET,
  database: mongodbAdapter(db, { client }),
  emailAndPassword: {
    enabled: true,
    // The app does not currently provide an email verification flow.
    requireEmailVerification: false,
    sendResetPassword: async ({ user, url }) => {
      await resend.emails.send({
        from: "BookNest <onboarding@resend.dev>",
        to: user.email,
        subject: "Reset Your Password | BookNest",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 500px; margin: auto; padding: 30px; color: #333;">
            <h2 style="color: #234D3C;">BookNest</h2>
            <h3>Reset Your Password</h3>
            <p>Hello ${user.name || "there"},</p>
            <p>We received a request to reset your BookNest account password.</p>
            <a href="${url}" style="display: inline-block; padding: 12px 24px; background: #234D3C; color: white; text-decoration: none; border-radius: 6px;">
              Reset Password
            </a>
            <p style="margin-top: 25px; font-size: 13px; color: #777;">
              If you didn't request a password reset, you can safely ignore this email.
            </p>
            <p style="font-size: 12px; color: #999;">© BookNest. All rights reserved.</p>
          </div>
        `,
      });
    },
  },
  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    expiresIn: 3600,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
    facebook: {
      clientId: process.env.FACEBOOK_CLIENT_ID as string,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET as string,
      scopes: ["email", "public_profile"],
      mapProfileToUser: (profile) => ({
        email: profile.email ?? `fb${profile.name}@private.com`,
      }),
    },
  },
    plugins: [jwt()],
    session: {
      cookieCache: {
        enabled: true,
        strategy: "jwt",
        maxAge: 60 * 60 * 24 * 3, // 3 days
      },
    },
});
