import React from 'react'
import { GlobalStore } from '../context/GlobalState';

export const Balance = () => {
    const { balance } = GlobalStore();
    console.log("balance",balance)
  return (
    <div>{balance}</div>
  )
}
