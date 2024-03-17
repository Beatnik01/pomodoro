import { useEffect } from "react";
import { motion, useAnimate } from "framer-motion";
import styled from "styled-components";
import Timer from "../components/Timer";
import { useRecoilState } from "recoil";
import {
  GoalStateAtom,
  RoundStateAtom,
  TimerStateAtom,
  isRestedStateAtom,
  isStartStateAtom,
} from "../atoms";
import Buttons from "../components/Buttons";
import Counter from "../components/Counter";

const Container = styled(motion.div)<{ $isRested?: boolean }>`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin: 0 auto;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
`;

const Background = styled.div<{ $isRested?: boolean }>`
  position: relative;
  overflow: hidden;
  height: 100vh;
  background-color: ${(props) => (props.$isRested ? "#e74c3d" : "#2ecc71")};
`;

const BackgroundAnimation = styled(motion.div)<{ $isRested?: boolean }>`
  position: absolute;
  top: 0;
  height: 100vh;
  width: 100%;
  background-color: ${(props) => (props.$isRested ? "#2ecc71" : "#e74c3d")};
`;

const Title = styled.h1`
  text-align: center;
  color: white;
  font-weight: 900;
  font-size: 5rem;
  margin: 10rem 0;
`;

export default function Home() {
  const [timer, setTimer] = useRecoilState(TimerStateAtom);
  const [isStarted, setIsStarted] = useRecoilState(isStartStateAtom);
  const [isRested, setIsRested] = useRecoilState(isRestedStateAtom);
  const [round, setRound] = useRecoilState(RoundStateAtom);
  const [goal, setGoal] = useRecoilState(GoalStateAtom);
  const [scope, animate] = useAnimate();

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

  useEffect(() => {
    if (isStarted && !isRested) animate(scope.current, { y: 1350 }, { duration: 1500 });
    if (isStarted && isRested) {
      if (round < 4) animate(scope.current, { y: 1350 }, { duration: 300 });
      if (round === 4) animate(scope.current, { y: 1350 }, { duration: 1800 });
    }
    if (!isStarted) animate(scope.current, { y: 0 });
  });

  return (
    <Background $isRested={isRested}>
      <BackgroundAnimation $isRested={isRested} ref={scope} />
      <Container>
        <Title>Pomodoro</Title>
        <Timer />
        <Buttons />
        <Counter />
      </Container>
    </Background>
  );
}
