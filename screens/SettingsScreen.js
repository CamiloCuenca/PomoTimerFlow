import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, ScrollView } from 'react-native';
import { themeContext } from '../themesContext';
import { Picker } from '@react-native-picker/picker';

export default function SettingsScreen({
  workTime,
  setWorkTime,
  restTime,
  setRestTime,
}) {
  const [localWorkTime, setLocalWorkTime] = useState(workTime / 60);
  const [localRestTime, setLocalRestTime] = useState(restTime / 60);
  const [selectedTheme, setSelectedTheme] = useState('Dark'); // Estado para el tema seleccionado
  const { theme, changeTheme } = React.useContext(themeContext); // Desestructuración de 'theme' y 'changeTheme'

  const handleWorkTimeChange = (value) => {
    const parsedValue = Math.max(parseInt(value) || 0, 0);
    setLocalWorkTime(parsedValue);
    setWorkTime(parsedValue * 60);
  };

  const handleRestTimeChange = (value) => {
    const parsedValue = Math.max(parseInt(value) || 0, 0);
    setLocalRestTime(parsedValue);
    setRestTime(parsedValue * 60);
  };

  const handleThemeChange = (themeName) => {
    setSelectedTheme(themeName);
    changeTheme(themeName); // Cambiar el tema seleccionado
  };

  return (
    <ScrollView
      contentContainerStyle={[styles.scrollContainer, { backgroundColor: theme.secondary }]}
    >
      <View style={styles.container}>
        <Text style={[styles.HeaderText, { color: theme.foreground }]}>Pomodoro Settings</Text>

        <Text style={[styles.text, { color: theme.foreground }]}>Time work (minutes):</Text>
        <TextInput
          value={localWorkTime.toString()}
          keyboardType="numeric"
          onChangeText={handleWorkTimeChange}
          style={[styles.input, { backgroundColor: theme.tertiary, color: theme.foreground }]}
        />

        <Text style={[styles.text, { color: theme.foreground }]}>Time rest (minutes):</Text>
        <TextInput
          value={localRestTime.toString()}
          keyboardType="numeric"
          onChangeText={handleRestTimeChange}
          style={[styles.input, { backgroundColor: theme.tertiary, color: theme.foreground }]}
        />
      </View>

      <View style={styles.container}>
        <Text style={[styles.HeaderText, { color: theme.foreground }]}>Themes Settings</Text>
      </View>

      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={selectedTheme}
          onValueChange={(itemValue) => handleThemeChange(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="Dark" value="dark" />
          <Picker.Item label="Toxic" value="Toxic" />
          <Picker.Item label="Blue" value="blue" />
          <Picker.Item label="Light" value="light" />
          <Picker.Item label="Ocean" value="ocean" />
          <Picker.Item label="Sunset" value="sunset" />
          <Picker.Item label="Forest" value="forest" />
          <Picker.Item label="Purple" value="purple" />
          <Picker.Item label="Red" value="red" />
          <Picker.Item label="Yellow" value="yellow" />

        </Picker>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    alignItems: 'center',
  },
  container: {
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexDirection: 'column',
    width: '100%',
    paddingVertical: 20,
  },
  text: {
    fontSize: 20,
    marginTop: 20,
  },
  input: {
    fontWeight: 'bold',
    textAlign: 'center',
    borderRadius: 12,
    height: 50,
    width: '50%',
    marginVertical: 15,
    borderWidth: 1,
    borderColor: 'white',
  },
  HeaderText: {
    fontWeight: 'bold',
    fontSize: 30,
  },
  pickerContainer: {
    width: '80%',
    backgroundColor: '#f0f0f0',
    borderRadius: 12,
    marginVertical: 15,
  },
  picker: {
    height: 50,
    color: '#000',
  },
});
