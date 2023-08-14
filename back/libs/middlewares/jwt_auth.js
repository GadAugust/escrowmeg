const jwt = require('jsonwebtoken');
const {status_codes} = require('../../configs/utils');
const Utils = require('../../configs/utils');

exports.jwtAuthentication = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (authHeader) {
        console.log('jwt');
        const token = authHeader.split(' ')[1];
        //console.log(token);
        jwt.verify(token, Utils.tokenPassword, (err, user) => {
            if (err) {
                console.log('Invalid JWT' + err);
                return res.status(status_codes.client_error.forbidden).send({error: true, message: 'Bad authentication'});
            }

            //req.user = user;
            console.log('Valid JWT');
            next();
        });
    } else {
        console.log('no jwt');
        res.status(status_codes.client_error.unauthorized).send({error: true, message: 'No authentication'});
    }
};