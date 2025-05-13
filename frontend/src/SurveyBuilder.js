import React, { useState } from 'react';
import { addSurvey } from './firebaseConfig';

const styles = {
  container: {
    maxWidth: '800px',
    margin: '2rem auto',
    padding: '0 1rem',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  header: {
    color: '#2c3e50',
    textAlign: 'center',
    marginBottom: '2rem',
  },
  input: {
    width: '100%',
    padding: '0.8rem',
    margin: '0.5rem 0',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '1rem',
  },
  button: {
    padding: '0.6rem 1.2rem',
    margin: '0.5rem',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
  primaryButton: {
    backgroundColor: '#3498db',
    color: 'white',
    '&:hover': {
      backgroundColor: '#2980b9',
    },
  },
  secondaryButton: {
    backgroundColor: '#95a5a6',
    color: 'white',
    '&:hover': {
      backgroundColor: '#7f8c8d',
    },
  },
  dangerButton: {
    backgroundColor: '#e74c3c',
    color: 'white',
    '&:hover': {
      backgroundColor: '#c0392b',
    },
  },
  questionItem: {
    backgroundColor: 'white',
    borderRadius: '8px',
    padding: '1.5rem',
    margin: '1rem 0',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  questionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1rem',
  },
  optionItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    margin: '0.5rem 0',
  },
  errorMessage: {
    color: '#e74c3c',
    backgroundColor: '#f8d7da',
    padding: '1rem',
    borderRadius: '4px',
    margin: '1rem 0',
  },
  configSection: {
    margin: '1rem 0',
    padding: '1rem',
    backgroundColor: '#f8f9fa',
    borderRadius: '4px',
  },
  label: {
    display: 'block',
    margin: '0.5rem 0',
    fontWeight: '500',
  },
};

const SurveyBuilder = ({ user, onSurveyCreated }) => {
  const [questions, setQuestions] = useState([]);
  const [validationError, setValidationError] = useState(null);
  const [surveyTitle, setSurveyTitle] = useState('');

  // Question type interfaces
  const addMultipleChoiceQuestion = () => {
    const newQuestion = {
      type: 'multiple-choice',
      text: '',
      options: ['', ''],
      required: false
    };
    setQuestions([...questions, newQuestion]);
  };

  const addRatingScaleQuestion = () => {
    const newQuestion = {
      type: 'rating-scale',
      text: '',
      min: 1,
      max: 5,
      required: false
    };
    setQuestions([...questions, newQuestion]);
  };

  const addConditionalQuestion = () => {
    const newQuestion = {
      type: 'conditional',
      text: '',
      condition: null,
      dependsOn: null,
      required: false
    };
    setQuestions([...questions, newQuestion]);
  };

  const addDropdownQuestion = () => {
    const newQuestion = {
      type: 'dropdown',
      text: '',
      options: ['', ''],
      required: false
    };
    setQuestions([...questions, newQuestion]);
  };

  const addCheckboxQuestion = () => {
    const newQuestion = {
      type: 'checkbox',
      text: '',
      options: ['', ''],
      required: false
    };
    setQuestions([...questions, newQuestion]);
  };

  const updateQuestion = (index, updates) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index] = { ...updatedQuestions[index], ...updates };
    setQuestions(updatedQuestions);
  };

  // --- Missing Functions Start ---

  const removeQuestion = (indexToRemove) => {
    const updatedQuestions = questions.filter((_, index) => index !== indexToRemove);
    setQuestions(updatedQuestions);
  };

  const updateQuestionOption = (questionIndex, optionIndex, newOption) => {
    const updatedQuestions = [...questions];
    if (updatedQuestions[questionIndex]?.options) {
      updatedQuestions[questionIndex].options[optionIndex] = newOption;
      setQuestions(updatedQuestions);
    }
  };

  const addQuestionOption = (questionIndex) => {
    const updatedQuestions = [...questions];
    if (updatedQuestions[questionIndex]?.options) {
      updatedQuestions[questionIndex].options.push('');
      setQuestions(updatedQuestions);
    }
  };

  const removeQuestionOption = (questionIndex, optionIndex) => {
    const updatedQuestions = [...questions];
    if (updatedQuestions[questionIndex]?.options && updatedQuestions[questionIndex].options.length > 2) {
      updatedQuestions[questionIndex].options = updatedQuestions[questionIndex].options.filter((_, index) => index !== optionIndex);
      setQuestions(updatedQuestions);
    } else if (updatedQuestions[questionIndex]?.options?.length <= 2) {
      alert("Multiple choice questions must have at least two options.");
    }
  };

  const updateConditionalQuestionDependency = (questionIndex, dependency) => {
    const updatedQuestions = [...questions];
    if (updatedQuestions[questionIndex]?.type === 'conditional') {
      updatedQuestions[questionIndex].dependsOn = dependency;
      setQuestions(updatedQuestions);
    }
  };

  const updateConditionalQuestionCondition = (questionIndex, condition) => {
    const updatedQuestions = [...questions];
    if (updatedQuestions[questionIndex]?.type === 'conditional') {
      updatedQuestions[questionIndex].condition = condition;
      setQuestions(updatedQuestions);
    }
  };

  // --- Missing Functions End ---

  const validateSurvey = () => {
    // Basic validation
    if (!surveyTitle.trim()) {
      setValidationError('Survey must have a title');
      return false;
    }

    const requiredQuestionsMissing = questions.some(
      q => q.required && (!q.text || q.text.trim() === '')
    );

    if (requiredQuestionsMissing) {
      setValidationError('Please fill in all required questions');
      return false;
    }

    setValidationError(null);
    return true;
  };

  // In SurveyBuilder.js - Modified submit function
  const submitSurvey = async () => {
    if (!validateSurvey()) return;

    try {
      const surveyData = {
        title: surveyTitle.trim(),
        questions: questions.map(q => ({
          ...q,
          text: q.text.trim(),
          ...(q.type === 'conditional' && {
            dependsOn: q.dependsOn?.trim() || '',
            condition: q.condition?.trim() || ''
          })
        })),
        createdAt: new Date(),
        createdBy: user.uid
      };

      const result = await addSurvey(surveyData, user.uid);

      if (result.success) {
        setQuestions([]);
        setSurveyTitle('');
        setValidationError(null);
        alert('Survey created successfully!');
        
        // Refresh parent survey list
        if (onSurveyCreated) {
          onSurveyCreated();
        }
      } else {
        setValidationError(result.error || 'Failed to create survey');
      }
    } catch (error) {
      console.error('Submission error:', error);
      setValidationError(error.message || 'Failed to submit survey');
    }
  };

  return (
    <div style={styles.container}>
      {/* Survey Title Input */}
      <input
        type="text"
        placeholder="Enter Survey Title"
        value={surveyTitle}
        onChange={(e) => setSurveyTitle(e.target.value)}
        style={styles.input}
      />

      {/* Question Type Buttons */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
        <button
          onClick={addMultipleChoiceQuestion}
          style={{ ...styles.button, ...styles.primaryButton }}
        >
          Add Multiple Choice
        </button>
        <button
          onClick={addRatingScaleQuestion}
          style={{ ...styles.button, ...styles.secondaryButton }}
        >
          Add Rating Scale
        </button>
        <button
          onClick={addDropdownQuestion}
          style={{ ...styles.button, ...styles.secondaryButton }}
        >
          Add Dropdown
        </button>
        <button
          onClick={addCheckboxQuestion}
          style={{ ...styles.button, ...styles.secondaryButton }}
        >
          Add Checkbox
        </button>
        <button
          onClick={addConditionalQuestion}
          style={{ ...styles.button, ...styles.secondaryButton }}
        >
          Add Conditional
        </button>
      </div>

      {/* Questions List */}
      <div>
        {questions.map((question, index) => (
          <div key={index} style={styles.questionItem}>
            <div style={styles.questionHeader}>
              <h3>Question {index + 1} ({question.type.replace('-', ' ')})</h3>
              <button 
                onClick={() => removeQuestion(index)}
                style={{ ...styles.button, ...styles.dangerButton }}
              >
                Remove
              </button>
            </div>

            <input
              type="text"
              placeholder="Enter question text"
              value={question.text}
              onChange={(e) => updateQuestion(index, { text: e.target.value })}
              style={styles.input}
            />

            <div style={styles.configSection}>
              {(question.type === 'multiple-choice' || 
                question.type === 'dropdown' || 
                question.type === 'checkbox') && (
                <div>
                  <h4>{question.type === 'checkbox' ? 'Checkbox Options' : 'Options'}</h4>
                  {question.options.map((option, optionIndex) => (
                    <div key={optionIndex} style={styles.optionItem}>
                      <input
                        type="text"
                        placeholder={`Option ${optionIndex + 1}`}
                        value={option}
                        onChange={(e) => updateQuestionOption(index, optionIndex, e.target.value)}
                        style={{ ...styles.input, flex: 1, margin: 0 }}
                      />
                      {question.options.length > 2 && (
                        <button 
                          onClick={() => removeQuestionOption(index, optionIndex)}
                          style={{ ...styles.button, ...styles.dangerButton, padding: '0.3rem 0.6rem' }}
                        >
                          ×
                        </button>
                      )}
                    </div>
                  ))}
                  <button 
                    onClick={() => addQuestionOption(index)}
                    style={{ ...styles.button, ...styles.secondaryButton, marginTop: '0.5rem' }}
                  >
                    + Add Option
                  </button>
                </div>
              )}

              {question.type === 'rating-scale' && (
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <div>
                    <label style={styles.label}>Min Value:</label>
                    <input
                      type="number"
                      value={question.min}
                      onChange={(e) => updateQuestion(index, { min: parseInt(e.target.value) })}
                      style={styles.input}
                    />
                  </div>
                  <div>
                    <label style={styles.label}>Max Value:</label>
                    <input
                      type="number"
                      value={question.max}
                      onChange={(e) => updateQuestion(index, { max: parseInt(e.target.value) })}
                      style={styles.input}
                    />
                  </div>
                </div>
              )}

              {question.type === 'conditional' && (
                <div>
                  <div style={{ marginBottom: '1rem' }}>
                    <label style={styles.label}>Depends On Question:</label>
                    <input
                      type="text"
                      placeholder="Enter the text of the question this depends on"
                      value={question.dependsOn}
                      onChange={(e) => updateConditionalQuestionDependency(index, e.target.value)}
                      style={styles.input}
                    />
                  </div>
                  <div>
                    <label style={styles.label}>Condition:</label>
                    <input
                      type="text"
                      placeholder="Enter the required answer for the above question"
                      value={question.condition}
                      onChange={(e) => updateConditionalQuestionCondition(index, e.target.value)}
                      style={styles.input}
                    />
                  </div>
                </div>
              )}

              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '1rem' }}>
                <input
                  type="checkbox"
                  checked={question.required}
                  onChange={(e) => updateQuestion(index, { required: e.target.checked })}
                />
                Required Question
              </label>
            </div>
          </div>
        ))}
      </div>

      {validationError && (
        <div style={styles.errorMessage}>
          {validationError}
        </div>
      )}

      <button 
        onClick={submitSurvey}
        style={{ 
          ...styles.button, 
          ...styles.primaryButton,
          width: '100%',
          padding: '1rem',
          fontSize: '1.1rem',
          marginTop: '2rem'
        }}
      >
        Save Survey
      </button>
    </div>
  );
};

export default SurveyBuilder;