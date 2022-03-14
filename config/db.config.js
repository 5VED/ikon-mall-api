'use strict';
var db_config = {
    NODE_PORT: 5000,   
    HOST: "localhost",
    MONGODB_PORT: 27017,
    DATABASE: 'iKonMall',
    multipleStatements: true,
    secret: "bezkoder-secret-key",
    connectionLimit: 20,
    MONGODB_URL : `mongodb+srv://test-user:test-user@cluster0.unxi0.mongodb.net/iKonMall?retryWrites=true&w=majority`,
    typeCast: function castField(field, useDefaultTypeCasting) {
        try {
            if ((field.type === "BIT") && (field.length === 1)) {
                var bytes = field.buffer();
                if (bytes) {
                    return (bytes[0] === 1);
                }
            }
        } catch (err) {
            console.log('typeCast', err);
        }
        return (useDefaultTypeCasting());
    }
};

module.exports = db_config;
