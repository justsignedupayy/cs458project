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

// For the date picker
import DateTimePicker from "@react-native-community/datetimepicker";
// For education & gender dropdowns
import { Picker } from "@react-native-picker/picker";

// Your cloud function URL
const CLOUD_FUNCTION_URL = "https://submitsurvey-uxh5bkjtea-uc.a.run.app";

// The multiple AI models to choose from:
const AI_MODELS = ["ChatGPT", "Bard", "Claude", "Copilot"];

// Education & gender dropdown options
const EDUCATION_OPTIONS = ["HighSchool", "College", "M.S.", "Ph.D."];
const GENDER_OPTIONS = ["Male", "Female", "Nonbinary"];

export default function SurveyPage() {
  // All the states
  const [name, setName] = useState("");

  const [birthDate, setBirthDate] = useState(""); // We'll store YYYY-MM-DD
  const [birthDateObj, setBirthDateObj] = useState(new Date()); // for the native picker
  const [showDatePicker, setShowDatePicker] = useState(false);

  const [education, setEducation] = useState("");
  const [city, setCity] = useState("");
  const [gender, setGender] = useState("");

  const [selectedModels, setSelectedModels] = useState([]);
  const [defects, setDefects] = useState({}); // key = model, value = text

  const [useCase, setUseCase] = useState("");

  // Validate all fields:
  const allFieldsValid =
    name.trim() !== "" &&
    birthDate !== "" &&
    education !== "" &&
    city.trim() !== "" &&
    gender !== "" &&
    selectedModels.length > 0 &&
    useCase.trim() !== "";

  // Toggle model selection
  const toggleModel = (model) => {
    if (selectedModels.includes(model)) {
      // remove from array
      const updatedModels = selectedModels.filter((m) => m !== model);
      setSelectedModels(updatedModels);

      // remove from defects
      const updatedDefects = { ...defects };
      delete updatedDefects[model];
      setDefects(updatedDefects);
    } else {
      // add to array
      setSelectedModels([...selectedModels, model]);
      // ensure we have a text field for that model
      setDefects({ ...defects, [model]: "" });
    }
  };

  // Handle submit
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
        // Optionally reset the form or navigate away
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

  // Date picker callback
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

      {/* Birth Date (native DateTimePicker) */}
      <View style={{ marginBottom: 10 }}>
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
      </View>

      {/* Education Level dropdown */}
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

      {/* City (text input) */}
      <TextInput
        style={styles.input}
        placeholder="City"
        value={city}
        onChangeText={setCity}
      />

      {/* Gender dropdown */}
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

      {/* AI Models (multiple selection) */}
      <View style={styles.checkboxContainer}>
        <Text style={styles.label}>Which AI model(s) did you try?</Text>
        {AI_MODELS.map((model) => {
          const selected = selectedModels.includes(model);
          return (
            <TouchableOpacity
              key={model}
              style={[styles.checkboxItem, selected && styles.selected]}
              onPress={() => toggleModel(model)}
            >
              <Text style={styles.checkboxText}>{model}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Defects for each selected model */}
      {selectedModels.map((model) => (
        <TextInput
          key={model}
          style={[styles.input, { borderColor: "red" }]}
          placeholder={`Any defects/cons for ${model}?`}
          value={defects[model]}
          onChangeText={(text) => {
            setDefects({ ...defects, [model]: text });
          }}
        />
      ))}

      {/* Use Case (text input, multiline) */}
      <TextInput
        style={[styles.input, { height: 80 }]}
        placeholder="Any beneficial AI use case in daily life?"
        value={useCase}
        onChangeText={setUseCase}
        multiline
      />

      {/* Send Button */}
      {allFieldsValid ? (
        <Button title="Send" onPress={handleSend} />
      ) : (
        <Text style={{ color: "red", textAlign: "center", marginTop: 10 }}>
          Please fill out all fields to send.
        </Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: "stretch",
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
    marginBottom: 10,
    textAlign: "center",
  },
  label: {
    marginVertical: 5,
    fontWeight: "500",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    marginBottom: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 5,
  },
  pickerBox: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    marginBottom: 10,
  },
  checkboxContainer: {
    marginVertical: 10,
  },
  checkboxItem: {
    padding: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    marginBottom: 5,
    borderRadius: 5,
  },
  selected: {
    backgroundColor: "#cdf",
  },
  checkboxText: {
    fontSize: 16,
  },
});
