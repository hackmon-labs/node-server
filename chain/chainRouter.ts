import express from 'express';
import { getCanMint, getRoot } from './chainController';

export const chainRouter = express.Router();


chainRouter.route('/can-mint-amount').get(getCanMint);
chainRouter.route('/get-root').get(getRoot);
