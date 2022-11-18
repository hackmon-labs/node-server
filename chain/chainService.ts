import Moralis from 'moralis';
import { NextFunction, Request, Response } from 'express';
// import { ethers } from 'ethers';


import supabase from '../supbase/index'

export interface RequestMessage {
  address: string;

}



export async function getCanMintAmount(
  address
) {
  console.log(address, 'address')

  let { data: user } = await supabase.from('hackers').select('*').eq('address', address).single();

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


