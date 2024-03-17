import { useRecoilValue } from "recoil";
import styled from "styled-components";
import { GoalStateAtom, RoundStateAtom } from "../atoms";

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

export default function Counter() {
  const round = useRecoilValue(RoundStateAtom);
  const goal = useRecoilValue(GoalStateAtom);
  return (
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
  );
}
