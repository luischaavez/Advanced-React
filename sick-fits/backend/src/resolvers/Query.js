const { forwardTo } = require('prisma-binding');

const Query = {
    items: forwardTo('db')
    /*dogs(parent, args, context, info) {
        global.dogs = global.dogs || [];

        return global.dogs;
    }*/
};

module.exports = Query;
