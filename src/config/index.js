import dotenv from 'dotenv';

dotenv.config();

const database = process.env.DB_URI;
const jwt = process.env.JWT_SECRET;
const port = process.env.PORT;
const production = process.env.PRODUCTION;

export default {database, jwt, port, production}