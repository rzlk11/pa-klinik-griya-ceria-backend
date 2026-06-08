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
    const { id_obat, jumlah_obat } = req.body;
    
    // Check if obat exists and has enough stock
    const obat = await Obat.findOne({ where: { id_obat } });
    if (!obat) return res.status(404).json({ msg: "Obat tidak ditemukan!" });
    if (obat.stok < jumlah_obat) return res.status(400).json({ msg: "Stok obat tidak mencukupi!" });

    // Deduct stock
    await Obat.update({ stok: obat.stok - jumlah_obat }, { where: { id_obat } });

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

    const newIdObat = req.body.id_obat || detail.id_obat;
    const newJumlahObat = req.body.jumlah_obat || detail.jumlah_obat;

    if (detail.id_obat === newIdObat) {
      // Same obat, just update the difference
      const diff = newJumlahObat - detail.jumlah_obat;
      if (diff !== 0) {
        const obat = await Obat.findOne({ where: { id_obat: detail.id_obat } });
        if (obat.stok < diff) return res.status(400).json({ msg: "Stok obat tidak mencukupi!" });
        await Obat.update({ stok: obat.stok - diff }, { where: { id_obat: detail.id_obat } });
      }
    } else {
      // Different obat, revert old stock and deduct new stock
      const oldObat = await Obat.findOne({ where: { id_obat: detail.id_obat } });
      if (oldObat) {
        await Obat.update({ stok: oldObat.stok + detail.jumlah_obat }, { where: { id_obat: detail.id_obat } });
      }

      const newObat = await Obat.findOne({ where: { id_obat: newIdObat } });
      if (!newObat) return res.status(404).json({ msg: "Obat baru tidak ditemukan!" });
      if (newObat.stok < newJumlahObat) return res.status(400).json({ msg: "Stok obat baru tidak mencukupi!" });
      await Obat.update({ stok: newObat.stok - newJumlahObat }, { where: { id_obat: newIdObat } });
    }

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

    // Restore stock
    const obat = await Obat.findOne({ where: { id_obat: detail.id_obat } });
    if (obat) {
      await Obat.update({ stok: obat.stok + detail.jumlah_obat }, { where: { id_obat: detail.id_obat } });
    }

    await DetailResepObat.destroy({
      where: { id_detail_resep: req.params.id },
    });
    res.status(200).json({ msg: "Detail resep berhasil dihapus!" });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};
