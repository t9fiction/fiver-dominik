import React from 'react'
import { GlobalStore } from '../context/GlobalState';

export const GasEstimationSend = () => {
    const { gasEstForSend } = GlobalStore();
  return (
    <div><button onClick={()=>gasEstForSend()}>Gas Estimation for Sending</button></div>
  )
}
