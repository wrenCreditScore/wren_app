import * as userRepo from '../repositories/user_repo';
import { createUserSchema } from '../repositories/schemas/user_sch';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
const SECRET_TOKEN = process.env.SECRET_TOKEN;
export async function register(data) {

    const parseData = await createUserSchema.parse(data);

    const salt = await bcrypt.genSalt(10);

    parseData.password = await bcrypt.hash(parseData.password, salt);

    //store user
    const user = await userRepo.storeUser(parseData);

    const token = await generateToken(user.data);

    return [{token: token, user: user.data}];
}

export async function login(data) {
    const { identifier, password } = data;

    const user = await userRepo.getUserByMobileOrEmail(identifier);


    if (!user.success) {
        return user;
    }

    //check password
    const validPassword = await bcrypt.compare(password, user.data.password);
    

    if (!validPassword) {
        throw new Error('Incorrect credentials');
    }

    const token = await generateToken(user.data);

    return [{token: token, user: user.data}];
}

async function generateToken(user) {
    let payload = {id: user.id, email: user.CIN};
    return jwt.sign(payload, SECRET_TOKEN, {expiresIn: '365d'});
}