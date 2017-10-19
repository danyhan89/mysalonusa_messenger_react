const languages = [
  { name: "English", value: "en" },
  { name: "Korean", value: "kr" },
  { name: "Mongolian", value: "mo" },
  { name: "Vietnamese", value: "vo" }
];

export default languages;

const isValid = lang => {
  return !!languages.filter(l => l.name == lang || l.value == lang)[0];
};

export { isValid };
