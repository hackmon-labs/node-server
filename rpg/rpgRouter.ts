import express from 'express';
import { create, attack } from './rpgController';

export const rpgRouter = express.Router();
export const userRouter = express.Router();


rpgRouter.route('/attack').post(attack);
userRouter.route('/findOrCreate').post(create);
