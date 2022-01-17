import axios from 'axios';

const address = "http://68.96.253.212:4000/";

export function getBuildData(pastebin) {
  return axios({
    url: `${address}parseBuild?pastebin=${pastebin}`,
    method: 'GET',
    withCredentials: false,
    headers: {
        "Content-Type": "application/json"
    }
    }).then(result => { return result})
    .catch(error => { console.log(error) })
}