import express from 'express';
import { getCanMint } from './chainController';

export const chainRouter = express.Router();


chainRouter.route('/can-mint-amount').get(getCanMint);
