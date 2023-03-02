import { getCanMintAmount, getRootFn } from './chainService';
import { NextFunction, Request , Response } from 'express';
import jwt from 'jsonwebtoken';
import config from '../config';

interface RequestWithParsedUrl extends Request {
  _parsedUrl?: {
    pathname: string;
    query: string;
  };
}

export async function getCanMint(req: RequestWithParsedUrl, res: Response, next: NextFunction) {
  try {
    const address = req._parsedUrl?.query;
    const message = await getCanMintAmount(
      address,
     
    );

    res.status(200).json({ message });
  } catch (err) {
    next(err);
  }
}

export async function getRoot(req: Request, res: Response, next: NextFunction) {
  try {

    const root = await getRootFn();

    res.status(200).json({ root });
  } catch (err) {
    next(err);
  }
}


