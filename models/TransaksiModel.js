import { Sequelize } from "sequelize";
import db from "../config/Database.js";
import Pasien from "./PasienModel.js";
import PelayananKesehatan from "./PelayananKesehatanModel.js";
import ResepObat from "./ResepObatModel.js";
import Terapis from "./TerapisModel.js";
import Antrian from "./AntrianModel.js";

const { DataTypes } = Sequelize;

const Transaksi = db.define('transaksi', {
  id_transaksi: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  id_pasien: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  id_pelayanan: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  id_resep: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  id_terapis: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  id_antrian: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  tanggal_transaksi: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  total_biaya: {
    type: DataTypes.DECIMAL(10,2),
    allowNull: false,
  },
  bukti_transaksi: {
    type: DataTypes.STRING,
    allowNull: true,
  },
}, {
  freezeTableName: true,
});

// Associations
Transaksi.belongsTo(Pasien, { foreignKey: "id_pasien", as: "pasien" });
Pasien.hasMany(Transaksi, { foreignKey: "id_pasien", as: "transaksi" });
Transaksi.belongsTo(PelayananKesehatan, { foreignKey: "id_pelayanan", as: "pelayanan" });
Transaksi.belongsTo(ResepObat, { foreignKey: "id_resep", as: "resep" });
Transaksi.belongsTo(Terapis, { foreignKey: "id_terapis", as: "terapis" });
Terapis.hasMany(Transaksi, { foreignKey: "id_terapis", as: "transaksi" });
Transaksi.belongsTo(Antrian, { foreignKey: "id_antrian", as: "antrian" });
Antrian.hasOne(Transaksi, { foreignKey: "id_antrian", as: "transaksi" });

export default Transaksi;