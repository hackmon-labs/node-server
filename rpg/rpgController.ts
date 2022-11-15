import { attackFn, createOrFindUser } from './rpgService';
import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import config from '../config';

 async function getId(req) {
  const token = req.headers.authorization.split(" ")[1];
  var decoded = jwt.verify(token, config.SUPABASE_JWT);
  return decoded
}

export async function attack(req: Request, res: Response, next: NextFunction) {
  try {
    const {  damage, to } = req.body;
    const { uuid, address } = getId(req)
    const message = await attackFn({
      address,
      damage,
      uuid,
      to
    });

    res.status(200).json({ message });
  } catch (err) {
    next(err);
  }
}

export async function create(req: Request, res: Response, next: NextFunction) {
  try {
    const { address, message, signature } = req.body;

    const user = await createOrFindUser({
      address,
      message,
      signature,
    });

    res.status(200).json({ user });
  } catch (err) {
    next(err);
  }
}


