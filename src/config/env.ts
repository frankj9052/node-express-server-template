import dotenvFlow from 'dotenv-flow';

dotenvFlow.config();

export const env = {
  PORT: process.env.PORT || 3000,
};
