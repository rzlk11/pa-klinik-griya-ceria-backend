import { Sequelize } from "sequelize";
import db from "../config/Database.js";
import Obat from "./ObatModel.js";

const { DataTypes } = Sequelize;

const DetailResepObat = db.define('detail_resep_obat', {
  id_detail_resep: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  id_resep: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  id_obat: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  dosis: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  jumlah_obat: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  aturan_pakai: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  catatan_terapis: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
}, {
  freezeTableName: true,
});

DetailResepObat.belongsTo(Obat, { foreignKey: "id_obat", as: "obat" });
Obat.hasMany(DetailResepObat, { foreignKey: "id_obat", as: "detail_resep" });

export default DetailResepObat;