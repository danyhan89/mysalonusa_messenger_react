const languages = [
  { name: "English", value: "en" },
  { name: "Korean", value: "ko" },
  { name: "Mongolian", value: "mo" },
  { name: "Vietnamese", value: "vo" }
];

export default languages;

const isValid = lang => {
  if (!lang) {
    return false;
  }
  return !!languages.filter(l => l.name == lang || l.value == lang)[0];
};

export { isValid };
