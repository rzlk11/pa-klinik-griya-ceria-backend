import Transaksi from "../models/TransaksiModel.js";
import Pasien from "../models/PasienModel.js";
import PelayananKesehatan from "../models/PelayananKesehatanModel.js";
import ResepObat from "../models/ResepObatModel.js";
import Terapis from "../models/TerapisModel.js";
import path from "path";
import fs from "fs";

export const getTransaksi = async (req, res) => {
  try {
    const response = await Transaksi.findAll({
      include: [
        { model: Pasien, as: "pasien" },
        { model: PelayananKesehatan, as: "pelayanan" },
        { model: ResepObat, as: "resep" },
        { model: Terapis, as: "terapis" },
      ],
    });
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const getTransaksiById = async (req, res) => {
  try {
    const transaksi = await Transaksi.findOne({
      where: { id_transaksi: req.params.id },
      include: [
        { model: Pasien, as: "pasien" },
        { model: PelayananKesehatan, as: "pelayanan" },
        { model: ResepObat, as: "resep" },
        { model: Terapis, as: "terapis" },
      ],
    });
    if (!transaksi)
      return res.status(404).json({ msg: "Transaksi tidak ditemukan!" });
    res.status(200).json(transaksi);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const createTransaksi = async (req, res) => {
  try {
    let url = null;
    if (req.files !== null && req.files.bukti_transaksi) {
      const file = req.files.bukti_transaksi;
      const fileSize = file.data.length;
      const ext = path.extname(file.name);
      const fileName = file.md5 + ext;
      const allowedType = ['.png','.jpg','.jpeg'];
      
      if (!allowedType.includes(ext.toLowerCase())) return res.status(422).json({msg: "Invalid Images"});
      if (fileSize > 5000000) return res.status(422).json({msg: "Image must be less than 5 MB"});

      file.mv(`./public/images/${fileName}`, (err)=>{
          if(err) return res.status(500).json({msg: err.message});
      });
      url = `${req.protocol}://${req.get("host")}/images/${fileName}`;
    }

    const { id_pasien, id_pelayanan, id_resep, id_terapis, tanggal_transaksi, total_biaya, id_antrian } = req.body;

    await Transaksi.create({
      id_pasien: id_pasien || null,
      id_pelayanan: id_pelayanan || null,
      id_resep: id_resep || null,
      id_terapis: id_terapis || null,
      id_antrian: id_antrian || null,
      tanggal_transaksi,
      total_biaya,
      bukti_transaksi: url
    });
    res.status(201).json({ msg: "Transaksi berhasil dibuat!" });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

export const updateTransaksi = async (req, res) => {
  try {
    const transaksi = await Transaksi.findOne({
      where: { id_transaksi: req.params.id },
    });
    if (!transaksi)
      return res.status(404).json({ msg: "Transaksi tidak ditemukan!" });

    let url = transaksi.bukti_transaksi;

    if (req.files !== null && req.files.bukti_transaksi) {
      const file = req.files.bukti_transaksi;
      const fileSize = file.data.length;
      const ext = path.extname(file.name);
      const fileName = file.md5 + ext;
      const allowedType = ['.png','.jpg','.jpeg'];
      
      if (!allowedType.includes(ext.toLowerCase())) return res.status(422).json({msg: "Invalid Images"});
      if (fileSize > 5000000) return res.status(422).json({msg: "Image must be less than 5 MB"});

      if (transaksi.bukti_transaksi) {
        const splitUrl = transaksi.bukti_transaksi.split('/');
        const oldImage = splitUrl[splitUrl.length - 1];
        const filepath = `./public/images/${oldImage}`;
        if (fs.existsSync(filepath)) {
          fs.unlinkSync(filepath);
        }
      }

      file.mv(`./public/images/${fileName}`, (err)=>{
          if(err) return res.status(500).json({msg: err.message});
      });
      url = `${req.protocol}://${req.get("host")}/images/${fileName}`;
    }

    const { id_pasien, id_pelayanan, id_resep, id_terapis, tanggal_transaksi, total_biaya, id_antrian } = req.body || {};

    await Transaksi.update({
      id_pasien: id_pasien || transaksi.id_pasien,
      id_pelayanan: id_pelayanan || transaksi.id_pelayanan,
      id_resep: id_resep || transaksi.id_resep,
      id_terapis: id_terapis || transaksi.id_terapis,
      id_antrian: id_antrian || transaksi.id_antrian,
      tanggal_transaksi: tanggal_transaksi || transaksi.tanggal_transaksi,
      total_biaya: total_biaya || transaksi.total_biaya,
      bukti_transaksi: url
    }, {
      where: { id_transaksi: req.params.id },
    });
    res.status(200).json({ msg: "Transaksi berhasil diupdate!" });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

export const deleteTransaksi = async (req, res) => {
  try {
    const transaksi = await Transaksi.findOne({
      where: { id_transaksi: req.params.id },
    });
    if (!transaksi)
      return res.status(404).json({ msg: "Transaksi tidak ditemukan!" });

    if (transaksi.bukti_transaksi) {
      const splitUrl = transaksi.bukti_transaksi.split('/');
      const oldImage = splitUrl[splitUrl.length - 1];
      const filepath = `./public/images/${oldImage}`;
      if (fs.existsSync(filepath)) {
        fs.unlinkSync(filepath);
      }
    }

    await Transaksi.destroy({ where: { id_transaksi: req.params.id } });
    res.status(200).json({ msg: "Transaksi berhasil dihapus!" });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};
