import React from 'react';
import styled from 'styled-components/native';
import { Switch } from 'react-native';
import { useGame } from '../GameContext';

const Container = styled.View`
  flex: 1;
  background-color: ${props => props.theme.background};
  padding: 20px;
`;

const SettingRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  background-color: ${props => props.theme.card};
  padding: 16px;
  border-radius: 12px;
`;

const SettingText = styled.Text`
  font-size: 18px;
  color: ${props => props.theme.text};
`;

export default function SettingsScreen() {
  const { isDarkTheme, toggleTheme } = useGame();

  return (
    <Container>
      <SettingRow>
        <SettingText>Темна тема</SettingText>
        <Switch 
          value={isDarkTheme} 
          onValueChange={toggleTheme} 
          trackColor={{ false: "#767577", true: "#0ea5e9" }}
        />
      </SettingRow>
    </Container>
  );
}