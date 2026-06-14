import { Sequelize } from "sequelize";
import db from "../config/Database.js";

const { DataTypes } = Sequelize;

const Vaksin = db.define(
  "vaksin",
  {
    id_vaksin: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    nama_vaksin: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    jenis: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    stok: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    harga_per_unit: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    satuan: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    freezeTableName: true,
    timestamps: true,
  }
);

export default Vaksin;
