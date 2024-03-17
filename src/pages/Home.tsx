import { useEffect } from "react";
import { motion, useAnimationControls } from "framer-motion";
import styled from "styled-components";
import Timer from "../components/Timer";
import { useRecoilState } from "recoil";
import {
  GoalStateAtom,
  RoundStateAtom,
  TimerStateAtom,
  isResetedStateAtom,
  isRestedStateAtom,
  isSkipedStateAtom,
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
  margin: 5rem 0;
`;

export default function Home() {
  const [timer, setTimer] = useRecoilState(TimerStateAtom);
  const [isStarted, setIsStarted] = useRecoilState(isStartStateAtom);
  const [isRested, setIsRested] = useRecoilState(isRestedStateAtom);
  const [round, setRound] = useRecoilState(RoundStateAtom);
  const [isSkiped, setIsSkiped] = useRecoilState(isSkipedStateAtom);
  const [isReseted, setIsReseted] = useRecoilState(isResetedStateAtom);
  const [goal, setGoal] = useRecoilState(GoalStateAtom);
  const controls = useAnimationControls(); // 애니메이션을 제어하기 위한 컨트롤러

  useEffect(() => {
    let interval: number;
    // 집중 상태에서의 타이머 로직
    if (isStarted && !isRested) {
      interval = setInterval(() => {
        setTimer((prev) => {
          if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
          if (prev.minutes === 0 && prev.seconds === 0) {
            setIsRested(true); // 휴식 상태로 변경
            setIsStarted(false);
            setRound(round + 1); // 라운드 증가
            if (round < 4) return { ...prev, minutes: 5 };
            if (round === 4) {
              setGoal(goal + 1); // 목표 달성 횟수 증가
              setRound(0); // 라운드 초기화
              return { ...prev, minutes: 30 };
            }
            if (goal > 12) setGoal(0); // 목표 달성 횟수 초기화
          }
          return { ...prev, seconds: 59, minutes: prev.minutes - 1 };
        });
      }, 1000);
    }
    return () => clearInterval(interval); // 컴포넌트 언마운트 시 타이머 정리
  }, [timer, round, goal, isStarted, isRested]);

  useEffect(() => {
    let interval: number;
    // 휴식 상태에서의 타이머 로직
    if (isRested && isStarted) {
      interval = setInterval(() => {
        setTimer((prev) => {
          if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
          if (prev.minutes === 0 && prev.seconds === 0) {
            setIsRested(false); // 집중 상태로 변경
            setIsStarted(false);
            return { ...prev, minutes: 25 }; // 집중 시간으로 설정
          }
          return { ...prev, seconds: 59, minutes: prev.minutes - 1 };
        });
      }, 1000);
    }
    return () => clearInterval(interval); // 컴포넌트 언마운트 시 타이머 정리
  }, [timer, isStarted, isRested]);

  useEffect(() => {
    // 애니메이션 제어 및 초기화 처리
    if (isStarted && !isRested) controls.start({ y: "100%" }, { duration: 1500 });
    if (isStarted && isRested) {
      if (round < 4) controls.start({ y: "100%" }, { duration: 300 });
      if (round === 4) controls.start({ y: "100%" }, { duration: 1800 });
    }
    if (isReseted) {
      controls.set({ y: 0 }); // 애니메이션 초기 위치로 설정
      setIsReseted(false); // 초기화 상태 해제
    }
    if (isSkiped) {
      controls.set({ y: 0 }); // 애니메이션 초기 위치로 설정
      setIsSkiped(false); // 스킵 상태 해제
    }
    if (!isStarted) {
      controls.stop(); // 애니메이션 정지
    }
  }, [isStarted, isRested, isSkiped, round, controls, setIsReseted]);

  return (
    <Background $isRested={isRested}>
      <BackgroundAnimation $isRested={isRested} animate={controls} /> {/* 애니메이션 요소 */}
      <Container>
        <Title>Pomodoro</Title>
        <Timer />
        <Buttons />
        <Counter />
      </Container>
    </Background>
  );
}
