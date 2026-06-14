import Vaksin from "../models/VaksinModel.js";

export const getVaksin = async (req, res) => {
  try {
    const response = await Vaksin.findAll();
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const getVaksinById = async (req, res) => {
  try {
    const vaksin = await Vaksin.findOne({
      where: {
        id_vaksin: req.params.id,
      },
    });
    if (!vaksin) return res.status(404).json({ msg: "Vaksin tidak ditemukan" });
    res.status(200).json(vaksin);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const createVaksin = async (req, res) => {
  const { nama_vaksin, jenis, stok, harga_per_unit, satuan } = req.body;
  try {
    await Vaksin.create({
      nama_vaksin,
      jenis,
      stok,
      harga_per_unit,
      satuan,
    });
    res.status(201).json({ msg: "Vaksin Berhasil Ditambahkan" });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

export const updateVaksin = async (req, res) => {
  const vaksin = await Vaksin.findOne({
    where: {
      id_vaksin: req.params.id,
    },
  });
  if (!vaksin) return res.status(404).json({ msg: "Vaksin tidak ditemukan" });

  const { nama_vaksin, jenis, stok, harga_per_unit, satuan } = req.body;
  try {
    await Vaksin.update(
      {
        nama_vaksin,
        jenis,
        stok,
        harga_per_unit,
        satuan,
      },
      {
        where: {
          id_vaksin: vaksin.id_vaksin,
        },
      }
    );
    res.status(200).json({ msg: "Vaksin Berhasil Diupdate" });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

export const deleteVaksin = async (req, res) => {
  const vaksin = await Vaksin.findOne({
    where: {
      id_vaksin: req.params.id,
    },
  });
  if (!vaksin) return res.status(404).json({ msg: "Vaksin tidak ditemukan" });

  try {
    await Vaksin.destroy({
      where: {
        id_vaksin: vaksin.id_vaksin,
      },
    });
    res.status(200).json({ msg: "Vaksin Berhasil Dihapus" });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};
