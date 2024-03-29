import { motion, useAnimate } from "framer-motion";
import { useEffect } from "react";
import { useRecoilValue } from "recoil";
import styled from "styled-components";
import { TimerStateAtom, isRestedStateAtom } from "../atoms";

const TimerContainer = styled.div<{ $isRested?: boolean }>`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  color: ${(props) => (props.$isRested ? "#2ecc71" : "#e74c3d")};
`;

const Card = styled(motion.div)`
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: white;
  border-radius: 10px;
  font-size: 8rem;
  font-weight: 900;
  width: 11rem;
  line-height: 15rem;
  padding: 0.5rem 1rem;
  box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
`;

const Colon = styled.div`
  font-size: 10rem;
  color: white;
`;

export default function Timer() {
  const timer = useRecoilValue(TimerStateAtom);
  const isRested = useRecoilValue(isRestedStateAtom);
  const [minScope, minAnimate] = useAnimate();
  const [secScope, secAnimate] = useAnimate();

  useEffect(() => {
    minAnimate(
      minScope.current,
      { scale: [0.6, 1], opacity: [0, 1] },
      { type: "spring", bounce: 0.2 }
    );
  }, [timer.minutes]);

  useEffect(() => {
    secAnimate(
      secScope.current,
      { scale: [0.6, 1], opacity: [0, 1] },
      { type: "spring", bounce: 0.2 }
    );
  }, [timer.seconds]);
  // useEffect 하나에서 animate를 처리하면 seconds가 갱신될때 minutes의 animte도 실행됨.

  return (
    <TimerContainer $isRested={isRested}>
      <Card ref={minScope}>{String(timer.minutes).padStart(2, "0")}</Card>
      <Colon>:</Colon>
      <Card ref={secScope}>{String(timer.seconds).padStart(2, "0")}</Card>
    </TimerContainer>
  );
}
