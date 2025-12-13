import '../global.css';
import { Stack } from 'expo-router';
import { ThemeProvider } from '../context/ThemeContext';
import { AudioProvider } from '../context/AudioContext';
import { AudioPlayerProvider } from '../context/AudioPlayerContext';
import { Provider as PaperProvider } from 'react-native-paper';
import { TaskProvider } from '../context/TaskContext';


export default function RootLayout() {
  return (
    <ThemeProvider>
      <AudioProvider>
        <AudioPlayerProvider>
          <PaperProvider>
            <TaskProvider>
              <Stack screenOptions={{ headerShown: false }} />
            </TaskProvider>
          </PaperProvider>
        </AudioPlayerProvider>
      </AudioProvider>
    </ThemeProvider>
  );
}