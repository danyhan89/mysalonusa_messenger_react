import uuidv4 from "uuid/v4";

const STORED_NICKNAME = global.localStorage.getItem("nickname");

const NICKNAME = STORED_NICKNAME || uuidv4();

if (!STORED_NICKNAME) {
  global.localStorage.setItem("nickname", NICKNAME);
}

export const getNickname = () => {
  return NICKNAME;
};

export default getNickname;
