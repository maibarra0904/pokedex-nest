
export const EnvConfiguration = () => ({
    environment: process.env.NODE_ENV || 'dev',
    port: process.env.PORT || 3002,
    mongodb: process.env.MONGODB ||'mongodb://localhost:27017/test',
    defaultLimit: +process.env.DEFAULT_LIMIT || 7
})