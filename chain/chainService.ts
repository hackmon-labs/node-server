import Moralis from 'moralis';
import { createClient } from '@supabase/supabase-js';
import config from '../config';
import jwt from 'jsonwebtoken';
import { NextFunction, Request, Response } from 'express';

const supabase = createClient(config.SUPABASE_URL, config.SUPABASE_SERVICE_KEY);

export interface RequestMessage {
  address: string;
  
}



export async function getCanMintAmount({
  address,
}: {
  address: string;
}) {

  const message = {
    canMint: 2
  }

  return message;
}


