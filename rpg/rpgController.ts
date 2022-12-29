import { attackFn, createUser, attackStartFn, recoverFn, findUser, getNFTsFn, updateItemFn, buyBloodFn, getOpenAiText } from './rpgService';
import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import config from '../config';

 async function getId(req) {
  const token = req.headers.authorization.split(" ")[1];
  var decoded = jwt.verify(token, config.SUPABASE_JWT);
  //  console.log(decoded,'decoded')
  return decoded
}

// openAi


export async function npcTalk(req: Request, res: Response, next: NextFunction) {
  try {

    const { text, talkUuid } = req.body;
    const { address } = await getId(req)

    const message = await getOpenAiText({
      text, talkUuid, address
    });

    res.status(200).json({ message });
  } catch (err) {
    next(err);
  }
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

export async function buyBlood(req: Request, res: Response, next: NextFunction) {
  try {
    // const { tokens } = req.body;
    const { id } = await getId(req)

    const message = await buyBloodFn({
      id,
      // message,tokens
      // signature,
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

    const user = await createUser({
      address,
      message,
      signature,
    });

    res.status(200).json({ user });
  } catch (err) {
    next(err);
  }
}

export async function find(req: Request, res: Response, next: NextFunction) {
  try {
    const { address, } = req.body;

    const data = await findUser({
      address,
      // message,
      // signature,
    });

    res.status(200).json(data);
  } catch (err) {
    next(err);
  }
}

export async function getNFTs(req: Request, res: Response, next: NextFunction) {
  try {
    // const { address, } = req.body;
    const { address } = await getId(req)

    const data = await getNFTsFn({
      address,
      // message,
      // signature,
    });

    res.status(200).json(data);
  } catch (err) {
    next(err);
  }
}

export async function updateItem(req: Request, res: Response, next: NextFunction) {
  try {
    const { tokens} = req.body;
    const { id } = await getId(req)

    const data = await updateItemFn({
      id,
      tokens
      // message,tokens
      // signature,
    });

    res.status(200).json(data);
  } catch (err) {
    next(err);
  }
}



