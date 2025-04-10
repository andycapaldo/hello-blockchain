'use client'

import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useAccount, useReadContracts } from 'wagmi';
import { formatUnits } from 'viem';
import { ERC20_ABI } from '../lib/erc20';
import { useState } from 'react';








export default function HomePage() {
  const { address, isConnected } = useAccount();

  const [contractAddress, setContractAddress] = useState('');
  const [submittedAddress, setSubmittedAddress] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmittedAddress(contractAddress);
  }

  const { data, isLoading, error } = useReadContracts({
    contracts:
      submittedAddress && address
        ? [
            {
              address: submittedAddress as `0x${string}`,
              abi: ERC20_ABI,
              functionName: 'balanceOf',
              args: [address!],
            },
            {
              address: submittedAddress as `0x${string}`,
              abi: ERC20_ABI,
              functionName: 'decimals',
            },
            {
              address: submittedAddress as `0x${string}`,
              abi: ERC20_ABI,
              functionName: 'symbol',
            },
          ]
        : [],
    query: {
      enabled: !!submittedAddress && !!address,
    },
  });

  const hasAllData =
    data &&
    data[0]?.status === 'success' &&
    data[1]?.status === 'success' &&
    data[2]?.status === 'success'
    
  const formattedBalance = hasAllData
    ? formatUnits(data[0].result as bigint, data[1].result as number)
    : '0';


  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-blue-100 text-blue-800">
      <h1 className="text-3xl font-bold mb-4">👋 Hello, Blockchain!</h1>
      <div className='my-4'>
        <ConnectButton />
      </div>

      {isConnected && (
        <>
          <form onSubmit={handleSubmit} className='mt-6 flex flex-col items-center gap-2 border-2 border-blue-200 p-4 rounded-lg w-1/5'>
            <input 
              type='text'
              placeholder='Enter contract address'
              value={contractAddress}
              onChange={(e) => setContractAddress(e.target.value)}
              className='p-2 rounded text-sm text-black w-full outline-none text-center'
            />
            <div className='bg-blue-400 hover:bg-blue-700'>
              <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg cursor-pointer">
                Check Balance
              </button>
            </div>
          </form>

          <div className="mt-6 text-center">
            {isLoading ? (
              <p>Loading token balance...</p>
            ) : error ? (
              <p>Error fetching token balance</p>
            ) : hasAllData ? (
              <p>
                💰 Token Balance: {formattedBalance} {String(data[2].result)}
              </p>
            ) : submittedAddress ? (
              <p>Fetching balance...</p>
            ) : null}
          </div>
        </>
      )}
  </div>
  )
}