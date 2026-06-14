import { Sequelize } from "sequelize";
import db from "../config/Database.js";
import Pasien from "./PasienModel.js";
import Terapis from "./TerapisModel.js";

const { DataTypes } = Sequelize;

const Antrian = db.define('antrian', {
  id_antrian: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  id_pasien: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  id_terapis: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  tanggal_antrian: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  keluhan: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  berat_badan: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: true,
  },
  suhu: {
    type: DataTypes.DECIMAL(4, 1),
    allowNull: true,
  },
  status_antrian: {
    type: DataTypes.ENUM('Menunggu', 'Diperiksa', 'Selesai Periksa', 'Menunggu Obat', 'Selesai'),
    allowNull: false,
    defaultValue: 'Menunggu'
  }
}, {
  freezeTableName: true,
});

// Associations
Antrian.belongsTo(Pasien, { foreignKey: "id_pasien", as: "pasien" });
Pasien.hasMany(Antrian, { foreignKey: "id_pasien", as: "antrian" });

Antrian.belongsTo(Terapis, { foreignKey: "id_terapis", as: "terapis" });
Terapis.hasMany(Antrian, { foreignKey: "id_terapis", as: "antrian" });

export default Antrian;
