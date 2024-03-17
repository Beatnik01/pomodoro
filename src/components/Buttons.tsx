import { motion } from "framer-motion";
import { useRecoilState, useSetRecoilState } from "recoil";
import styled from "styled-components";
import {
  GoalStateAtom,
  RoundStateAtom,
  TimerStateAtom,
  isRestedStateAtom,
  isSkipedStateAtom,
  isStartStateAtom,
} from "../atoms";

const ButtonGroup = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 2rem;
`;

const Button = styled(motion.button)`
  width: 10rem;
  height: 10rem;
  border-radius: 50%;
  border: none;
  margin: 10rem 0;
  background-color: rgba(0, 0, 0, 0.2);
  color: white;
  box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
  cursor: pointer;
  svg {
    width: 7rem;
  }
`;

const SubButton = styled(motion.button)`
  width: 6rem;
  height: 6rem;
  border-radius: 50%;
  border: none;
  margin: 10rem 0;
  background-color: rgba(0, 0, 0, 0.2);
  color: white;
  box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
  cursor: pointer;
  svg {
    width: 4rem;
  }
`;

export default function Buttons() {
  const setTimer = useSetRecoilState(TimerStateAtom);
  const setIsSkiped = useSetRecoilState(isSkipedStateAtom);
  const [isStarted, setIsStarted] = useRecoilState(isStartStateAtom);
  const [isRested, setIsRested] = useRecoilState(isRestedStateAtom);
  const [round, setRound] = useRecoilState(RoundStateAtom);
  const [goal, setGoal] = useRecoilState(GoalStateAtom);

  const toggleTimer = () => {
    setIsStarted((prev) => !prev);
  };

  const resetButton = () => {
    setTimer({ seconds: 0, minutes: 25 });
    setIsStarted(false);
    setIsRested(false);
    setRound(0);
    setGoal(0);
  };

  /* 
       초기엔 기존 로직을 활용하기 위해 setIsStarted(ture) 후
       timer를 0초로 초기화 해서 skip하는 방식을 사용했지만 약간의 딜레이가 거슬려서 방식을 바꿨음. 
       이것도 함수를 재사용하면 코드를 줄일 수 있을것 같은데 감이 안잡힘.
    */
  const skipButton = () => {
    setIsSkiped(true);
    if (!isRested) {
      setIsStarted(false);
      setIsRested(true);
      setRound(round + 1);
      if (round < 4) setTimer({ seconds: 0, minutes: 5 });
      if (round === 4) {
        setRound(0);
        setGoal(goal + 1);
        setTimer({ seconds: 0, minutes: 30 });
      }
    } else {
      setIsStarted(false);
      setIsRested(false);
      setTimer({ seconds: 0, minutes: 25 });
    }
  };

  return (
    <ButtonGroup>
      <SubButton onClick={resetButton} whileHover={{ scale: 1.2 }}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-6 h-6"
        >
          <path
            fillRule="evenodd"
            d="M12 2.25a.75.75 0 0 1 .75.75v9a.75.75 0 0 1-1.5 0V3a.75.75 0 0 1 .75-.75ZM6.166 5.106a.75.75 0 0 1 0 1.06 8.25 8.25 0 1 0 11.668 0 .75.75 0 1 1 1.06-1.06c3.808 3.807 3.808 9.98 0 13.788-3.807 3.808-9.98 3.808-13.788 0-3.808-3.807-3.808-9.98 0-13.788a.75.75 0 0 1 1.06 0Z"
            clipRule="evenodd"
          />
        </svg>
      </SubButton>
      {isStarted ? (
        <Button onClick={toggleTimer} whileHover={{ scale: 1.2 }}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-6 h-6"
          >
            <path
              fillRule="evenodd"
              d="M6.75 5.25a.75.75 0 0 1 .75-.75H9a.75.75 0 0 1 .75.75v13.5a.75.75 0 0 1-.75.75H7.5a.75.75 0 0 1-.75-.75V5.25Zm7.5 0A.75.75 0 0 1 15 4.5h1.5a.75.75 0 0 1 .75.75v13.5a.75.75 0 0 1-.75.75H15a.75.75 0 0 1-.75-.75V5.25Z"
              clipRule="evenodd"
            />
          </svg>
        </Button>
      ) : (
        <Button onClick={toggleTimer} whileHover={{ scale: 1.2 }}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-6 h-6"
          >
            <path
              fillRule="evenodd"
              d="M4.5 5.653c0-1.427 1.529-2.33 2.779-1.643l11.54 6.347c1.295.712 1.295 2.573 0 3.286L7.28 19.99c-1.25.687-2.779-.217-2.779-1.643V5.653Z"
              clipRule="evenodd"
            />
          </svg>
        </Button>
      )}
      <SubButton onClick={skipButton} whileHover={{ scale: 1.2 }}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-6 h-6"
        >
          <path d="M5.055 7.06C3.805 6.347 2.25 7.25 2.25 8.69v8.122c0 1.44 1.555 2.343 2.805 1.628L12 14.471v2.34c0 1.44 1.555 2.343 2.805 1.628l7.108-4.061c1.26-.72 1.26-2.536 0-3.256l-7.108-4.061C13.555 6.346 12 7.249 12 8.689v2.34L5.055 7.061Z" />
        </svg>
      </SubButton>
    </ButtonGroup>
  );
}
