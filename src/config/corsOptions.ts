export const corsOptions = {
  origin: [
    'http://localhost:3000',
    // "https://noqclinic.dev"
  ],
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  optionsSuccessStatus: 204,
};
