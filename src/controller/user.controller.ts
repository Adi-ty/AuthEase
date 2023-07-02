import { Request, Response } from "express";
import { nanoid } from "nanoid";
import {
  CreateUserInput,
  ForgotPasswordInput,
  ResetPasswordInput,
  VerifyUserInput,
} from "../schema/user.schema";
import {
  createUser,
  findUserByEmail,
  findUserById,
} from "../service/user.service";
import sendEmail from "../utils/mailer";

export async function createUserHandler(
  req: Request<{}, {}, CreateUserInput>,
  res: Response
) {
  const body = req.body;

  try {
    const user = await createUser(body);

    await sendEmail({
      from: "test@example.com",
      to: user.email,
      subject: "AuthEase - Verify Your Email",
      text: `Verification Code: ${user.verificationCode}. Id: ${user._id} \n Please verify your email by going on the following link: http://localhost:3000/api/users/verify/${user._id}/${user.verificationCode}`,
    });

    return res.send("User Created Successfully");
  } catch (err: any) {
    if (err.code === 11000) {
      return res.status(409).send("User Already Exists");
    }

    return res.status(500).send(err.message);
  }
}

export async function verifyUserHandler(
  req: Request<VerifyUserInput>,
  res: Response
) {
  const id = req.params.id;
  const verificationCode = req.params.verificationCode;

  // find user by id
  const user = await findUserById(id);

  if (!user) {
    return res.send("Couldn't verify user");
  }

  // check to see if user is already verified
  if (user.verified) {
    return res.send("User already verified");
  }

  // check to see if verification code matches
  if (user.verificationCode === verificationCode) {
    user.verified = true;

    await user.save();

    return res.send("User verified successfully");
  }

  // If verification code doesn't match
  return res.send("Couldn't verify user");
}

export async function forgotPasswordHandler(
  req: Request<{}, {}, ForgotPasswordInput>,
  res: Response
) {
  // This message is intentionally vague to prevent people to use this endpoint to find out if an email exists in the database
  const message =
    "If an account with that email exists, we sent you an email to reset your password.";

  const { email } = req.body;

  // find user by email
  const user = await findUserByEmail(email);

  if (!user) {
    console.debug(`User with email ${email} not found`);
    return res.send(message);
  }

  if (!user.verified) {
    return res.send("User is not verified");
  }

  const passwordResetCode = nanoid();

  user.passwordResetCode = passwordResetCode;

  await user.save();

  await sendEmail({
    to: user.email,
    subject: "AuthEase - Reset Your Password",
    text: `Password Reset Code: ${passwordResetCode}. Id ${user._id}`,
  });

  console.debug(`Password reset email sent to ${email}`);
  return res.send(message);
}

export async function resetPasswordHandler(
  req: Request<ResetPasswordInput["params"], {}, ResetPasswordInput["body"]>,
  res: Response
) {
  const { id, passwordResetCode } = req.params;

  const { password } = req.body;

  const user = await findUserById(id);

  if (
    !user ||
    !user.passwordResetCode ||
    user.passwordResetCode !== passwordResetCode
  ) {
    return res.status(400).send("Could not reset password");
  }

  user.passwordResetCode = null;

  user.password = password;

  await user.save();

  return res.send("Successfully updated password");
}

export async function getCurrentUserHandler(req: Request, res: Response) {
  return res.send(res.locals.user);
}
