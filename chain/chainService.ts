import Moralis from 'moralis';
import { NextFunction, Request, Response } from 'express';
// import { ethers } from 'ethers';


import supabase from '../supbase/index'
import { ethers } from 'ethers';

export interface RequestMessage {
  address: string;

}

export function transLegalAddress(address) {
  const account = ethers.utils.getAddress(address);
  return account;
}

export async function getCanMintAmount(
  address
) {
  console.log(address, 'address')
  console.log(transLegalAddress(address))
  const addressRight = transLegalAddress(address)
  let { data: user } = await supabase.from('hackers').select('*').eq('address', addressRight).single();

  console.log(user,'user')
  if (!user) {
    return {
      canMint: 0
    }
  }

  const message = {
    canMint: user.box
  }

  return message;
}


export async function getRootFn() {


  let { data } = await supabase.from('merkleTree').select('*').limit(1)
    .single();


  return data.root
}


