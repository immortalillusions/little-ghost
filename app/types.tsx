export type Data = {
  temp: number;
  thermostat: boolean;
  light: boolean;
  lock: boolean;
  message: string; 
  location: number;
  item: string; // "thermostat", "lock", "light", or "nothing"
  mock?: boolean; // for testing purposes
};