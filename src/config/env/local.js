module.exports = {
    environment: process.env.NODE_ENV,
    ip: '',
    port: 4200,
    isDev: true,
    sentryDsn: process.env.sentryDsn,

    sql: {
        database: process.env.database,
        username: process.env.username,
        password: process.env.password,
        dbOptions: {},
        host: process.env.host
    },

    mongo: {
        dbName: process.env.mongodbName,
        userName: process.env.mongouserName,
        Pass: process.env.mongopass,
        dbUrl: (userName, pass, db) => `mongodb+srv://${userName}:${pass}@cluster0.kp9bxqv.mongodb.net/${db}?retryWrites=true&w=majority`,
    },

    redis: {
        server: process.env.redis_server,
        port: process.env.redis_port,
        user: process.env.redis_username,
        pass: process.env.redis_pass
    },
    fronEndUrl : "/",
}