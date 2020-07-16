import React, { useEffect, useState } from 'react';
import './App.css';
import AmeritradeTable from './AmeritradeTable.js'

export default function App() {
  

  const [response, setResponse] = useState([])
  const [profit, setProfit] = useState([])
  /*useEffect(()=> {
    //fetch('http://localhost:9000/testAPI')
    
  }, [])*/

  
  const [time, setTime] = useState(Date.now());
  const [listOfNames, setListOfNames] = useState([])

  useEffect(() => {
    fetch('http://localhost:9000/testAPI/accessToken')

    const interval = setInterval(() => {
      setTime(Date.now())
      fetchData()
      
    }, 3000);
    console.log('test')
    return () => {
      clearInterval(interval);
    };
  }, []);
  //console.log(response)

  
  function fetchData() {
    try {
      fetch('http://localhost:9000/testAPI/accountPositions')
      .then(res => res.json())
      .then(res => {
        let temp = [];
          setResponse(res[0].securitiesAccount.positions.map(function(item) {
            return {
              'averagePrice': item.averagePrice,
              'currentDayProfitLossPercentage': item.currentDayProfitLossPercentage,
              'cusip': item.instrument.cusip,
              'symbol' : item.instrument.symbol,
              'longQuantity' : item.longQuantity,
              'marketValue' : item.marketValue,
              'tags' : ['nice', 'developer']
            }
          })) 
          var today = new Date();
          var time = today.getHours() + ":" + today.getMinutes()
          setProfit(res[0].securitiesAccount.positions.map(item => temp.push(time, item.currentDayProfitLoss) ))
          setProfit(temp)
          //setName(res[0].securitiesAccount.positions.instrument.symbol)
        //console.log(res[0].securitiesAccount.positions)
      })
    } catch(e) {
      fetch('http://localhost:9000/testAPI/accessToken')
      console.error(e)
    }
    
  }

  return (
    <div className="App">
      <AmeritradeTable data={response} profit={profit} />
    </div>
  );
}