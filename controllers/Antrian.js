import Antrian from "../models/AntrianModel.js";
import Pasien from "../models/PasienModel.js";
import Terapis from "../models/TerapisModel.js";
import PelayananKesehatan from "../models/PelayananKesehatanModel.js";
import Vaksin from "../models/VaksinModel.js";
import RekamMedis from "../models/RekamMedisModel.js";
import Transaksi from "../models/TransaksiModel.js";

export const getAntrian = async (req, res) => {
  try {
    const response = await Antrian.findAll({
      include: [
        { model: Pasien, as: "pasien" },
        { model: Terapis, as: "terapis" },
        { model: PelayananKesehatan, as: "pelayanan" }
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
        { model: Terapis, as: "terapis" },
        { model: PelayananKesehatan, as: "pelayanan" }
      ]
    });
    if (!response) return res.status(404).json({ msg: "Antrian tidak ditemukan!" });
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const createAntrian = async (req, res) => {
  const { id_pasien, id_terapis, id_pelayanan, id_vaksin, tanggal_antrian, keluhan, berat_badan, suhu, status_antrian } = req.body;
  try {
    const isVaksin = id_vaksin ? true : false;
    let finalStatus = isVaksin ? 'Menunggu Obat' : (status_antrian || 'Menunggu');

    const antrian = await Antrian.create({
      id_pasien,
      id_terapis: id_terapis || null,
      id_pelayanan: id_pelayanan || null,
      tanggal_antrian,
      keluhan,
      berat_badan: berat_badan || null,
      suhu: suhu || null,
      status_antrian: finalStatus
    });

    if (isVaksin) {
      const vaksin = await Vaksin.findByPk(id_vaksin);
      let pelayanan = null;
      let hargaPelayanan = 0;
      
      if (id_pelayanan) {
        pelayanan = await PelayananKesehatan.findByPk(id_pelayanan);
        if (pelayanan) hargaPelayanan = Number(pelayanan.harga) || 0;
      }

      if (vaksin) {
        // Kurangi stok vaksin
        await Vaksin.update(
          { stok: vaksin.stok - 1 },
          { where: { id_vaksin: id_vaksin } }
        );

        // Buat Rekam Medis
        const rekamMedis = await RekamMedis.create({
          id_pasien,
          id_terapis: id_terapis || null,
          id_pelayanan: id_pelayanan || null,
          id_antrian: antrian.id_antrian,
          diagnosa: "Imunisasi / Vaksinasi",
          tindakan: `Pemberian Vaksin: ${vaksin.nama_vaksin}`,
          berat_badan: berat_badan || null,
          suhu: suhu || null
        });

        // Buat Transaksi
        // Jika harga pelayanan sudah gabung ke harga vaksin, maka kita hanya menggunakan harga vaksin
        const totalBiaya = Number(vaksin.harga_per_unit || 0);
        await Transaksi.create({
          id_pasien,
          id_pelayanan: id_pelayanan || null,
          id_terapis: id_terapis || null,
          id_antrian: antrian.id_antrian,
          tanggal_transaksi: tanggal_antrian || new Date().toISOString().split('T')[0],
          total_biaya: totalBiaya
        });
      }
    }

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

    const updateData = {};
    if (req.body.id_pasien !== undefined) updateData.id_pasien = req.body.id_pasien;
    if (req.body.id_terapis !== undefined) updateData.id_terapis = req.body.id_terapis || null;
    if (req.body.id_pelayanan !== undefined) updateData.id_pelayanan = req.body.id_pelayanan || null;
    if (req.body.tanggal_antrian !== undefined) updateData.tanggal_antrian = req.body.tanggal_antrian;
    if (req.body.keluhan !== undefined) updateData.keluhan = req.body.keluhan;
    if (req.body.berat_badan !== undefined) updateData.berat_badan = req.body.berat_badan || null;
    if (req.body.suhu !== undefined) updateData.suhu = req.body.suhu || null;
    if (req.body.status_antrian !== undefined) updateData.status_antrian = req.body.status_antrian;

    await Antrian.update(updateData, {
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
