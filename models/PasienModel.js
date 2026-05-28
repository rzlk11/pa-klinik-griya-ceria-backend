import { Sequelize } from "sequelize";
import db from "../config/Database.js";
import ResepObat from "./ResepObatModel.js";

const { DataTypes } = Sequelize;

const Pasien = db.define('pasien', {
    uuid: {
        type: DataTypes.STRING,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        validate:{
            notEmpty: true,
        }
    },
    no_register: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate:{
            notEmpty: true,
            len: [3,100],
        }
    },
    date_of_birth: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        validate:{
            notEmpty: true,
        }
    },
    gender: {
        type: DataTypes.ENUM('P','L'),
        allowNull: false,
        validate:{
            notEmpty: true,
        }
    },
    nama_orang_tua: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    no_telp_orang_tua: {
        type: DataTypes.STRING,
        allowNull: true,
    },
}, {
    freezeTableName: true,
});

Pasien.hasMany(ResepObat, { foreignKey: "id_pasien", as: "reseps" });
ResepObat.belongsTo(Pasien, { foreignKey: "id_pasien", as: "pasien" });

export default Pasien;