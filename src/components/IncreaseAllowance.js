import React from 'react'
import { GlobalStore } from '../context/GlobalState';

export const IncreaseAllowance = () => {
    const { increaseAllowanceFn, balance } = GlobalStore();
  return (
    <div>
        <br/>
        Your Current Balance : {balance}
        <br />
        <br />
        <button onClick={()=>increaseAllowanceFn()}>IncreaseAllowance</button>
    </div>
  )
}
