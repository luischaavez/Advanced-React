const Mutations = {
    async createItem(parents, args, context, info) {

        const item = await context.db.mutation.createItem({
            data: {
                ...args
            }
        }, info);

        return item;
    }
    /*createDog(parents, args, context, info) {
        global.dogs = global.dogs || [];
        // create a Dog
        const newDog = { name: args.name };
        global.dogs.push(newDog);
        return newDog;
    }*/
};

module.exports = Mutations;
