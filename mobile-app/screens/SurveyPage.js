import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Platform
} from "react-native";

import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";

const CLOUD_FUNCTION_URL = "https://submitsurvey-uxh5bkjtea-uc.a.run.app";

const AI_MODELS = ["ChatGPT", "Bard", "Claude", "Copilot"];
const EDUCATION_OPTIONS = ["HighSchool", "College", "M.S.", "Ph.D."];
const GENDER_OPTIONS = ["Male", "Female", "Nonbinary"];

export default function SurveyPage() {
  const [name, setName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [birthDateObj, setBirthDateObj] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [education, setEducation] = useState("");
  const [city, setCity] = useState("");
  const [gender, setGender] = useState("");
  const [selectedModels, setSelectedModels] = useState([]);
  const [defects, setDefects] = useState({});
  const [useCase, setUseCase] = useState("");

  const allFieldsValid =
    name.trim() !== "" &&
    birthDate !== "" &&
    education !== "" &&
    city.trim() !== "" &&
    gender !== "" &&
    selectedModels.length > 0 &&
    useCase.trim() !== "";

  const toggleModel = (model) => {
    if (selectedModels.includes(model)) {
      const updated = selectedModels.filter((m) => m !== model);
      setSelectedModels(updated);
      const updatedDefects = { ...defects };
      delete updatedDefects[model];
      setDefects(updatedDefects);
    } else {
      setSelectedModels([...selectedModels, model]);
      setDefects({ ...defects, [model]: "" });
    }
  };

  const handleSend = async () => {
    if (!allFieldsValid) return;

    const surveyData = {
      name,
      birthDate,
      education,
      city,
      gender,
      selectedModels,
      defects,
      useCase,
    };

    try {
      const response = await fetch(CLOUD_FUNCTION_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(surveyData),
      });

      if (response.ok) {
        const json = await response.json();
        console.log("Survey submitted successfully:", json);
        Alert.alert("Success", "Survey submitted and email sent!");
      } else {
        const errorText = await response.text();
        console.error("Cloud Function responded with error:", errorText);
        Alert.alert("Error", "Failed to submit survey. Please try again.");
      }
    } catch (error) {
      console.error("Network error:", error);
      Alert.alert("Error", "Could not connect. Please try again later.");
    }
  };

  const onDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      const isoString = selectedDate.toISOString().split("T")[0];
      setBirthDate(isoString);
      setBirthDateObj(selectedDate);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>AI Survey</Text>

      {/* Name */}
      <TextInput
        style={styles.input}
        placeholder="Name Surname"
        value={name}
        onChangeText={setName}
      />

      {/* Birth Date */}
      <Text style={styles.label}>Birth Date</Text>
      <TextInput
        style={styles.input}
        placeholder="Tap to select birth date"
        value={birthDate}
        onFocus={() => setShowDatePicker(true)}
      />
      {showDatePicker && (
        <DateTimePicker
          value={birthDateObj}
          mode="date"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={onDateChange}
        />
      )}

      {/* Education */}
      <Text style={styles.label}>Education Level</Text>
      <View style={styles.pickerBox}>
        <Picker
          selectedValue={education}
          onValueChange={(val) => setEducation(val)}
        >
          <Picker.Item label="-- Select Education --" value="" />
          {EDUCATION_OPTIONS.map((ed) => (
            <Picker.Item label={ed} value={ed} key={ed} />
          ))}
        </Picker>
      </View>

      {/* City */}
      <TextInput
        style={styles.input}
        placeholder="City"
        value={city}
        onChangeText={setCity}
      />

      {/* Gender */}
      <Text style={styles.label}>Gender</Text>
      <View style={styles.pickerBox}>
        <Picker
          selectedValue={gender}
          onValueChange={(val) => setGender(val)}
        >
          <Picker.Item label="-- Select Gender --" value="" />
          {GENDER_OPTIONS.map((g) => (
            <Picker.Item label={g} value={g} key={g} />
          ))}
        </Picker>
      </View>

      {/* AI Models */}
      <Text style={styles.label}>Which AI model(s) did you try?</Text>
      <View style={styles.checkboxContainer}>
        {AI_MODELS.map((model) => {
          const selected = selectedModels.includes(model);
          return (
            <TouchableOpacity
              key={model}
              style={[
                styles.checkboxItem,
                selected && styles.selectedCheckboxItem,
              ]}
              onPress={() => toggleModel(model)}
            >
              <Text style={styles.checkboxText}>{model}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Defects */}
      {selectedModels.map((model) => (
        <TextInput
          key={model}
          style={[styles.input, { borderColor: "#e06c75" }]}
          placeholder={`Any defects/cons for ${model}?`}
          value={defects[model]}
          onChangeText={(text) => {
            setDefects({ ...defects, [model]: text });
          }}
        />
      ))}

      {/* Use Case */}
      <TextInput
        style={[styles.input, { height: 80 }]}
        placeholder="Any beneficial AI use case in daily life?"
        value={useCase}
        onChangeText={setUseCase}
        multiline
      />

      {/* Submit Button */}
      <View style={{ marginTop: 10 }}>
        {allFieldsValid ? (
          <Button title="Send Survey" onPress={handleSend} />
        ) : (
          <Text style={styles.warningText}>
            Please fill out all fields to send.
          </Text>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    backgroundColor: "#000", // dark background
    flexGrow: 1,
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    marginBottom: 20,
    textAlign: "center",
    color: "#ffffff", // white text
  },
  label: {
    fontWeight: "600",
    marginBottom: 5,
    color: "#ffffff", // white label
  },
  input: {
    borderWidth: 1,
    borderColor: "#888",
    backgroundColor: "#1a1a1a", // darker textbox for contrast
    marginBottom: 16,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    fontSize: 16,
    color: "#ffffff", // white text
  },
  pickerBox: {
    borderWidth: 1,
    borderColor: "#888",
    borderRadius: 8,
    backgroundColor: "#1a1a1a", // darker dropdown bg
    marginBottom: 16,
    color: "#ffffff", // ensures picker text is white (Android)
  },
  checkboxContainer: {
    flexDirection: "column",
    marginBottom: 16,
  },
  checkboxItem: {
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#555",
    marginBottom: 8,
    backgroundColor: "#222",
  },
  selectedCheckboxItem: {
    backgroundColor: "#375a7f",
    borderColor: "#5dade2",
  },
  checkboxText: {
    fontSize: 16,
    color: "#ffffff", // white checkbox text
  },
  warningText: {
    color: "#ff6b6b",
    textAlign: "center",
    fontWeight: "500",
    marginTop: 10,
  },
});


