import { DocumentType } from "@typegoose/typegoose";
import { User, privateFiels } from "../model/user.model";
import { signJwt } from "../utils/jwt";
import SessionModel from "../model/session.model";
import { omit } from "lodash";
import config from "config";
import qs from "qs";
import axios from "axios";

export async function createSession({ userId }: { userId: string }) {
  return SessionModel.create({ user: userId });
}

export async function findSessionById(id: string) {
  return SessionModel.findById(id);
}

export async function signRefreshToken({ userId }: { userId: string }) {
  const session = await createSession({ userId });

  const refreshToken = signJwt(
    {
      session: session._id,
    },
    "refreshTokenPrivateKey",
    {
      expiresIn: "1y",
    }
  );

  return refreshToken;
}

export function signAccessToken(user: DocumentType<User>) {
  const payload = omit(user.toJSON(), privateFiels);

  const accessToken = signJwt(payload, "accessTokenPrivateKey", {
    expiresIn: "15m",
  });

  return accessToken;
}

// interface GoogleTokensResult {
//   access_token: string;
//   expires_in: number;
//   refresh_token: string;
//   scope: string;
//   id_token: string;
// }

// export async function getGoogleOauthTokens({
//   code,
// }: {
//   code: string;
// }): Promise<GoogleTokensResult> {
//   const url = "https://oauth2.googleapis.com/token";

//   const values = {
//     code,
//     client_id: config.get("googleClientId"),
//     client_secret: config.get("googleClientSecret"),
//     redirect_uri: config.get("googleOauthRedirectUrl"),
//     grant_type: "authorization_code",
//   };

//   try {
//     const res = await axios.post<GoogleTokensResult>(
//       url,
//       qs.stringify(values),
//       {
//         headers: {
//           "Content-Type": "application/x-www-form-urlencoded",
//         },
//       }
//     );
//     return res.data;
//   } catch (error: any) {
//     console.error(error, "Failed to fetch google oauth tokens");
//     throw new Error(error.message);
//   }
// }
