import axios from 'axios';

const address = "http://68.96.253.212:4000/";

Promise.delay = function(t, val) {
  return new Promise(resolve => {
      setTimeout(resolve.bind(null, val), t);
  });
}

Promise.raceAll = function(promises, timeoutTime, timeoutVal) {
  return Promise.all(promises.map(p => {
      return Promise.race([p, Promise.delay(timeoutTime, timeoutVal)])
  }));
}

export function getItemPriceResult(item) {
  let price = {
    min: parseInt(item.pricedata.min),
    max: parseInt(item.pricedata.max),
    currency: item.pricedata.currency
  }
  return price
}

export function getTotalprice(items) {
  let pkg = {
    totalMin: 0,
    totalMax: 0
  }
  items.map(item => {
    pkg.totalMin = pkg.totalMin + parseInt(item.pricedata.min);
    pkg.totalMax = pkg.totalMin + parseInt(item.pricedata.max);
  })
  return pkg
}

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

export function getItemPrice(b64, item) {
  return axios({
    url: `${address}priceItem?item=${b64}`,
    method: 'GET',
    withCredentials: false,
    headers: {
        "Content-Type": "application/json"
    }
    }).then(result => { return [result, item] })
    .catch(error => { console.log(error) })
}

export function getItemSocketClusters(sockets) {
  let clusterString = "";
  sockets.map(cluster => {
    clusterString = clusterString + cluster.join("-")
    clusterString = clusterString + " ";
  })
  return clusterString;
}

export function getItemMods(text) {
  let modArray = text.split(/\r?\n/);
  return modArray;
}

export function getImplicits(num, text) {
  let modsArray = getItemMods(text);
  let modsSlice = [...modsArray.slice(0, num)]
  let finalSlice = modsSlice.join('\r\n');
  return finalSlice;
}

export function getExplicits(num, text) {
  let modsArray = getItemMods(text);
  let modsSlice = [...modsArray.slice(num, modsArray.length)];
  let finalSlice = modsSlice.join('\r\n');
  return finalSlice;
}

export function getItemTemplate(itemdata) {
  let itemString = `Item Class: Unknown
Rarity: ${itemdata.rarity}
${itemdata.name}
${itemdata.base}
--------
Item Level: ${itemdata.item_level}
--------
Quality: ${itemdata.quality}
--------
Requirements:
Level: ${itemdata.level_req}
--------
${itemdata.sockets && `Sockets: ${getItemSocketClusters(itemdata.sockets)}`}
--------
${itemdata.implicit && getImplicits(itemdata.implicit, itemdata.text)}
--------
${getExplicits(itemdata.implicit, itemdata.text)}
`
  return itemString;
}

export async function priceItems(items) {
  let copyItems = [...items];
  const promises = [];
  let priceableRares = [];
  copyItems.map(item => {
    item.template = getItemTemplate(item);
    let encoded = btoa(item.template)
    item.encoded = encoded;
    if (item.rarity === "Rare") {
      promises.push(getItemPrice(item.encoded, item))
      priceableRares.push(item)
    }
  })

  return Promise.raceAll(promises, 5000, null)
}