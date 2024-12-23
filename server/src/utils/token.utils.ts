import jwt from "jsonwebtoken";

const { JWT_SECRET_KEY } = process.env;

export type Payload = {
  id: number;
  role: string;
};

export const generateToken = (payload: Payload): string => {
  const token = jwt.sign(payload, JWT_SECRET_KEY as string, {
    expiresIn: "1d",
  });

  return token;
};

export const verifyToken = (token: string): Payload => {
  return jwt.verify(token, JWT_SECRET_KEY as string) as Payload;
};
