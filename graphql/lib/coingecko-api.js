import axios from "axios";

export class Coingecko {
  baseUrl = "https://api.coingecko.com/api/v3"

  constructor() {

  }

  async simplePrice (ids=['kusama', 'polkadot', 'dock'], vs_currencies=['GBP']) {
    const res = await axios.get(`${this.baseUrl}/simple/price`, { params: {ids, vs_currencies}})
    return res.data
  }

}