import express from 'express';
import { create, attack, attackStart, recover, find, getNFTs, updateItem } from './rpgController';

export const rpgRouter = express.Router();
export const userRouter = express.Router();


rpgRouter.route('/attack').post(attack);
rpgRouter.route('/attackStart').post(attackStart);
rpgRouter.route('/recover').post(recover);
rpgRouter.route('/nfts').post(getNFTs);
rpgRouter.route('/updateItem').post(updateItem);

userRouter.route('/create').post(create);
userRouter.route('/find').post(find);
