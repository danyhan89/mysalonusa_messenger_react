const states = ["CA", "NY", "IL"];

export default states;

const isValid = state => {
  return !!states.filter(s => state.toLowerCase() === s.toLowerCase())[0];
};

export { isValid };
