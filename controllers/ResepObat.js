import ResepObat from "../models/ResepObatModel.js";
import DetailResepObat from "../models/DetailResepObatModel.js";
import Obat from "../models/ObatModel.js";

export const getResepObat = async (req, res) => {
  try {
    const response = await ResepObat.findAll({
      include: [
        {
          model: DetailResepObat,
          as: "details",
          include: [{ model: Obat, as: "obat" }]
        },
      ],
    });
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const getResepObatById = async (req, res) => {
  try {
    const resep = await ResepObat.findOne({
      where: { id_resep: req.params.id },
      include: [
        {
          model: DetailResepObat,
          as: "details",
          include: [{ model: Obat, as: "obat" }]
        },
      ],
    });
    if (!resep) return res.status(404).json({ msg: "Resep obat tidak ditemukan!" });
    res.status(200).json(resep);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const createResepObat = async (req, res) => {
  try {
    const newResep = await ResepObat.create(req.body, {
        include: [
        {
          model: DetailResepObat,
          as: "details"
        }
      ]
    });
    res.status(201).json({ msg: "Resep obat berhasil dibuat!", data: newResep });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

export const updateResepObat = async (req, res) => {
  try {
    const resep = await ResepObat.findOne({ where: { id_resep: req.params.id } });
    if (!resep) return res.status(404).json({ msg: "Resep obat tidak ditemukan!" });
    await ResepObat.update(req.body, { where: { id_resep: req.params.id } });
    res.status(200).json({ msg: "Resep obat berhasil diupdate!" });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

export const deleteResepObat = async (req, res) => {
  try {
    const resep = await ResepObat.findOne({ where: { id_resep: req.params.id } });
    if (!resep) return res.status(404).json({ msg: "Resep obat tidak ditemukan!" });
    await ResepObat.destroy({ where: { id_resep: req.params.id } });
    res.status(200).json({ msg: "Resep obat berhasil dihapus!" });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};