import _ from 'lodash'
export const getValueComma = (obj) => {
    return _.toString(Object.values(obj))
};

export const truncate = (str, n) => {
    return (str.length > n) ? str.substr(0, n - 1) + '...' : str;
};