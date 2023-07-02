import { Request, Response } from "express";
import { CreateSessionInput } from "../schema/auth.schema";
import {
  findUserByEmail,
  findUserById,
  // getGoogleUser
} from "../service/user.service";
import {
  findSessionById,
  // getGoogleOauthTokens,
  signAccessToken,
  signRefreshToken,
} from "../service/auth.service";
import { get } from "lodash";
import { verifyJwt } from "../utils/jwt";
import config from "config";
import jwt from "jsonwebtoken";

export async function createSessionHandler(
  req: Request<{}, {}, CreateSessionInput>,
  res: Response
) {
  const message = "Invalid email or password"; // Keeping this message vague to prevent it from being used to check if an email exists in the database
  const { email, password } = req.body;

  const user = await findUserByEmail(email);

  if (!user) {
    return res.send(message);
  }

  if (!user.verified) {
    return res.send("Please verify your email address");
  }

  const isValid = await user.validatePassword(password);

  if (!isValid) {
    return res.send(message);
  }

  // sing a access token
  const accessToken = signAccessToken(user);

  // sign a refresh token
  // @ts-ignore
  const refreshToken = await signRefreshToken({ userId: user._id });

  // send refresh & access token

  return res.send({
    accessToken,
    refreshToken,
  });
}

export async function refreshAcessTokenHandler(req: Request, res: Response) {
  const refreshToken = get(req, "headers.x-refresh") as string;

  const decoded = verifyJwt<{ session: string }>(
    refreshToken,
    "refreshTokenPublicKey"
  );

  if (!decoded) {
    return res.status(401).send("Could not refresh access token");
  }

  const session = await findSessionById(decoded.session);

  if (!session || !session.valid) {
    return res.status(401).send("Could not refresh access token");
  }

  const user = await findUserById(String(session.user));

  if (!user) {
    return res.status(401).send("Could not refresh access token");
  }

  const accessToken = signAccessToken(user);

  return res.send({ accessToken });
}

// export async function googleOauthHandler(req: Request, res: Response) {
//   // get the code from qs
//   const code = req.query.code as string;

//   try {
//     // get id token and access token with code
//     const { id_token, access_token } = await getGoogleOauthTokens({ code });

//     // get the user with token
//     const googleUser = await getGoogleUser({ id_token, access_token });
//     // jwt.decode(id_token);

//     // upsert the user

//     // create the session

//     // create access token and refresh token

//     // set cookies

//     // redirect back to client
//   } catch (err) {
//     console.error(err, "Failed to authenticate with google");
//     return res.redirect(`${config.get("origin")}/oauth/error`);
//   }
// }
