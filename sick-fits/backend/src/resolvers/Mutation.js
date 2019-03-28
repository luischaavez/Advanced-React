const Mutations = {
    async createItem(parents, args, context, info) {

        const item = await context.db.mutation.createItem({
            data: {
                ...args
            }
        }, info);

        return item;
    },
    updateItem(parent, args, context, info) {
        // first take a copy of the updates
        const updates = { ...args };
        // remove the ID from the updates
        delete updates.id;
        // run the update method
        return context.db.mutation.updateItem({
            data: updates,
            where: {
                id: args.id
            }
        }, 
        info
        );
    },
    async deleteItem(parent, args, context, info) {
        const where = { id: args.id };
        // 1. Find the item.
        const item = await context.db.query.item({ where }, `{ 
            id
            title
        }`);
        // 2. Check if they own that item, or have te permissions.
        // TODO
        // 3. Delete it!
        return context.db.mutation.deleteItem({ where }, info);
    }
};

module.exports = Mutations;
