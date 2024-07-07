import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import "dotenv/config";
import User from "../../models/users.model.js";
import Role from "../../models/roles.model.js";
import { where } from "sequelize";

export const registerUser = async (req, res) => {
  try {
    const newUser = req.body;

    //* default 'user' role
    if (!newUser.roleId) {
      const userRole = await Role.findOne({ where: { name: "user" } });
      if (userRole) {
        newUser.roleId = userRole.id;
      } else {
        throw new Error("Role 'user' not found");
      }
    }

    //* check if 'role' exists
    if (newUser.roleId) {
      const userRole = await Role.findOne({ where: { id: newUser.roleId } });
      if (!userRole) {
        throw new Error(`Role '${newUser.roleId}' not found`);
      }
    }

    //* check if the 'body' matches the model
    const whiteList = Object.keys(User.getAttributes());
    for (const key in newUser) {
      if (!whiteList.includes(key)) {
        throw new Error(`Invalid attribute '${key}' in the body`);
      }
    }

    await User.create(newUser);

    const copyUser = { ...newUser };
    delete copyUser.password;

    res.status(201).json({
      status: "success",
      data: copyUser,
      message: "NEW USER HAS BEEN CREATED",
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: {
        exclude: ["password"],
      },
    });
    res.status(200).json(users);
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
};

export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id, {
      attributes: {
        exclude: ["password"],
      },
    });

    //* check if 'user' exists
    if (!user) {
      throw new Error(`The user with the id = '${id}' does not exist`);
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
};

export const UpdateInfoUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { body } = req;
    const userById = await User.findByPk(id, {
      attributes: {
        exclude: ["password"],
      },
    });

    //* check if 'user' exists
    if (!userById) {
      throw new Error(`The user with the id = '${id}' does not exist`);
    }

    //* check if the 'body' is empty
    if (Object.keys(body).length === 0) {
      throw new Error("The body should not be empty");
    }

    //* check if the 'body' matches the model
    const whiteList = Object.keys(User.getAttributes());
    for (const key in body) {
      if (!whiteList.includes(key)) {
        throw new Error(`Invalid attribute '${key}' in the body`);
      }
    }

    await User.update(body, {
      where: { id },
    });

    res.status(200).json({
      status: "success",
      UpdateData: userById,
      message: "THE USER HAS BEEN UPDATE",
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const userById = await User.findByPk(id);

    //* check if 'user' exists
    if (!userById) {
      throw new Error(`The user with the id = '${id}' does not exist`);
    }

    await User.destroy({ where: { id } });
    res.status(200).json({
      status: "success",
      message: "THE USER HAS BEEN DELETE",
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    //* validate user
    const user = await User.findOne({ where: { email } });
    if (!user) {
      throw new Error(`The user with the email '${email}' does not exist`);
    }

    //* validate password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      throw new Error("Incorrect password");
    }

    //* token generate
    const copyUser = { ...user.dataValues };
    delete copyUser.password;
    const token = jwt.sign(copyUser, process.env.JWT_SECRET, {
      algorithm: "HS512",
      expiresIn: "7d",
    });
    copyUser.token = token;

    res.status(200).json(copyUser);
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
};

export const recoverPassword = async (req, res) => {
  try {
    const { email, password } = req.body;
    const userByEmail = await User.findOne({
      where: { email },
    });

    //* check if the 'body' matches
    const whiteList = ["email", "password"];
    for (const key in req.body) {
      if (!whiteList.includes(key)) {
        throw new Error(`Invalid attribute '${key}' in the body`);
      }
    }

    //* verify email
    if (!userByEmail) {
      console.log(userByEmail);
      throw new Error(`the user with the email '${email}' does not exist`);
    }

    await User.update(password, { where: { email } });
    res.status(200).json({
      status: "success",
      message: "password updated successfully",
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
};
