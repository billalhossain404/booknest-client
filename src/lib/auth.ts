import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "@better-auth/mongo-adapter";

const client = new MongoClient(process.env.BATTER_AUTH_DB_URL || "", {
  serverApi: {
    version: "1",
    strict: true,
    deprecationErrors: true,
  },
});
const db = client.db();

export const auth = betterAuth({
  database: mongodbAdapter(db, {
    client,
  }),
  emailAndPassword: {
    enabled: true,
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
      mapProfileToUser: (profile) => {
        if (profile.email || profile.picture) {
          return {};
        }

        const facebookUserId = "sub" in profile ? profile.sub : profile.id;
        return {
          email: `facebook-${facebookUserId}@users.booknest.local`,
        };
      },
    },
  },
});