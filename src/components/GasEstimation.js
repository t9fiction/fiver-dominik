import React from 'react'
import { GlobalStore } from '../context/GlobalState';

export const GasEstimation = () => {
    const { gasEstIncAllow } = GlobalStore();
  return (
    <div><button onClick={()=>gasEstIncAllow()}>Gas Estimation for Allowance</button></div>
  )
}
