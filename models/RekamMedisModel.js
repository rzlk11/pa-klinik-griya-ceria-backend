import { Sequelize } from "sequelize";
import db from "../config/Database.js";
import Pasien from "./PasienModel.js";
import Dokter from "./DokterModel.js";
import PelayananKesehatan from "./PelayananKesehatanModel.js";

const { DataTypes } = Sequelize;

const RekamMedis = db.define('rekam_medis', {
  id_rekam_medis: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  id_pasien: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  id_dokter: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  id_pelayanan: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  diagnosa: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  tindakan: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  catatan: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  berat_badan: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: true,
    defaultValue: null,
  },
  suhu: {
    type: DataTypes.DECIMAL(4, 1),
    allowNull: true,
    defaultValue: null,
  },
}, {
  freezeTableName: true,
});

// Association RekamMedis <-> Pasien
RekamMedis.belongsTo(Pasien, { foreignKey: "id_pasien", as: "pasien" });
Pasien.hasMany(RekamMedis, { foreignKey: "id_pasien", as: "rekam_medis" });

// Association RekamMedis <-> Dokter
RekamMedis.belongsTo(Dokter, { foreignKey: "id_dokter", as: "dokter" });
Dokter.hasMany(RekamMedis, { foreignKey: "id_dokter", as: "rekam_medis" });

// Association RekamMedis <-> PelayananKesehatan
RekamMedis.belongsTo(PelayananKesehatan, { foreignKey: "id_pelayanan", as: "pelayanan" });
PelayananKesehatan.hasMany(RekamMedis, { foreignKey: "id_pelayanan", as: "rekam_medis" });

export default RekamMedis;