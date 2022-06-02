import React from 'react'
import { GlobalStore } from '../context/GlobalState';

export const SendBalance = () => {
    const { sendBalance } = GlobalStore();
  return (
    <div>
        <button onClick={()=>sendBalance()}>Send Balance</button>
    </div>
  )
}
