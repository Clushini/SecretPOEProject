import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import './App.scss';
import AYAYA from './media/ayaya.png';
import { getBuildData, getItemTemplate, priceItems, getItemPriceResult, getTotalprice } from './calls/index';
import { useState } from 'react';
import JSONPretty from 'react-json-pretty';
import 'react-json-pretty/themes/monikai.css';
import JSONPrettyMon from 'react-json-pretty/dist/monikai';

//https://pastebin.com/SQWaYVza

let App = () => {
  let [link, updateLink] = useState("")
  let [jsonData, updateJsonData] = useState(null);
  let [priceData, updatePriceData] = useState([]);
  let getBuild = async (link) => {
    getBuildData(link).then(async response => {
      let data = response.data;
      let test = JSON.stringify(data);
      Promise.all([priceItems(data["Items"])]).then(response => {
        let pricePackages = []
        response.map(res => {
          res.map(item => {
            if (item) {
              let pkg = {
                pricedata: JSON.parse(item[0].data.body),
                name: item[1].name + " " + item[1].base
              }
              pricePackages.push(pkg);
            }
          })
        })
        updatePriceData(pricePackages)
      })
      // updateBuildPrices(prices)
      updateJsonData(test)
    })
  }

  console.log(priceData)
  return (
    <div className="App">
      <header className="App-header">
        <Box
          component="form"
          sx={{
            '& > :not(style)': { m: 1, width: '25ch' },
          }}
          noValidate
          autoComplete="off"
        >
          <div style={{display: "flex"}} className="mainview">
            {
              jsonData &&   <div className="parsedwrap">
                <h3>Raw Parsed Data</h3>
                <div className="scrollable_json">
                  {jsonData && <JSONPretty id="json-pretty" data={jsonData} theme={JSONPrettyMon}></JSONPretty>}
                </div>
              </div>
            }
            {
              priceData &&   <div className="pricedatawrap">
                <h3>Pricing Data (Total: {getTotalprice(priceData).totalMin} - {getTotalprice(priceData).totalMax})</h3>
                <>
                  {priceData.map(item => {
                    let price = getItemPriceResult(item);
                    return <div className="itemwrap">
                      <div className="itemheader">{item.name}</div>
                      <div className="price">
                        <div><strong>Min:</strong> {price.min} {price.currency}</div>
                        <div><strong>Max:</strong> {price.max} {price.currency}</div>
                      </div>
                    </div>
                  })}
                </>
              </div>
            }
          </div>
          <TextField id="filled-basic" label="Pastebin Link" variant="filled" value={link} onChange={(e) => updateLink(e.target.value)}/>
          <Button variant="contained" onClick={() => getBuild(link)}>
            <img src={AYAYA} alt="AYAYA" />
          </Button>
        </Box>
      </header>
    </div>
  );
}

export default App;
