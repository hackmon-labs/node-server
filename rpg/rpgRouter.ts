import express from 'express';
import { create, attack, attackStart, recover } from './rpgController';

export const rpgRouter = express.Router();
export const userRouter = express.Router();


rpgRouter.route('/attack').post(attack);
rpgRouter.route('/attackStart').post(attackStart);
rpgRouter.route('/recover').post(recover);
userRouter.route('/findOrCreate').post(create);
