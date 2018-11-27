module.exports = {
    remote: {
        user: '',
        password: '',
        connectString: "\
        (DESCRIPTION =  \
            (ADDRESS = (PROTOCOL = TCP)(HOST = )(PORT = )) \
            (CONNECT_DATA = \
                (SERVER = DEDICATED) \
                (SERVICE_NAME = orcl) \
            ) \
        )"
    }
};