import DetailResepObat from "../models/DetailResepObatModel.js";
import Obat from "../models/ObatModel.js";

export const getDetailResepObat = async (req, res) => {
  try {
    const response = await DetailResepObat.findAll({
      include: [{ model: Obat, as: "obat" }]
    });
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const getDetailResepObatById = async (req, res) => {
  try {
    const detail = await DetailResepObat.findOne({
      where: { id_detail_resep: req.params.id },
      include: [{ model: Obat, as: "obat" }]
    });
    if (!detail)
      return res.status(404).json({ msg: "Detail resep tidak ditemukan!" });
    res.status(200).json(detail);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const createDetailResepObat = async (req, res) => {
  try {
    await DetailResepObat.create(req.body);
    res.status(201).json({ msg: "Detail resep berhasil dibuat!" });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

export const updateDetailResepObat = async (req, res) => {
  try {
    const detail = await DetailResepObat.findOne({
      where: { id_detail_resep: req.params.id },
    });
    if (!detail)
      return res.status(404).json({ msg: "Detail resep tidak ditemukan!" });
    await DetailResepObat.update(req.body, {
      where: { id_detail_resep: req.params.id },
    });
    res.status(200).json({ msg: "Detail resep berhasil diupdate!" });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

export const deleteDetailResepObat = async (req, res) => {
  try {
    const detail = await DetailResepObat.findOne({
      where: { id_detail_resep: req.params.id },
    });
    if (!detail)
      return res.status(404).json({ msg: "Detail resep tidak ditemukan!" });
    await DetailResepObat.destroy({
      where: { id_detail_resep: req.params.id },
    });
    res.status(200).json({ msg: "Detail resep berhasil dihapus!" });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};
