import Pasien from "../models/PasienModel.js";
import OrangTua from "../models/OrangTuaModel.js";
import ResepObat from "../models/ResepObatModel.js";
import DetailResepObat from "../models/DetailResepObatModel.js";
import RekamMedis from "../models/RekamMedisModel.js";
import Transaksi from "../models/TransaksiModel.js";

export const getPasien = async (req, res) => {
  try {
    const response = await Pasien.findAll({
      attributes: ["id", "uuid", "name", "date_of_birth", "gender"],
      include: [
        {
          model: OrangTua,
          required: false,
        },
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
          model: OrangTua,
          required: false,
        },
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
  const { name, date_of_birth, gender, orangTuaId } = req.body;
  try {
    await Pasien.create({
      name: name,
      date_of_birth: date_of_birth,
      gender: gender,
      orangTuaId: orangTuaId,
    });
    res.status(201).json({ msg: "Data Pasien berhasil dibuat!" });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

export const updatePasien = async (req, res) => {
  const { name, date_of_birth, gender, orangTuaId } = req.body;

  const pasien = await Pasien.findOne({
    where: {
      uuid: req.params.id,
    },
  });
  if (!pasien) return res.status(404).json({ msg: "Pasien tidak ditemukan!" });

  try {
    await Pasien.update(
      {
        name: name,
        date_of_birth: date_of_birth,
        gender: gender,
        orangTuaId: orangTuaId,
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
