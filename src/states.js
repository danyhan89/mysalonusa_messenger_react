const states = ["CA", "NY", "IL"];

export default states;

const isValid = state => {
  return !!states.filter(s => state === s)[0];
};

export { isValid };
