import { Op } from "sequelize";
import User from "../models/User.js";

type Option = {
  page: number;
  limit: number;
  name?: string;
};
export const getPaginatedUsers = async (option: Option) => {
  //inplements page by page logic
  const offset = (option.page - 1) * option.limit;

  //build an object of dynamic filters
  const filters = { name: option.name };

  //convert resulting array to object for filtering
  const where = Object.fromEntries(
    //build an array of key value pairs removing empty values
    Object.entries(filters).filter(([_, v]) => v?.toString().trim()),
  );

  const { rows, count } = await User.findAndCountAll({
    limit: option.limit,
    offset,
    order: [["createdAt", "DESC"]],
  });

  return {
    users: rows.map((user) => user.toJSON(true)),
    currentPage: option.page,
    totalPages: Math.ceil(count / option.limit),
    totalItems: count,
  };
};

export const editUser = async (user: User, id: string) => {
  const isUser = await User.findByPk(id);

  if (!isUser) {
    return isUser;
  }

  isUser.set({
    username: user.username,
    email: user.email,
    role: user.role,
    password: user.password,
    is_MFA_enabled: user.is_MFA_enabled,
  });

  const updatedUser = await isUser.save({ validate: false });

  return isUser;
};

export const removeUser = async (id: string) => {
  const user = await User.findByPk(id);

  if (!user) return user;

  await User.destroy({ where: { id } });

  return user;
};

export const addUser = async (userData: {
  username: string;
  email: string;
  password: string;
  is_MFA_enabled: boolean;
  role: string;
}) => {
  const user = await User.findOne({
    where: {
      [Op.or]: [{ email: userData.email }, { username: userData.username }],
    },
  });

  if (!user) return { user, newUser: null };

  const newUser = await User.create({
    username: userData.username,
    email: userData.email,
    password: userData.password,
    is_MFA_enabled: userData.is_MFA_enabled,
    role: userData.role,
  });

  return { user, newUser };
};

export const findUser = async (id: string) => {
  const user = await User.findByPk(id);
  return user;
};
