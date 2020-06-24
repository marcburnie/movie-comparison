/** @format */

const debounce = (cb, delay = 1000) => {
  let timeoutId;
  return (...args) => {
    if (timeoutId) clearTimeout(timeoutId);
    //debounce - wait 1 sec before requesting
    timeoutId = setTimeout(() => {
      cb.apply(null, args);
    }, delay);
  };
};
