import dotenv from "dotenv";
dotenv.config();

export const config = {
    port: process.env.PORT || 3000,
    assemblyApiKey: process.env.ASSEMBLY_API_KEY,
};