import { atom } from "recoil";

export const TimerStateAtom = atom({
  key: "timerState",
  default: { minutes: 25, seconds: 0 },
});

export const isStartStateAtom = atom({
  key: "isStartState",
  default: false,
});

export const isRestedStateAtom = atom({
  key: "isRestedState",
  default: false,
});

export const isSkipedStateAtom = atom({
  key: "isSkipedState",
  default: false,
});

export const isResetedStateAtom = atom({
  key: "isResetedState",
  default: false,
});

export const RoundStateAtom = atom({
  key: "roundState",
  default: 0,
});

export const GoalStateAtom = atom({
  key: "goalState",
  default: 0,
});
