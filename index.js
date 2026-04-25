import express from 'express';
import cors from 'cors';
import session from 'express-session';
import dotenv from 'dotenv';
import db from './config/Database.js';
import SequelizeStore from 'connect-session-sequelize';
import UserRoutes from './routes/UserRoutes.js';
import PasienRoutes from './routes/PasienRoutes.js';
import AuthRoutes from './routes/AuthRoutes.js';
import OrangTuaRoutes from './routes/OrangTuaRoutes.js';
import DetailResepObatRoutes from './routes/DetailResepObatRoutes.js';
import DokterRoutes from './routes/DokterRoutes.js';
import ObatRoutes from './routes/ObatRoutes.js';
import PelayananKesehatanRoutes from './routes/PelayananKesehatanRoutes.js';
import RekamMedisRoutes from './routes/RekamMedisRoutes.js';
import TransaksiRoutes from './routes/TransaksiRoutes.js';
import ResepObatRoutes from './routes/ResepObatRoutes.js';

dotenv.config();

const app = express();

const sessionStore = SequelizeStore(session.Store);

const store = new sessionStore({
    db: db
});

(async() => {
    await db.sync();
})();

app.use(cors({
    credentials: true,
    origin: ['http://localhost:3000', 'http://localhost:5173']
}));

app.use(session({
    secret: process.env.SESS_SECRET,
    resave: false,
    saveUninitialized: true,
    store: store,
    cookie: {
        secure: 'auto',
        maxAge: 24 * 60 * 60 * 1000,
    }
}));

app.use(express.json());

app.use(UserRoutes);
app.use(PasienRoutes);
app.use(AuthRoutes);
app.use(OrangTuaRoutes);
app.use(DetailResepObatRoutes);
app.use(DokterRoutes);
app.use(ObatRoutes);
app.use(PelayananKesehatanRoutes);
app.use(RekamMedisRoutes);
app.use(TransaksiRoutes);
app.use(ResepObatRoutes);

store.sync();

app.listen(process.env.APP_PORT, () =>{
    console.log('Server up and running...');
    console.log(`on port ${process.env.APP_PORT}`);
});