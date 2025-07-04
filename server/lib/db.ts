import mongoose, { connect } from 'mongoose';
import dotenv from "dotenv";

dotenv.config();

type ConnectionObject = {
    isConnected?: number;
};

const connection: ConnectionObject = {};

async function dbConnect(): Promise<void> {
    if (connection.isConnected) {
        console.log("Login dbConnect successful");
    return;
    }
    try {
        const db = await mongoose.connect(process.env.MONGODB_URI||'');
        connection.isConnected = db.connections[0].readyState;
        console.log('connected to DB');
    } catch (error) {
        console.log("could not login to database", error)
    }
}

export default dbConnect;
