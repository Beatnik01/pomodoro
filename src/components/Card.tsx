import { motion, useAnimate } from "framer-motion";
import { useEffect } from "react";
import styled from "styled-components";

const TimerContainer = styled.div<{ $isRested?: boolean }>`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  color: ${(props) => (props.$isRested ? "#2ecc71" : "#e74c3d")};
`;

const Time = styled(motion.div)`
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

export default function Card({
  minutes,
  seconds,
  isRested,
}: {
  minutes: number;
  seconds: number;
  isRested: boolean;
}) {
  const [scope, animate] = useAnimate();

  useEffect(() => {
    animate(scope.current, { scale: [0.6, 1], opacity: [0, 1] }, { type: "spring", bounce: 0.2 });
  }, [minutes]);

  return (
    <TimerContainer $isRested={isRested}>
      <Time ref={scope}>{String(minutes).padStart(2, "0")}</Time>
      <Colon>:</Colon>
      <Time ref={scope}>{String(seconds).padStart(2, "0")}</Time>
    </TimerContainer>
  );
}
