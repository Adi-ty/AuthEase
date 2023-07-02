import UserModel, { User } from "../model/user.model";
import axios from "axios";

export function createUser(input: Partial<User>) {
  return UserModel.create(input);
}

export function findUserById(id: string) {
  return UserModel.findById(id);
}

export function findUserByEmail(email: string) {
  return UserModel.findOne({ email });
}

// interface GoogleUserResult {
//   id: string;
//   email: string;
//   verified_email: boolean;
//   name: string;
//   given_name: string;
//   family_name: string;
//   picture: string;
//   locale: string;
// }

// export async function getGoogleUser({
//   id_token,
//   access_token,
// }: {
//   id_token: string;
//   access_token: string;
// }): Promise<GoogleUserResult> {
//   try {
//     const res = await axios.get<GoogleUserResult>(
//       `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${access_token}`,
//       {
//         headers: {
//           Authorization: `Bearer ${id_token}`,
//         },
//       }
//     );

//     return res.data;
//   } catch (error: any) {
//     console.error(error, "Failed to fetch google user");
//     throw new Error(error.message);
//   }
// }

// export async function findAndUpdateUser(query: , update, options){

// }