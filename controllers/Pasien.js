import { Op } from "sequelize";
import Pasien from "../models/PasienModel.js";
import ResepObat from "../models/ResepObatModel.js";
import DetailResepObat from "../models/DetailResepObatModel.js";
import RekamMedis from "../models/RekamMedisModel.js";
import Transaksi from "../models/TransaksiModel.js";

export const getPasien = async (req, res) => {
  try {
    const response = await Pasien.findAll({
      attributes: ["id", "uuid", "no_register", "name", "date_of_birth", "gender"],
      include: [
        {
          model: ResepObat,
          as: "reseps",
          required: false,
          include: [
            {
              model: DetailResepObat,
              as: "details",
              required: false,
            },
          ],
        },
      ],
    });
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const getPasienById = async (req, res) => {
  try {
    const pasien = await Pasien.findOne({
      where: {
        uuid: req.params.id,
      },
      include: [
        {
          model: ResepObat,
          as: "reseps",
          required: false,
          include: [
            {
              model: DetailResepObat,
              as: "details",
              required: false,
            },
          ],
        },
        {
          model: RekamMedis,
          as: "rekam_medis",
          required: false,
        },
        {
          model: Transaksi,
          as: "transaksi",
          required: false,
        },
      ],
    });
    if (!pasien)
      return res.status(404).json({ msg: "Pasien tidak ditemukan!" });
    res.status(200).json(pasien);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

export const createPasien = async (req, res) => {
  const { no_register, name, date_of_birth, gender, nama_orang_tua, no_telp_orang_tua } = req.body;
  try {
    let final_no_register = no_register;
    
    if (final_no_register) {
      const existing = await Pasien.findOne({ where: { no_register: final_no_register } });
      if (existing) {
        return res.status(400).json({ msg: "No Register sudah digunakan, silakan ubah atau biarkan kosong agar otomatis." });
      }
    } else {
      const currentYear = new Date().getFullYear();
      const yy = currentYear.toString().slice(-2);

      const patientsThisYear = await Pasien.findAll({
        where: {
          no_register: {
            [Op.like]: `${yy}.%`
          }
        },
        attributes: ['no_register']
      });

      let maxSeq = 0;
      patientsThisYear.forEach(p => {
        if (p.no_register) {
          const parts = p.no_register.split('.');
          if (parts.length >= 2) {
            const seq = parseInt(parts[1], 10);
            if (!isNaN(seq) && seq > maxSeq) {
              maxSeq = seq;
            }
          }
        }
      });

      const sequence = (maxSeq + 1).toString().padStart(2, '0');
      const initial = name ? name.trim().charAt(0).toUpperCase() : 'X';
      final_no_register = `${yy}.${sequence}.${initial}`;
    }

    await Pasien.create({
      no_register: final_no_register,
      name: name,
      date_of_birth: date_of_birth,
      gender: gender,
      nama_orang_tua: nama_orang_tua,
      no_telp_orang_tua: no_telp_orang_tua,
    });
    res.status(201).json({ msg: "Data Pasien berhasil dibuat!" });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

export const updatePasien = async (req, res) => {
  const { no_register, name, date_of_birth, gender, nama_orang_tua, no_telp_orang_tua } = req.body;

  const pasien = await Pasien.findOne({
    where: {
      uuid: req.params.id,
    },
  });
  if (!pasien) return res.status(404).json({ msg: "Pasien tidak ditemukan!" });

  if (no_register && no_register !== pasien.no_register) {
    const existing = await Pasien.findOne({ where: { no_register: no_register } });
    if (existing) {
      return res.status(400).json({ msg: "No Register sudah digunakan, silakan gunakan nomor lain." });
    }
  }

  try {
    await Pasien.update(
      {
        no_register: no_register || pasien.no_register,
        name: name,
        date_of_birth: date_of_birth,
        gender: gender,
        nama_orang_tua: nama_orang_tua,
        no_telp_orang_tua: no_telp_orang_tua,
      },
      {
        where: {
          uuid: req.params.id,
        },
      }
    );
    res.status(200).json({ msg: "Data Pasien berhasil diupdate!" });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

export const deletePasien = async (req, res) => {
  const pasien = await Pasien.findOne({
    where: {
      uuid: req.params.id,
    },
  });
  if (!pasien) return res.status(404).json({ msg: "Pasien tidak ditemukan!" });
  try {
    await Pasien.destroy({
      where: {
        uuid: req.params.id,
      },
    });
    res.status(200).json({ msg: "Data Pasien berhasil dihapus!" });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};
