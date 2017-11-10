const communities = [
  { label: "Combined chatroom", value: "combined" },
  { label: "Korean chatroom", value: "ko" },
  { label: "Mongolian chatroom", value: "mo" },
  { label: "Vietnamese chatroom", value: "vo" }
];

export default communities;

const isValid = community => {
  return !!communities.filter(
    c => c.label == community || c.value == community
  )[0];
};

export { isValid };
