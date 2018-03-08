const cities = ["LA", "NY", "Chicago"];

export default cities;

const isValid = city => {
  return !!cities.filter(c => city === c)[0];
};

export { isValid };
