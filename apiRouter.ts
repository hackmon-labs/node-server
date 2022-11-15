import express from 'express';
import { authRouter } from './auth/authRouter';
import { rpgRouter } from './rpg/rpgRouter';
// import { chainRouter } from './chain/chainRouter';

export const apiRouter = express.Router();

apiRouter.use('/auth', authRouter);
apiRouter.use('/hackmon', rpgRouter);
// apiRouter.use('/chain', chainRouter);

