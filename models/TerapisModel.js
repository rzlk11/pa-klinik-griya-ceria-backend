import { Sequelize } from "sequelize";
import db from "../config/Database.js";

const { DataTypes } = Sequelize;

const Terapis = db.define('terapis', {
  id_terapis: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  nama_terapis: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  spesialisasi: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  nomor_telepon: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  jadwal_praktek: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
}, {
  freezeTableName: true,
});

export default Terapis;
