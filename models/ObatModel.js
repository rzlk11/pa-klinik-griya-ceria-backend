import { Sequelize } from "sequelize";
import db from "../config/Database.js";

const { DataTypes } = Sequelize;

const Obat = db.define('obat', {
  id_obat: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  nama_obat: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  kekuatan: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  jenis: {
    type: DataTypes.ENUM('Tablet', 'Kapsul', 'Sirup', 'Salep', 'Lainnya'),
    allowNull: false,
  },
  stok: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  harga_per_unit: {
    type: DataTypes.DECIMAL(10,2),
    allowNull: false,
  },
  satuan: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  freezeTableName: true,
});

export default Obat;