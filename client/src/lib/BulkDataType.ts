// Define one option object in the chain
interface Option {
  strike: number;
  call_ltp: number;
  put_ltp: number;
}

// Define the meta data
interface Meta {
  dayOpen: number;
  spot: number;
  atm_iv: number;
  fut_price: number;
}

export type BulkData = {
  [date: string]: {
    [time: string]: {
      [expiry: string]: {
        chain: Option[];
        meta: Meta;
      };
    };
  };
};
