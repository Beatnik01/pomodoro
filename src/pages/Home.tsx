import { useEffect, useState } from "react";
import styled from "styled-components";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  max-width: 30rem;
  margin: 0 auto;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
`;

const Title = styled.h1`
  text-align: center;
  color: white;
  font-weight: 900;
  font-size: 5rem;
  margin: 10rem 0;
`;

const TimerContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
`;

const Time = styled.div`
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

const Colon = styled.div`
  font-size: 10rem;
  color: white;
`;

const Button = styled.button`
  width: 10rem;
  height: 10rem;
  border-radius: 50%;
  border: none;
  margin: 10rem 0;
  background-color: rgba(0, 0, 0, 0.2);
  color: white;
  cursor: pointer;
  svg {
    width: 7rem;
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
  const [isStarted, setIsStarted] = useState(false);
  const [isRested, setIsRested] = useState(false);
  const [minutes, setMinutes] = useState(25);
  const [second, setSecond] = useState(0);
  const [round, setRound] = useState(0);
  const [goal, setGoal] = useState(0);

  const onStart = () => {
    setIsStarted((prev) => !prev);
  };
  useEffect(() => {
    if (minutes < 0) {
      setRound((prev) => prev + 1);
      setIsRested(true);
    }

    if (second < 0) {
      setMinutes((prev) => prev - 1);
      setSecond(59);
    }

    if (round === 4) {
      setRound(0);
      setGoal((prev) => prev + 1);
    }

    if (isStarted) {
      const timer = setInterval(() => {
        setSecond((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }

    if (isRested) {
      round === 4 ? setMinutes(30) : setMinutes(5);
    }
  });
  return (
    <Container>
      <Title>Pomodoro</Title>
      <TimerContainer>
        <Time>{String(minutes).padStart(2, "0")}</Time>
        <Colon>:</Colon>
        <Time>{String(second).padStart(2, "0")}</Time>
      </TimerContainer>
      {isStarted ? (
        <Button onClick={onStart}>
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
        <Button onClick={onStart}>
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