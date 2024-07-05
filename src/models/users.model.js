import { DataTypes } from "sequelize";
import db from "../utils/database.js";
import Role from "./roles.model.js";
import bcrypt from "bcrypt";

const User = db.define(
  "users",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING(30),
    },
    lastname: {
      type: DataTypes.STRING(30),
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    },
    gender: {
      type: DataTypes.STRING(10),
    },
    avatar: {
      type: DataTypes.STRING,
      defaultValue:
        "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
    },
    roleId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Role,
        key: "id",
      },
    },
  },
  {
    timestamps: false,
    hooks: {
      beforeCreate: async (user, option) => {
        const hashed = await bcrypt.hash(user.password, 10);
        user.password = hashed;
      },
    },
  }
);

//* relationship between tables

User.belongsTo(Role, {
  foreignKey: "roleId",
  as: "role",
});

Role.hasMany(User, {
  foreignKey: "roleId",
  as: "users",
});

export default User;
