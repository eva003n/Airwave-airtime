import User from "../models/User.js";
import { Op } from "sequelize";
import { sequelize } from "../config/database/postgres/postgres.js";
import type { JwtPayload, Secret, SignOptions } from "jsonwebtoken";
import jwt from "jsonwebtoken";
import { compare } from "bcryptjs";
import {
  ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_SECRET,
  ACCESS_TOKEN_EXPIRY,
  APP_NAME,
  REFRESH_TOKEN_EXPIRY,
  NODE_ENV,
} from "../config/env.js";

const registerUser = async (userData: {
  username: string;
  email: string;
  password: string;
}) => {
  const user = await User.findOne({
    where: {
      [Op.or]: [{ email: userData.email }, { username: userData.username }],
    },
  });

  if (user) {
    return { user, newUser: null };
  }

  const newUser = await sequelize.transaction(
    async (transaction) =>
      await User.create(
        {
          username: userData.username,
          email: userData.email,
          password: userData.password,
        },
        { transaction },
      ),
  );

  return { user, newUser };
};

const logInUser = async (userData: { username: string; password: string }) => {
  //check if account exist
  const user = await User.findOne({ where: { username: userData.username } });

  if (!user) {
    return { user, valid: user };
  }

  //verify password
  const isValidPassword = await compare(
    userData.password,
    user.password as string,
  );

  if (!isValidPassword) return { user, valid: isValidPassword };

  //generate token for user session
  const { accessToken, refreshToken } = generateToken(user);

  //save refresh token in database
  user.refresh_token = refreshToken;
  await user.save();

  return { user, valid: isValidPassword };
};

const logOutUser = async (id: string) => {
  const user = await User.findByPk(id);

  user?.set("refresh_token", "");

  await user?.save();
};

const refreshUserToken = async (oldRefreshToken: string) => {
  //verify refresh token
  const decodedToken = jwt.verify(
    oldRefreshToken,
    process.env.REFRESH_TOKEN_SECRET as string,
  ) as JwtPayload;

  const user = await User.findByPk(decodedToken.userId);
  if (!user) return {user, accessToken: null, newRefreshToken: null};

  //generate new access & refresh token
  const { accessToken, refreshToken: newRefreshToken } = generateToken(user);
  //update user refresh token
  user.refresh_token = newRefreshToken;
  await user.save();

  return {user, accessToken, newRefreshToken}
};;


const generateToken = (user: User) => {
  const jwtAccessTokenSecret: Secret = ACCESS_TOKEN_SECRET as string;
  const jwtRefreshTokenSecret: Secret = REFRESH_TOKEN_SECRET as string;

  const accessToken = jwt.sign(
    //header -> signing algorithm and token type
    //payload
    {
      userId: user.id,
      userEmail: user.email,
      userRole: user.role,
    },
    //signing secret
    jwtAccessTokenSecret,
    //sign options
    {
      expiresIn: ACCESS_TOKEN_EXPIRY || "15m",
      issuer: APP_NAME || "Airwave airtime",
      subject: "Authentication",
    } as SignOptions,
  );

  const refreshToken = jwt.sign(
    {
      userId: user.id,
      userEmail: user.email,
      userRole: user.role,
    },
    jwtRefreshTokenSecret,
    {
      expiresIn: REFRESH_TOKEN_EXPIRY || "1d",
      issuer: APP_NAME || "Airwave airtime",
      subject: "Authentication",
    } as SignOptions,
  );

  return { accessToken, refreshToken };
};

export { registerUser, logInUser, logOutUser, refreshUserToken };
