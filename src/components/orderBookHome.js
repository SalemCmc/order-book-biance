
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from "react-router-dom";
//import ReactVirtualizedTable from './muiVirtualizedTable';
import { w3cwebsocket as W3CWebSocket } from "websocket";
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import CircularProgress from '@mui/material/CircularProgress';

let client; // = new W3CWebSocket("wss://dex.binance.org/api/ws/BNB_BTCB-1DE@marketDepth");

function OrderBookHome() {

  const [input1, setInput1] = useState("");
  const [input2, setInput2] = useState("");

    const [tradingPairs, setTradingPairs] = useState([]);
    const [selectedSymbol, setSelectedSymbol] = useState(null);
    const [asksBids, setAsksBids] = useState([]);
    let params = useParams();
    const navigate = useNavigate();


  




    const isValidURLParam=(pairs)=>
    {
    

       return false;
       return true;
    }
    const selectPair=(event, values)=>
    {
        if(values?.symbol)
        navigate("/orderbook/"+values.symbol);
    }





   const onkeydownHandle=(e)=>
   {

    console.log("onkeydownHandle e:",e);
    console.log("onkeydownHandle e key:",e.key);
    setInput1(input1+e.key);
   }
   const onkeypressHandle=(e)=>
   {

    console.log("onkeypressHandle e:",e);
    console.log("onkeypressHandle e key:",e.key);
    setInput2(input2+e.key);
   }



  return ( 
    <>


<h6>input 1 key down</h6>
<input value={input1} onKeyDown={(e)=>onkeydownHandle(e)}/>

<h6>input 2 key press</h6>
<input value={input2} onKeyPress={(e)=>onkeypressHandle(e)}/>



    </>
  );
}

export default OrderBookHome;



