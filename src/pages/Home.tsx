import { useEffect } from "react";
import { motion } from "framer-motion";
import styled from "styled-components";
import Card from "../components/Card";
import { useRecoilState } from "recoil";
import {
  GoalStateAtom,
  RoundStateAtom,
  TimerStateAtom,
  isRestedStateAtom,
  isStartStateAtom,
} from "../atoms";

const Container = styled.div<{ $isRested?: boolean }>`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  margin: 0 auto;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  background-color: ${(props) => (props.$isRested ? "#2ecc71" : "#e74c3d")};
`;

const Title = styled.h1`
  text-align: center;
  color: white;
  font-weight: 900;
  font-size: 5rem;
  margin: 10rem 0;
`;

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

const CountContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 5rem;
`;

const Count = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  span:first-child {
    font-size: 2rem;
    font-weight: 600;
    color: rgba(255, 255, 255, 0.6);
  }
  span:last-child {
    font-size: 2rem;
    font-weight: 600;
    color: white;
  }
`;
export default function Home() {
  const [timer, setTimer] = useRecoilState(TimerStateAtom);
  const [isStarted, setIsStarted] = useRecoilState(isStartStateAtom);
  const [isRested, setIsRested] = useRecoilState(isRestedStateAtom);
  const [round, setRound] = useRecoilState(RoundStateAtom);
  const [goal, setGoal] = useRecoilState(GoalStateAtom);

  // 타이머 시작
  /*
    1. seconds > 0 → 1초씩 감소.
    2. minutes === 0 && seconds === 0 → 휴식 시작, round 증가.
     2-1. round < 4 → 짧은 휴식 5분.
     2-2. round === 4 → 긴 휴식 30분, round 초기화, goal 증가.
    3. goal > 12 → goal 초기화
    4. 모든 조건에 해당되지 않는다면 1분을 빼고 59초로 세팅.
  */
  useEffect(() => {
    let interval: number;
    if (isStarted && !isRested) {
      interval = setInterval(() => {
        setTimer((prev) => {
          if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
          if (prev.minutes === 0 && prev.seconds === 0) {
            setIsRested(true);
            setIsStarted(false);
            setRound(round + 1); // ** (prev) => prev+1로 하면 round, goal 모두 2씩 증가됨, 이유는 모르겠음. **
            if (round < 4) return { ...prev, minutes: 5 };
            if (round === 4) {
              setGoal(goal + 1);
              setRound(0);
              return { ...prev, minutes: 30 };
            }
            if (goal > 12) setGoal(0);
          }
          return { ...prev, seconds: 59, minutes: prev.minutes - 1 };
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer, round, goal, isStarted, isRested]);

  // 휴식
  /*
    1. seconds > 0 → 1초씩 감소.
    2. minutes === 0 && seconds === 0 → 휴식 종료, 타이머를 25분으로 세팅 (집중 시간)
    3. 모든 조건에 해당되지 않는다면 1분을 빼고 59초로 세팅.
  */
  useEffect(() => {
    let interval: number;
    if (isRested && isStarted) {
      interval = setInterval(() => {
        setTimer((prev) => {
          if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
          if (prev.minutes === 0 && prev.seconds === 0) {
            setIsRested(false);
            setIsStarted(false);
            return { ...prev, minutes: 25 };
          }
          return { ...prev, seconds: 59, minutes: prev.minutes - 1 };
        });
      }, 1000);
    }
    // 클린업 함수.
    return () => clearInterval(interval);
  }, [timer, isStarted, isRested]);

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
    if (!isRested) {
      setIsRested(true);
      setRound(round + 1);
      if (round < 4) setTimer({ seconds: 0, minutes: 5 });
      if (round === 4) {
        setRound(0);
        setGoal(goal + 1);
        setTimer({ seconds: 0, minutes: 30 });
      }
    } else {
      setIsRested(false);
      setTimer({ seconds: 0, minutes: 25 });
    }
  };

  return (
    <Container $isRested={isRested}>
      <Title>Pomodoro</Title>
      <Card />
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

      <CountContainer>
        <Count>
          <span>{round}/4</span>
          <span>ROUND</span>
        </Count>
        <Count>
          <span>{goal}/12</span>
          <span>GOAL</span>
        </Count>
      </CountContainer>
    </Container>
  );
}
