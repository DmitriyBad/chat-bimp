const AccountService = require( '../services/AccountService' );

module.exports = async (req, res, next) => {
    const authHeader = req.headers['authorization'];

    if (!authHeader) {
        res.setHeader('WWW-Authenticate', 'Basic realm="Access to the site"');
        return res.status(401).send(
            {
            "id": "AUTH_NOT_PROVIDED",
            "message": "Authentication required!"
        });
    }

    const base64Credentials = authHeader.split(' ')[1];
    const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
    const [login, password] = credentials.split(':');

    const user = await AccountService.findOneByLogin(login);

    if (user) {
        req.user = {
            id: user.id,
            login: user.login,
        };
        next();
    } else {
        return res.status(403).send('Forbidden');
    }
};