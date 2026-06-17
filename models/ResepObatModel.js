import { Sequelize } from "sequelize";
import db from "../config/Database.js";
import DetailResepObat from "./DetailResepObatModel.js";

const { DataTypes } = Sequelize;

const ResepObat = db.define('resep_obat', {
  id_resep: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  id_rekam_medis: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  resep_teks: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  tanggal_resep: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  status_resep: {
    type: DataTypes.ENUM('Aktif', 'Selesai', 'Dibatalkan'),
    allowNull: false,
  },
}, {
  freezeTableName: true,
});

ResepObat.hasMany(DetailResepObat, { foreignKey: "id_resep", as: "details" });
DetailResepObat.belongsTo(ResepObat, { foreignKey: "id_resep", as: "resep" });

export default ResepObat;