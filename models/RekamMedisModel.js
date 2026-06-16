import { Sequelize } from "sequelize";
import db from "../config/Database.js";
import Pasien from "./PasienModel.js";
import Terapis from "./TerapisModel.js";
import PelayananKesehatan from "./PelayananKesehatanModel.js";
import ResepObat from "./ResepObatModel.js";
import Antrian from "./AntrianModel.js";

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
  id_terapis: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  id_pelayanan: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  id_antrian: {
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

// Association RekamMedis <-> Terapis
RekamMedis.belongsTo(Terapis, { foreignKey: "id_terapis", as: "terapis" });
Terapis.hasMany(RekamMedis, { foreignKey: "id_terapis", as: "rekam_medis" });

// Association RekamMedis <-> PelayananKesehatan
RekamMedis.belongsTo(PelayananKesehatan, { foreignKey: "id_pelayanan", as: "pelayanan" });
PelayananKesehatan.hasMany(RekamMedis, { foreignKey: "id_pelayanan", as: "rekam_medis" });

// Association RekamMedis <-> ResepObat
RekamMedis.hasMany(ResepObat, { foreignKey: "id_rekam_medis", as: "resep_obat" });
ResepObat.belongsTo(RekamMedis, { foreignKey: "id_rekam_medis", as: "rekam_medis_detail" });

// Association RekamMedis <-> Antrian
RekamMedis.belongsTo(Antrian, { foreignKey: "id_antrian", as: "antrian" });
Antrian.hasOne(RekamMedis, { foreignKey: "id_antrian", as: "rekam_medis" });

export default RekamMedis;