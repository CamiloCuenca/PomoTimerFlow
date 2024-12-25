import { StyleSheet, Text, View, TextInput, ScrollView } from 'react-native';
import { useState } from 'react';
import colors from '../constants/colors.json';

export default function SettingsScreen({
  workTime,
  setWorkTime,
  restTime,
  setRestTime,
}) {
  // Estados locales para los valores de los inputs
  const [localWorkTime, setLocalWorkTime] = useState(workTime / 60);
  const [localRestTime, setLocalRestTime] = useState(restTime / 60);

  const handleWorkTimeChange = (value) => {
    const parsedValue = Math.max(parseInt(value) || 0, 0); 
    setLocalWorkTime(parsedValue);
    setWorkTime(parsedValue * 60); // Actualizar el estado global
  };

  const handleRestTimeChange = (value) => {
    const parsedValue = Math.max(parseInt(value) || 0, 0);
    setLocalRestTime(parsedValue);
    setRestTime(parsedValue * 60); // Actualizar el estado global
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Text style={styles.HeaderText}>Pomodoro Settings</Text>

        <Text style={styles.text}>Time work (minutes):</Text>
        <TextInput
          value={localWorkTime.toString()} // Mostrar el valor local
          keyboardType="numeric"
          onChangeText={handleWorkTimeChange}
          style={styles.input}
        />

        <Text style={styles.text}>Time rest (minutes):</Text>
        <TextInput
          value={localRestTime.toString()} // Mostrar el valor local
          keyboardType="numeric"
          onChangeText={handleRestTimeChange}
          style={styles.input}
        />
      </View>

      <View style={styles.container}>
        <Text style={styles.HeaderText}>Themes Settings</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    alignItems: 'center',
    backgroundColor: colors.secondary,
  },
  container: {
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexDirection: 'column',
    width: '100%',
    paddingVertical: 20,
  },
  text: {
    color: 'white',
    fontSize: 20,
    marginTop: 20,
  },
  input: {
    backgroundColor: colors.tertiary,
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    borderRadius: 12,
    height: 50,
    width: '50%',
    marginVertical: 15,
  },
  HeaderText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 30,
  },
});
