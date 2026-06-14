import Antrian from "../models/AntrianModel.js";
import Pasien from "../models/PasienModel.js";
import Terapis from "../models/TerapisModel.js";

export const getAntrian = async (req, res) => {
  try {
    const response = await Antrian.findAll({
      include: [
        { model: Pasien, as: "pasien" },
        { model: Terapis, as: "terapis" }
      ],
      order: [['createdAt', 'ASC']]
    });
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const getAntrianById = async (req, res) => {
  try {
    const response = await Antrian.findOne({
      where: { id_antrian: req.params.id },
      include: [
        { model: Pasien, as: "pasien" },
        { model: Terapis, as: "terapis" }
      ]
    });
    if (!response) return res.status(404).json({ msg: "Antrian tidak ditemukan!" });
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const createAntrian = async (req, res) => {
  const { id_pasien, id_terapis, tanggal_antrian, keluhan, berat_badan, suhu, status_antrian } = req.body;
  try {
    await Antrian.create({
      id_pasien,
      id_terapis: id_terapis || null,
      tanggal_antrian,
      keluhan,
      berat_badan: berat_badan || null,
      suhu: suhu || null,
      status_antrian: status_antrian || 'Menunggu'
    });
    res.status(201).json({ msg: "Antrian berhasil dibuat!" });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

export const updateAntrian = async (req, res) => {
  try {
    const antrian = await Antrian.findOne({
      where: { id_antrian: req.params.id }
    });
    if (!antrian) return res.status(404).json({ msg: "Antrian tidak ditemukan!" });

    const { id_pasien, id_terapis, tanggal_antrian, keluhan, berat_badan, suhu, status_antrian } = req.body;
    await Antrian.update({
      id_pasien,
      id_terapis: id_terapis || null,
      tanggal_antrian,
      keluhan,
      berat_badan: berat_badan || null,
      suhu: suhu || null,
      status_antrian
    }, {
      where: { id_antrian: req.params.id }
    });
    res.status(200).json({ msg: "Antrian berhasil diperbarui!" });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

export const deleteAntrian = async (req, res) => {
  try {
    const antrian = await Antrian.findOne({
      where: { id_antrian: req.params.id }
    });
    if (!antrian) return res.status(404).json({ msg: "Antrian tidak ditemukan!" });

    await Antrian.destroy({
      where: { id_antrian: req.params.id }
    });
    res.status(200).json({ msg: "Antrian berhasil dihapus!" });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};
