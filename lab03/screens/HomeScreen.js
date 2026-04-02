import React from 'react';
import styled from 'styled-components/native';
import { StyleSheet, Text } from 'react-native';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, withSequence, withTiming } from 'react-native-reanimated';
import { useGame } from '../GameContext';

const Container = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  background-color: ${props => props.theme.background};
`;

const ScoreText = styled.Text`
  font-size: 48px;
  font-weight: bold;
  color: ${props => props.theme.primary};
  margin-bottom: 50px;
`;

const GestureLegend = styled.View`
  margin-top: 50px;
  padding: 20px;
  background-color: ${props => props.theme.card};
  border-radius: 10px;
`;

const LegendText = styled.Text`
  color: ${props => props.theme.text};
  margin-vertical: 2px;
`;

export default function HomeScreen() {
  const { addScore, registerGesture, score } = useGame();

  const scale = useSharedValue(1);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
    ],
  }));

  const doubleTap = Gesture.Tap().numberOfTaps(2).onStart(() => {
    addScore(2);
    registerGesture('doubleTaps');
    scale.value = withSequence(withTiming(1.5, { duration: 100 }), withTiming(1, { duration: 100 }));
  });

  const singleTap = Gesture.Tap().onStart(() => {
    addScore(1);
    registerGesture('taps');
    scale.value = withSequence(withTiming(1.2, { duration: 100 }), withTiming(1, { duration: 100 }));
  });

  const longPress = Gesture.LongPress().minDuration(3000).onStart(() => {
    addScore(5);
    registerGesture('longPresses');
  });

  const pan = Gesture.Pan()
    .onUpdate((e) => {
      translateX.value = e.translationX;
      translateY.value = e.translationY;
    })
    .onEnd(() => {
      registerGesture('drags');
      translateX.value = withSpring(0);
      translateY.value = withSpring(0);
    });

  const flingRight = Gesture.Fling().direction(1).onStart(() => {
    addScore(Math.floor(Math.random() * 10) + 1);
    registerGesture('swipesRight');
  });

  const flingLeft = Gesture.Fling().direction(2).onStart(() => {
    addScore(Math.floor(Math.random() * 10) + 1);
    registerGesture('swipesLeft');
  });

  const pinch = Gesture.Pinch()
    .onUpdate((e) => { scale.value = e.scale; })
    .onEnd(() => {
      addScore(3);
      registerGesture('pinches');
      scale.value = withSpring(1);
    });

  const taps = Gesture.Exclusive(doubleTap, singleTap);
  const composedGestures = Gesture.Simultaneous(taps, longPress, pan, flingRight, flingLeft, pinch);

  return (
    <Container>
      <ScoreText>{score}</ScoreText>
      
      <GestureDetector gesture={composedGestures}>
        <Animated.View style={[styles.clickerObject, animatedStyle]}>
          <Text style={styles.clickerText}>TAP ME</Text>
        </Animated.View>
      </GestureDetector>

      <GestureLegend>
        <LegendText>Tap: +1 point</LegendText>
        <LegendText>Double-tap: +2 points</LegendText>
        <LegendText>Long-press (3s): +5 points</LegendText>
        <LegendText>Swipe: Random 1-10 points</LegendText>
        <LegendText>Pinch: +3 points</LegendText>
      </GestureLegend>
    </Container>
  );
}

const styles = StyleSheet.create({
  clickerObject: {
    width: 150, height: 150, borderRadius: 75,
    backgroundColor: '#0ea5e9',
    alignItems: 'center', justifyContent: 'center',
    elevation: 5,
  },
  clickerText: { color: '#fff', fontWeight: 'bold', fontSize: 20 }
});