import { motion, useAnimate } from "framer-motion";
import { useEffect } from "react";
import styled from "styled-components";

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
  color: #e74c3d;
`;

export default function Card({ time }: { time: string }) {
  const [scope, animate] = useAnimate();

  useEffect(() => {
    animate(scope.current, { scale: [0.6, 1] }, { type: "spring", bounce: 0.2 });
  }, [time]);

  return <Time ref={scope}>{time}</Time>;
}
