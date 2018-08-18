
exports.leftmenu = function() {
    this.method = 'ALL';
    this.route = '/api/json';

    this.func = function(req, res) {
        if (req.body.key == 'error') {
            throw new Error('error!');
        }
        if (req.body.key == '500') {
            res.send({
                parameter: req.body,
                data: [1, 2, 3, 4, 5, 6],
                status: 500,
                message: ''
            });
            return;
        }
        if (req.body.key == 'login') {
            res.send({
                parameter: req.body,
                data: [1, 2, 3, 4, 5, 6],
                status: 80403,
                message: ''
            });
            return;
        }
        res.send({
            parameter: req.body,
            data: [1, 2, 3, 4, 5, 6],
            status: 200,
            message: ''
        });
    };
};