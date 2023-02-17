import Moralis from 'moralis';
// import { createClient } from '@supabase/supabase-js';
import config from '../config';
import jwt from 'jsonwebtoken';
import { NextFunction, Request, Response } from 'express';
import { ethers } from 'ethers'
import supabase from '../supbase/index'
import { Network, Alchemy } from "alchemy-sdk";

const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: config.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);


const oriText = "你是一名生活在Hackmon里的天才少年NPC，聪明且高冷，可以回答一切问题，你的名字都叫Invoker。Hackmon是一个搭载AI的像素风开放世界游戏，可以多人社交、交易、战斗、探索，用中文介绍下你自己:"


export async function getOpenAiText({
  text,
  talkUuid,
  address
}: {
  text: string;
  talkUuid: string;
  address: string;

}) {
  console.log(text, talkUuid)
  const talk_uuid = talkUuid

  let { data: msg } = await supabase.from('npcTalk2').select('*').eq('talk_uuid', talk_uuid).single();
  let contMsg = '';
  let responseText ='';
  console.log('----')

  console.log(msg)
  console.log(msg?.cont,'msg?.cont')
  console.log('----')

  if (!msg) {
    const response = await supabase
      .from('npcTalk2')
      .insert({
        talk_uuid,
        address,
        cont: `${oriText}\n\n${text}`,
        update_at: new Date()
      })
      .single();
    contMsg = response.data.cont;
  } else {
    
    contMsg = `${msg.cont}\n\n${text}`
  }

  console.log(contMsg)

  const response = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: contMsg,
    temperature: 0.9,
    max_tokens: 250,
    top_p: 1,
    stream: false,
    frequency_penalty: 0,
    presence_penalty: 2,
    stop: "/n",
  });

  

   responseText =await response.data.choices[0].text
  console.log(responseText, 'responseText');

  const lastMsg = await `${contMsg}\n\n${responseText}`
  console.log(lastMsg, 'lastMsg');

  const aa=await supabase
    .from('npcTalk2')
    .update({
      // talk_uuid,
      cont: lastMsg ,
      update_at: new Date()
    })
    .eq('talk_uuid', talk_uuid)
    .single();

  console.log(aa)

  return responseText;
}

// const supabase = createClient(config.SUPABASE_URL, config.SUPABASE_SERVICE_KEY);

export interface RequestMessage {
  address: string;
  chain: string;
  networkType: string;
}




const calcDamage = (max, min) => {
  return Math.ceil(Math.random() * (max - min)) + min
}


export async function getNFTsFn({
  address,
}: {
  address: string;
}) {
  console.log(address)

  const settings = {
    apiKey: 'rRqZllyk7wfMAjruk4EP2qcP8j7-QtV_', // Replace with your Alchemy API Key.
    network: Network.MATIC_MUMBAI, // Replace with your network.

  };

  const alchemy = new Alchemy(settings);

  // Print all NFTs returned in the response:
  let response
  await alchemy.nft.getNftsForOwner(address, {
    contractAddresses: ['0x52bf793b02810469902bc87a47a4142c0b2264bf']
  }).then(res => {
    response = res
  });

  return response;
}

export async function updateItemFn({
  id,
  tokens
}: {
  id: string;
  tokens: any[]

}) {
  const { data: user } = await supabase.from('hackers').select('*').eq('id', id).single();
  const attributes = tokens?.map(item => item?.rawMetadata?.attributes)
  const tokenIds = tokens?.map(item => item?.tokenId)
  console.log(attributes)
  let addMaxHp = 0
  let addMaxAtk = 0
  let addMinAtk = 0
  attributes?.map(j => {
    j.map(item => {


      if (item.trait_type === 'Attack') {
        addMaxAtk += item.value
        addMinAtk += item.value
      }
      if (item.trait_type === 'Hp') {
        addMaxHp += item.value
      }
    })

  })


  const message = await supabase
    .from('hackers')
    .update({
      id,
      // maxHp:
      addMaxHp,
      addMaxAtk,
      addMinAtk,
      tokenIds,
      updateTime: new Date()

    })
    .single();

  console.log(message, 'message')

  return message.data;
}

export async function attackFn({
  id,
}: {
  id: string;
}) {

  const { data: user } = await supabase.from('hackers').select('*').eq('id', id).single();

  let newGold = 0
  let newBox = 0
  let win = ''
  const newMonsterHp = user.monster.monsterHp - calcDamage(user.maxDamage, user.minDamage) - (user.addMaxAtk)

  const newHackmanHp = user.metadata.hp - calcDamage(user.monster.monsterMaxDamage, user.monster.monsterMinDamage)

  if (newMonsterHp <= 0) {
    newGold = Math.floor(Math.random() * 20) + 30
    newBox = Math.random() < 0.1 ? 1 : 0
    win = 'hacker'
  }

  if (newHackmanHp <= 0) {
    win = 'monster'
  }

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
      },
      gold: user.gold += newGold,
      box: user.box += newBox,
      updateTime: new Date()

    })
    .single();
  // }





  return { ...message.data, win };
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
      },
      updateTime: new Date()

    })
    .single();

  return message.data;
}



export async function buyBloodFn({
  id,
}: {
  id: string;
}) {
  const { data: user } = await supabase.from('hackers').select('*').eq('id', id).single();

  let newGold = user.gold
  let newBlood = user.blood
  if (user.gold >= 100) {
    newGold -= 100
    newBlood += 1
  }


  const message = await supabase
    .from('hackers')
    .update({
      id,
      gold: newGold,
      blood: newBlood,
      updateTime: new Date()

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

  if (user.blood > 0 && (user.metadata.hp !== (user.maxHp + user.addMaxHp))) {
    const message = await supabase
      .from('hackers')
      .update({
        id,
        metadata: {
          ...user.metadata,
          hp: user.maxHp + user.addMaxHp,
        },
        blood: user.blood - 1,
        updateTime: new Date()

      })
      .single();
    return message.data;

  } else {
    return user
  }

}


export interface CreateUser {
  address: string;
  signature: string;
  message: string;
}

const verifyMessage = async ({ message, address, signature }: CreateUser) => {
  const recoveredAddress = await ethers.utils.verifyMessage(message, signature);

  return recoveredAddress === address;
};

export async function findUser({ address }: { address: string }) {
  let { data: user } = await supabase.from('hackers').select('*').eq('address', address).single();

  console.log(user, 'user')
  if (!user?.authData) {
    return {
      ok: false,
      message: 'need signature'
    }
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

  // return { user, token };

  return {
    ok: true,
    message: 'ok',
    user: {
      user,
      token
    }
  }
}

export async function createUser({ address, signature, message }: CreateUser) {

  // const hasVerifyMessage = await verifyMessage({ address, signature, message })

  // if (!hasVerifyMessage){
  //   return {
  //     token:'',
  //     user:{},
  //     err:'signature error!'
  //   }
  // }


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
        authData: {
          signature, message
        },
        maxDamage: 20,
        minDamage: 10,
        gold: 0,
        box: 2,
        blood: 10,
        updateTime: new Date()
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



