import {ApolloError} from "apollo-server-errors";
import {v4 as uuidv4} from "uuid";
import {User} from "../../models/user";
import {comparePassword, encrypt, getToken} from "../../utils";

export default {
    Query: {
        users: async (parent, args, context, info) => {
            const user = await User.find();
            if (user)
                return user;

            throw  new ApolloError("Error(404): Data not found");
        },
    },
    Mutation: {
        login: async (parent, args, context, info) => {
            const user = await User.findOne({email: args.email})
            if (!user)
                throw  new ApolloError("User not found");

            const isMatch = await comparePassword(args.password, user.password);
            if (isMatch) {
                const token = getToken(user);
                return {user, token};
            }

            throw  new ApolloError("Wrong password");
        },
        createUser: async (parent, args, context, info) => {
            const user_id = uuidv4();

            const user = new User({
                user_id: user_id,
                username: args.username,
                email: args.email,
                password: await encrypt(args.password)
            });

            const validate_user = await User.findOne({email: args.email});
            if (validate_user)
                throw  new ApolloError("User already exist");

            await user.save();
            return user;
        }
    }
}