'use strict';
var swaggerify = require('swaggerify').routes;


module.exports = function(imports) {
    var Client = imports.models.Client;

    return swaggerify('client', {
        get: function(req, res) {
            var params = req.swagger.params;
            var sortBy = params.sortBy.value;
            var perPage = params.perPage.value;
            var page = params.page.value;

            Client.findAndCount({
                order: convertToOrder(sortBy),
                limit: perPage,
                offset: page * perPage
            }).then(function(result) {
                res.header('Total-Count', result.count).json(result.rows);
            });
        },
        post: function(req, res) {
            var body = req.swagger.params.body.value;

            Client.create(body).then(function(client) {
                res.json({
                    id: client.dataValues.id
                });
            });
        },
        put: function(req, res) {
            var body = req.swagger.params.body.value;
            var id = body.id;

            delete body.id;

            Client.update(body, {
                where: {
                    id: id
                }
            }).then(function(ids) {
                var id = ids[0];

                if(id) {
                    res.json({id: id});
                }
                else {
                    // TODO: specify this case better
                    res.status(403).json({
                        message: 'NOT_FOUND'
                    });
                }
            });
        }
    });
};

function convertToOrder(str) {
    if(!str) {
        return;
    }

    if(str.indexOf('-') === 0) {
        return '`' + str.slice(1) + '` DESC';
    }

    return str;
}
