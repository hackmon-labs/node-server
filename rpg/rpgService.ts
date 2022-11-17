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

const calcDamage = (max, min) => {
  return Math.ceil(Math.random() * (max - min)) + min
}

export async function attackFn({
  id,
}: {
  id: string;
}) {

  const { data: user } = await supabase.from('hackers').select('*').eq('id', id).single();


  const newMonsterHp = user.monster.monsterHp - calcDamage(user.maxDamage, user.minDamage)

  const newHackmanHp = user.metadata.hp - calcDamage(user.monster.monsterMaxDamage, user.monster.monsterMinDamage)



  const message = await supabase
    .from('hackers')
    .update({
      id,
      metadata: {
        ...user.metadata,
        hp: newMonsterHp > 0 ? newHackmanHp : user.metadata.hp,
      },
      monster: {
        ...user.monster,
        monsterHp: newHackmanHp > 0 ? newMonsterHp : user.monster.monsterHp,
      }
    })
    .single();
  // }





  return message.data;
}


export async function attackStartFn({
  id,
}: {
  id: string;
}) {

  const message = await supabase
    .from('hackers')
    .update({
      id,
      monster: {
        monsterHp: 50,
        monsterMaxHp: 50,
        monsterMaxDamage: 20,
        monsterMinDamage: 10,
      }
    })
    .single();

  return message.data;
}

export async function recoverFn({
  id,
}: {
  id: string;
}) {
  const { data: user } = await supabase.from('hackers').select('*').eq('id', id).single();


  const message = await supabase
    .from('hackers')
    .update({
      id,
      metadata: {
        ...user.metadata,
        hp: user.maxHp,
      }
    })
    .single();

  return message.data;
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
          hp: 100,
          mp: 100,

        },
        maxDamage: 20,
        minDamage: 10,
        gold: 0,
        box: 2
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
  const token = req.headers.authorization?.split(" ")?.[1];
  if (!token) {
    return res.json({ code: "404", msg: "token err" });
  }
  jwt.verify(token, config.SUPABASE_JWT, function (err, decoded) {
    if (err) {
      console.log("verify error", err);
      return res.json({ code: "404", msg: "token err" });
    }
    // console.log("verify decoded", decoded);
    next();
  });
}



