import React from 'react';
import styled from 'styled-components/native';
import { ScrollView } from 'react-native';
import { useGame } from '../GameContext';

const Container = styled.ScrollView`
  flex: 1;
  background-color: ${props => props.theme.background};
  padding: 16px;
`;

const ChallengeCard = styled.View`
  background-color: ${props => props.theme.card};
  padding: 16px;
  border-radius: 12px;
  margin-bottom: 12px;
  border-left-width: 5px;
  border-left-color: ${props => props.completed ? '#22c55e' : props.theme.primary};
`;

const Title = styled.Text`
  font-size: 16px;
  font-weight: bold;
  color: ${props => props.theme.text};
`;

const ProgressText = styled.Text`
  font-size: 14px;
  color: gray;
  margin-top: 4px;
`;

export default function ChallengesScreen() {
  const game = useGame();

  const challenges = [
    { title: 'Зробити 10 кліків', current: game.taps, target: 10 },
    { title: 'Зробити подвійний клік 5 разів', current: game.doubleTaps, target: 5 },
    { title: 'Утримувати об\'єкт 3 секунди', current: game.longPresses, target: 1 },
    { title: 'Перетягнути об\'єкт', current: game.drags, target: 1 },
    { title: 'Зробити свайп вправо', current: game.swipesRight, target: 1 },
    { title: 'Зробити свайп вліво', current: game.swipesLeft, target: 1 },
    { title: 'Змінити розмір об\'єкта (Pinch)', current: game.pinches, target: 1 },
    { title: 'Отримати 100 очок', current: game.score, target: 100 },
    { title: 'Майстер жестів: Зробити 5 Pinch та набрати 200 очок', current: Math.min(game.pinches / 5, game.score / 200) * 100, target: 100, isPercentage: true },
  ];

  return (
    <Container>
      {challenges.map((challenge, index) => {
        const isCompleted = challenge.current >= challenge.target;
        return (
          <ChallengeCard key={index} completed={isCompleted}>
            <Title>{challenge.title}</Title>
            <ProgressText>
              {isCompleted ? 'Виконано' : 
                challenge.isPercentage 
                  ? `Прогрес: ${Math.floor(challenge.current)}%`
                  : `${challenge.current} / ${challenge.target}`
              }
            </ProgressText>
          </ChallengeCard>
        );
      })}
    </Container>
  );
}