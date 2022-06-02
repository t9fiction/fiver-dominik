import React from 'react'
import { GlobalStore } from '../context/GlobalState';
import { GasEstimation } from './GasEstimation';
import { GasEstimationSend } from './GasEstimationSend';
import { IncreaseAllowance } from './IncreaseAllowance';
import { SendBalance } from './SendBalance';

export const MainPage = () => {
  const { connectWallet, currentAccount, allowance } = GlobalStore();
  return <div>
    {!currentAccount && !allowance ?
      <button onClick={async () => {
        connectWallet()
      }} >Connect Wallet</button>
      : currentAccount && !allowance ?
        <div>
          <IncreaseAllowance />
          <GasEstimation />
        </div>
        : currentAccount && allowance ?
          <div>
            <SendBalance />
            <GasEstimationSend />
          </div> : "Refresh the Page"
    }

  </div>;
}
