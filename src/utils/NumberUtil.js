import _ from "lodash";
import currency from 'currency.js'

export const priceNumberFormat = (value) => {
  if (!value) {
    return "0.00";
  }
  return value.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
};

export const qtyNumberFormat = (value) => {
  if (!value) {
    return "0";
  }
  return value.toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
};

export const formatCurrency = (value) => {
  if (!value) {
    return 0.00;
  }
  return value
}

export const roundToStep = (value, stepParam) => {
  var step = stepParam || 1.0;
  var inv = 1.0 / step;
  return Math.round(value * inv) / inv;
}