
import React, { useState, useEffect } from 'react';

import { useParams, useNavigate  } from "react-router-dom";
import ReactVirtualizedTable from './muiVirtualizedTable';
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


    useEffect(() => { 
return;
  
      fetch('https://api.binance.com/api/v3/exchangeInfo')
      .then(response => response.json())
      .then(data => {
        let formatedTradingPairs=filterAndFormatData(data.symbols);
        if(params.symbol)
        {
          if(isValidURLParam(formatedTradingPairs))
          {
            //setTradingPairs(formatedTradingPairs);
            setSelectedSymbol(formatedTradingPairs.filter(item=>item.symbol===params.symbol)[0] || null);
          }
          else  navigate("/wrong-symbol/"); 
        }
        setTradingPairs(formatedTradingPairs);
      })


    },[]);

    useEffect(() => {  
        return;
        if(client){client.close(); client=null; }  
        if(params.symbol )
        {  
          setAsksBids(null);
          setSelectedSymbol(tradingPairs.filter(item=>item.symbol===params.symbol)[0] || null);
          // THIS IS HARDCODED BECOUSE I DIDNT FIND SOLUTION HOW TO SEND SYMBOL TO WEB SOCKET IN DOCUMENTATION!
          client = new W3CWebSocket("wss://dex.binance.org/api/ws/BNB_BTCB-1DE@marketDepth");
            client.onopen = () => { console.log('WebSocket Client Connected'); };
            client.onmessage = (event) => {setAsksBids(formatAskBids(JSON.parse(event.data).data));
          };         
        }
      },[params.symbol]);

      const filterAndFormatData=(items)=>
      {
           let newList=[];
           items.map((item)=>
           {
            if(item.status==="TRADING")
            newList.push( { label: item.baseAsset+"/"+item.quoteAsset, symbol:item.symbol, status: item.status, wsLabel:item.baseAsset+"_"+item.quoteAsset});
           })
           return newList;
      }

    const isValidURLParam=(pairs)=>
    {
    
       if(pairs.filter(item=>item.symbol===params.symbol)[0]===undefined)
       return false;
       return true;
    }
    const selectPair=(event, values)=>
    {
        if(values?.symbol)
        navigate("/orderbook/"+values.symbol);
    }
    const formatAskBids=(items)=>
    {
      let newList=[];
      let asks=[...items.asks];
      let bids=[...items.bids].reverse();
      for (let i = 0; i < asks.length; i++) {
        newList.push(
          {
           bs:bids[i][0],
           bids:bids[i][1],
           asks:asks[i][0],
           as: asks[i][1]  
          }
        )
      }
        return newList;
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



    {tradingPairs.length  ?
        <>




        <hr/>
          <Autocomplete
           disablePortal
           id="combo-box-demo"
           options={tradingPairs}
           sx={{ width: "100%", height:"20px", marginBottom:"35px" }}
           onChange={selectPair}
           fullWidth={true}
           renderInput={(params) => <TextField {...params} label="trading pair" size="small"/>}
          
           value={selectedSymbol}
          /> 
            <ReactVirtualizedTable list={asksBids} 
            columns={ [{label:"BIDS SIZE", dataKey:"bs"},{label:"BIDS", dataKey:"bids" },{label:"ASKS", dataKey:"asks" },{label:"ASKS SIZE", dataKey:"as"}]} />
        </>
          :
          <div className='loader'><CircularProgress  /> <p>{"Loaading symbols..."}</p></div>
    
    }

    </>
  );
}

export default OrderBookHome;



