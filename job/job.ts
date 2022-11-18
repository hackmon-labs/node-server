import supabase from '../supbase/index'
import { keccak256, parseEther, solidityKeccak256 } from 'ethers/lib/utils';
import MerkleTree from 'merkletreejs';



export async function generateRoot() {
  let { data } = await supabase.from('hackers').select('address,gold,box');
  const tree = new MerkleTree(
    data.map((x) => {
      return solidityKeccak256(['address', 'uint256', 'uint256'], [x.address, x.gold, x.box]);
    }),
    keccak256,
    { sort: true },
  );
  const hexRoot = '0x' + tree.getRoot().toString('hex');
  console.log('Merkle Tree Root: ', hexRoot);

  let leafArr = data?.map(item => {
    const leaf = solidityKeccak256(['address', 'uint256', 'uint256'], [item.address, item.gold, item.box]);

    const proof = tree.getProof(leaf).map((v) => {
      return '0x' + v.data.toString('hex');
    });
    return ({
      ...item,
      proof
    })
  })

  await supabase
    .from('merkleTree')
    .insert({
      root: hexRoot,
      leafArr
    })

  return hexRoot
}


