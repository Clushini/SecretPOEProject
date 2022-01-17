import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import './App.scss';
import AYAYA from './media/ayaya.png';
import { getBuildData } from './calls/index';
import { useState } from 'react';
import JSONPretty from 'react-json-pretty';
import 'react-json-pretty/themes/monikai.css';
import JSONPrettyMon from 'react-json-pretty/dist/monikai';

let App = () => {
  let [link, updateLink] = useState("")
  let [jsonData, updateJsonData] = useState(null);
  let getBuild = (link) => {
    getBuildData(link).then(response => {
      let data = response.data;
      let test = JSON.stringify(data);
      updateJsonData(test)
      console.log(response)
    })
  }
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
          {
            jsonData &&   <>
              <h3>Raw Parsed Data</h3>
              <div className="scrollable_json">
                {jsonData && <JSONPretty id="json-pretty" data={jsonData} theme={JSONPrettyMon}></JSONPretty>}
              </div>
            </>
          }
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
