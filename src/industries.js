const industries = [
  { label: "Salons", value: "salons" },
  { label: "Restaurants", value: "restaurants" },
  { label: "Offices", value: "offices" },
  { label: "Others (Misc.)", value: "others" }
];

export default industries;

const isValid = industry => {
  return !!industries.filter(
    c => c.label == industry || c.value == industry
  )[0];
};

export const getIndustry = value =>
  industries.filter(l => l.name == value || l.value == value)[0];

export { isValid };
