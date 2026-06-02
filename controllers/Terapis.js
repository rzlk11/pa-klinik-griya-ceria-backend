import Terapis from "../models/TerapisModel.js";

export const getTerapis = async (req, res) => {
  try {
    const response = await Terapis.findAll();
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const getTerapisById = async (req, res) => {
  try {
    const terapis = await Terapis.findOne({
      where: { id_terapis: req.params.id },
    });
    if (!terapis)
      return res.status(404).json({ msg: "Terapis tidak ditemukan!" });
    res.status(200).json(terapis);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const createTerapis = async (req, res) => {
  try {
    await Terapis.create(req.body);
    res.status(201).json({ msg: "Terapis berhasil dibuat!" });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

export const updateTerapis = async (req, res) => {
  try {
    const terapis = await Terapis.findOne({
      where: { id_terapis: req.params.id },
    });
    if (!terapis)
      return res.status(404).json({ msg: "Terapis tidak ditemukan!" });
    await Terapis.update(req.body, { where: { id_terapis: req.params.id } });
    res.status(200).json({ msg: "Terapis berhasil diupdate!" });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

export const deleteTerapis = async (req, res) => {
  try {
    const terapis = await Terapis.findOne({
      where: { id_terapis: req.params.id },
    });
    if (!terapis)
      return res.status(404).json({ msg: "Terapis tidak ditemukan!" });
    await Terapis.destroy({ where: { id_terapis: req.params.id } });
    res.status(200).json({ msg: "Terapis berhasil dihapus!" });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};
