import Moralis from 'moralis';
import { createClient } from '@supabase/supabase-js';
import config from '../config';
import jwt from 'jsonwebtoken';
import { NextFunction, Request, Response } from 'express';

const supabase = createClient(config.SUPABASE_URL, config.SUPABASE_SERVICE_KEY);

export interface RequestMessage {
  address: string;
  chain: string;
  networkType: string;
}

const DOMAIN = 'hackmon.xyz';
const STATEMENT = 'Please sign this message to confirm your identity.';
const URI = 'https://hackmon.xyz';
const EXPIRATION_TIME = '2023-01-01T00:00:00.000Z';
const TIMEOUT = 15;

export async function attackFn({
  address,
  damage,
  uuid,
  to
}: {
  address: string;
  damage: number;
  uuid: string;
  to: string;
}) {
  console.log(damage, to)



  const message = {
    ok: true
  }

  return message;
}



export interface CreateUser {
  address: string;
  signature: string;
  message: string;
}

export async function createOrFindUser({ address, signature, message }: CreateUser) {


  let { data: user } = await supabase.from('hackers').select('*').eq('address', address).single();


  if (!user) {
    const response = await supabase
      .from('hackers')
      .insert({
        address,
        metadata: {
          hP:100,
          mp:100,
          gold:0
        }
      })
      .single();
    user = response.data;
  }


  const token = jwt.sign(
    {
      ...user,
      aud: 'authenticated',
      role: 'authenticated',
      exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7,
    },
    config.SUPABASE_JWT,
  );

  return { user, token };
}

export async function verifyToken(req: Request, res: Response, next: NextFunction) {
  const token = req.headers.authorization.split(" ")[1];
  jwt.verify(token, config.SUPABASE_JWT, function (err, decoded) {
    if (err) {
      console.log("verify error", err);
      return res.json({ code: "404", msg: "token err" });
    }
    // console.log("verify decoded", decoded);
    next();
  });
}



