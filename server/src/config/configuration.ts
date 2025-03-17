import { cleanEnv, num, str } from "envalid";

const config = cleanEnv(process.env, {
  PORT: num({ default: 5000 }),
  MONGODB_URI: str(),
  JWT_SECRET: str(),
  JWT_EXPIRE: str(),
});

export default {
  port: config.PORT,
  mongodb: {
    uri: config.MONGODB_URI,
  },
  jwt: {
    secret: config.JWT_SECRET,
    expiresIn: config.JWT_EXPIRE,
  },
};
