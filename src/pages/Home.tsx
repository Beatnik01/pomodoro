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
  return (
    <Container>
      <Title>Pomodoro</Title>
      <TimerContainer>
        <Time>10</Time>
        <Colon>:</Colon>
        <Time>00</Time>
      </TimerContainer>
      <Button>
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
      <CountContainer>
        <Count>
          <span>0/4</span>
          <span>ROUND</span>
        </Count>
        <Count>
          <span>0/12</span>
          <span>GOAL</span>
        </Count>
      </CountContainer>
    </Container>
  );
}
