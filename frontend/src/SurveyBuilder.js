import React, { useState } from 'react';
import { addSurvey } from './firebaseConfig';

const SurveyBuilder = () => {
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

  const submitSurvey = async () => {
    if (!validateSurvey()) return;

    try {
      const result = await addSurvey({
        title: surveyTitle,
        questions,
      });

      if (result.success) {
        // Reset form after successful submission
        setQuestions([]);
        setSurveyTitle('');
        setValidationError(null);
        alert('Survey created successfully!');
      } else {
        setValidationError(result.error);
      }
    } catch (error) {
      console.error('Error submitting survey:', error);
      setValidationError('Failed to submit survey');
    }
  };

  return (
    <div className="survey-builder">
      <h2>Create New Survey</h2>

      {/* Survey Title Input */}
      <input
        type="text"
        placeholder="Enter Survey Title"
        value={surveyTitle}
        onChange={(e) => setSurveyTitle(e.target.value)}
        className="survey-title-input"
      />

      {/* Question Type Buttons */}
      <div className="question-type-buttons">
        <button
          data-testid="add-multiple-choice"
          onClick={addMultipleChoiceQuestion}
        >
          Add Multiple Choice
        </button>
        <button
          data-testid="add-rating-scale"
          onClick={addRatingScaleQuestion}
        >
          Add Rating Scale
        </button>
        <button
          data-testid="add-conditional-question"
          onClick={addConditionalQuestion}
        >
          Add Conditional Question
        </button>
      </div>

      {/* Questions List */}
      <div className="questions-list">
        {questions.map((question, index) => (
          <div key={index} className="question-item">
            <div className="question-header">
              <h3>Question {index + 1} ({question.type})</h3>
              <button onClick={() => removeQuestion(index)} className="remove-question-button">
                Remove
              </button>
            </div>

            <input
              type="text"
              placeholder="Enter question text"
              value={question.text}
              onChange={(e) => updateQuestion(index, { text: e.target.value })}
              className="question-text-input"
            />

            <div className="question-details">
              {question.type === 'multiple-choice' && (
                <div className="multiple-choice-options">
                  <h4>Options:</h4>
                  {question.options.map((option, optionIndex) => (
                    <div key={optionIndex} className="option-item">
                      <input
                        type="text"
                        placeholder={`Option ${optionIndex + 1}`}
                        value={option}
                        onChange={(e) => updateQuestionOption(index, optionIndex, e.target.value)}
                      />
                      {question.options.length > 2 && (
                        <button onClick={() => removeQuestionOption(index, optionIndex)} className="remove-option-button">
                          Remove
                        </button>
                      )}
                    </div>
                  ))}
                  <button onClick={() => addQuestionOption(index)} className="add-option-button">
                    Add Option
                  </button>
                </div>
              )}

              {question.type === 'rating-scale' && (
                <div className="rating-scale-config">
                  <label>
                    Min Value:
                    <input
                      type="number"
                      value={question.min}
                      onChange={(e) => updateQuestion(index, { min: parseInt(e.target.value) })}
                    />
                  </label>
                  <label>
                    Max Value:
                    <input
                      type="number"
                      value={question.max}
                      onChange={(e) => updateQuestion(index, { max: parseInt(e.target.value) })}
                    />
                  </label>
                </div>
              )}

              {question.type === 'conditional' && (
                <div className="conditional-config">
                  <label>
                    Depends On Question:
                    <input
                      type="text"
                      placeholder="Enter the text of the question this depends on"
                      value={question.dependsOn}
                      onChange={(e) => updateConditionalQuestionDependency(index, e.target.value)}
                    />
                  </label>
                  <label>
                    Condition:
                    <input
                      type="text"
                      placeholder="Enter the required answer for the above question"
                      value={question.condition}
                      onChange={(e) => updateConditionalQuestionCondition(index, e.target.value)}
                    />
                  </label>
                </div>
              )}

              <label className="required-checkbox">
                <input
                  type="checkbox"
                  checked={question.required}
                  onChange={(e) => updateQuestion(index, { required: e.target.checked })}
                />
                Required
              </label>
            </div>
          </div>
        ))}
      </div>

      {validationError && <p className="error-message">{validationError}</p>}

      <button onClick={submitSurvey} className="submit-survey-button">
        Save Survey
      </button>
    </div>
  );
};

export default SurveyBuilder;

