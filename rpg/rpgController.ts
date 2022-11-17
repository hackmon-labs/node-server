import { attackFn, createOrFindUser, attackStartFn, recoverFn } from './rpgService';
import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import config from '../config';

 async function getId(req) {
  const token = req.headers.authorization.split(" ")[1];
  var decoded = jwt.verify(token, config.SUPABASE_JWT);
  //  console.log(decoded,'decoded')
  return decoded
}

export async function attack(req: Request, res: Response, next: NextFunction) {
  try {
    const { id,  } =await getId(req)
    const message = await attackFn({
      id
    });

    res.status(200).json({ message });
  } catch (err) {
    next(err);
  }
}

export async function attackStart(req: Request, res: Response, next: NextFunction) {
  try {
    const { id,  } = await getId(req)
    // console.log(uuid, address,req)
    const message = await attackStartFn({
      id,
    });

    res.status(200).json({ message });
  } catch (err) {
    next(err);
  }
}

export async function recover(req: Request, res: Response, next: NextFunction) {
  try {
    const { id, } = await getId(req)
    const message = await recoverFn({
      id
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


