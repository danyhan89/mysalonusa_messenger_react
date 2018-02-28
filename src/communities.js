const communities = [
  { label: "English", value: "en" },
  { label: "Korean", value: "ko" },
  { label: "Mongolian", value: "mo" },
  { label: "Vietnamese", value: "vo" }
];

export default communities;

const isValid = community => {
  return !!communities.filter(
    c => c.label == community || c.value == community
  )[0];
};

export const getCommunity = value =>
  communities.filter(l => l.name == value || l.value == value)[0];

export { isValid };
