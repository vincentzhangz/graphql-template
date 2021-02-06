import {extendType, nonNull, objectType, stringArg} from 'nexus'

export const User = objectType({
    name: 'User',
    definition(t) {
        t.int('id')
        t.string('username')
        t.string('password')
    },
})


export const UserQuery = extendType({
    type: 'Query',
    definition(t) {
        t.nonNull.list.field('users', {
            type: 'User',
            resolve(_root, _args, ctx) {                              // 1
                return ctx.db.user.findMany()
            },
        })
    },
})

export const UserMutation = extendType({
    type: 'Mutation',
    definition(t) {
        t.nonNull.field('createUser', {
            type: 'User',
            args: {
                username: nonNull(stringArg()),
                password: nonNull(stringArg()),
            },
            resolve(_root, args, ctx) {
                const user = {
                    username: args.username,
                    password: args.password,
                }
                return ctx.db.user.create({data: user})
            },
        })
    },
})