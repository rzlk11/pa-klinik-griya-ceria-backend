import { where } from "sequelize";
import Users from "../models/UserModel.js";
import argon from "argon2";

export const getUsers = async (req, res) => {
  try {
    const response = await Users.findAll({
      attributes: ["uuid", "name", "email", "role"],
    });
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const getUserById = async (req, res) => {
  try {
    const response = await Users.findOne({
      where: {
        uuid: req.params.id,
      },
      attributes: ["uuid", "name", "email", "role"],
    });
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const createUser = async (req, res) => {
  const { name, email, password, confPassword, role } = req.body;

  if (password !== confPassword)
    return res
      .status(400)
      .json({ msg: "Password dan Confirm Password tidak cocok!" });
  const hashedPassword = await argon.hash(password);
  try {
    await Users.create({
      name: name,
      email: email,
      password: hashedPassword,
      role: role || "admin",
    });

    res.status(201).json({ msg: "Register berhasil!" });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

export const updateUser = async (req, res) => {
  const { name, email, password, confPassword, role } = req.body;
  const user = await Users.findOne({
    where: {
      uuid: req.params.id,
    },
  });
  if (!user) return res.status(404).json({ msg: "User tidak ditemukan!" });
  if (password !== confPassword)
    return res
      .status(400)
      .json({ msg: "Password dan Confirm Password tidak cocok!" });
  let hashedPassword;
  if (password === "" || password === null) {
    hashedPassword = user.password;
  } else {
    hashedPassword = await argon.hash(password);
  }
  try {
    await Users.update(
      {
        name: name,
        email: email,
        password: hashedPassword,
        role: role || "admin",
      },
      {
        where: {
          uuid: req.params.id,
        },
      }
    );
    res.status(200).json({ msg: "Data user berhasil diupdate!" });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

export const deleteUser = async (req, res) => {
  const user = await Users.findOne({
    where: {
      uuid: req.params.id,
    },
  });
  if (!user) return res.status(404).json({ msg: "User tidak ditemukan!" });
  try {
    await Users.destroy({
      where: {
        uuid: req.params.id,
      },
    });
    res.status(200).json({ msg: "User berhasil dihapus!" });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};
