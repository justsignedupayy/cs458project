import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  getSurveys,
  addDoc,
  collection,
  db,
  deleteSurvey
} from './firebaseConfig';
import SurveyBuilder from './SurveyBuilder';

const styles = {
  container: {
    maxWidth: '1000px',
    margin: '2rem auto',
    padding: '0 1rem',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    position: 'relative',
  },
  header: {
    color: '#2c3e50',
    textAlign: 'center',
    marginBottom: '2rem',
  },
  userInfo: {
    backgroundColor: '#f8f9fa',
    padding: '1rem',
    borderRadius: '8px',
    marginBottom: '2rem',
    textAlign: 'center',
  },
  surveyGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
    gap: '1rem',
    margin: '2rem 0',
  },
  surveyCard: {
    backgroundColor: 'white',
    borderRadius: '8px',
    padding: '1.5rem',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    cursor: 'pointer',
    transition: 'transform 0.2s ease',
    position: 'relative',
  },
  selectedSurvey: {
    backgroundColor: 'white',
    borderRadius: '8px',
    padding: '2rem',
    margin: '2rem 0',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
  },
  questionCard: {
    backgroundColor: '#fff',
    borderRadius: '8px',
    padding: '1.5rem',
    margin: '1rem 0',
    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
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
  },
  errorMessage: {
    color: '#e74c3c',
    backgroundColor: '#f8d7da',
    padding: '1rem',
    borderRadius: '4px',
    margin: '1rem 0',
  },
  loadingText: {
    textAlign: 'center',
    color: '#95a5a6',
    fontSize: '1.2rem',
  },
  required: {
    color: '#e74c3c',
    marginLeft: '0.3rem',
  },
  slider: {
    width: '100%',
    margin: '1rem 0',
  },
  radioOption: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    margin: '0.5rem 0',
  },
    checkboxOption: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    margin: '0.5rem 0',
  },
  dashboardButton: {
    position: 'absolute',
    top: '1rem',
    left: '1rem',
    padding: '0.6rem 1.2rem',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    backgroundColor: '#2c3e50',
    color: 'white',
  },
  deleteButton: {
    position: 'absolute',
    top: '0.5rem',
    right: '0.5rem',
    backgroundColor: 'transparent',
    border: 'none',
    color: '#e74c3c',
    cursor: 'pointer',
    fontSize: '1.2rem',
    padding: '0.2rem',
  }
};


const SurveyPage = ({ user }) => {
  const navigate = useNavigate();
  const [surveys, setSurveys] = useState([]);
  const [selectedSurvey, setSelectedSurvey] = useState(null);
  const [responses, setResponses] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submissionError, setSubmissionError] = useState(null);

  useEffect(() => {
    const fetchSurveys = async () => {
      try {
        setLoading(true);
        if (!user) throw new Error("User not authenticated");
        
        const result = await getSurveys(user.uid);  // Pass user UID
        result.success ? setSurveys(result.surveys) : setError(result.error);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchSurveys();
  }, [user]);

  // Handle response input
  const handleResponseChange = (questionIndex, value) => {
    setResponses({
      ...responses,
      [questionIndex]: value
    });
  };

    const handleCheckboxResponseChange = (questionIndex, option, isChecked) => {
    const currentResponses = responses[questionIndex] || [];
    let updatedResponses;

    if (isChecked) {
      updatedResponses = [...currentResponses, option];
    } else {
      updatedResponses = currentResponses.filter(item => item !== option);
    }

    setResponses({
      ...responses,
      [questionIndex]: updatedResponses
    });
  };

  const handleDeleteSurvey = async (surveyId, e) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this survey?')) {
      try {
        await deleteSurvey(surveyId);
        setSurveys(surveys.filter(s => s.id !== surveyId));
        if (selectedSurvey?.id === surveyId) setSelectedSurvey(null);
      } catch (error) {
        setError('Failed to delete survey');
      }
    }
  };

  // Handle survey selection
  const handleSelectSurvey = (survey) => {
    setSelectedSurvey(survey);
    setResponses({}); // Clear previous responses when a new survey is selected
    setSubmissionError(null);
  };

  // Render survey questions
  const renderSurveyQuestions = () => {
    if (!selectedSurvey) return null;

    return selectedSurvey.questions.map((question, index) => {
      switch (question.type) {
        case 'multiple-choice':
          return (
            <div key={index} className="survey-question">
              <p>{question.text} {question.required && <span className="required">*</span>}</p>
              {question.options.map((option, optIndex) => (
                <label key={optIndex} style={styles.radioOption}>
                  <input
                    type="radio"
                    name={`question-${index}`}
                    value={option}
                    checked={responses[index] === option}
                    onChange={() => handleResponseChange(index, option)}
                    required={question.required}
                  />
                  {option}
                </label>
              ))}
            </div>
          );

        case 'rating-scale':
          return (
            <div key={index} className="survey-question">
              <p>{question.text} {question.required && <span className="required">*</span>}</p>
              <input
                type="range"
                min={question.min || 1}
                max={question.max || 5}
                value={responses[index] || question.min || 1}
                onChange={(e) => handleResponseChange(index, e.target.value)}
                required={question.required}
                style={styles.slider}
              />
              <span>Rating: {responses[index] || question.min || 1}</span>
            </div>
          );

        case 'conditional':
          const dependsOnQuestion = selectedSurvey.questions.find(q => q.text === question.dependsOn);
          const dependsOnIndex = dependsOnQuestion ? selectedSurvey.questions.indexOf(dependsOnQuestion) : -1;
          const shouldShowQuestion = dependsOnIndex !== -1 && responses[dependsOnIndex] === question.condition;

          if (!shouldShowQuestion) return null;

          return (
            <div key={index} className="survey-question">
              <p>{question.text} {question.required && <span className="required">*</span>}</p>
              <input
                type="text"
                value={responses[index] || ''}
                onChange={(e) => handleResponseChange(index, e.target.value)}
                required={question.required}
                style={styles.input}
              />
            </div>
          );

          case 'open-text':
            return (
              <div key={index} className="survey-question">
                <p>{question.text} {question.required && <span className="required">*</span>}</p>
                <textarea
                  value={responses[index] || ''}
                  onChange={(e) => handleResponseChange(index, e.target.value)}
                  required={question.required}
                  style={{ ...styles.input, resize: 'vertical' }}
                />
              </div>
            );

        case 'dropdown':
          return (
            <div key={index} className="survey-question">
              <p>{question.text} {question.required && <span className="required">*</span>}</p>
              <select
                value={responses[index] || ''}
                onChange={(e) => handleResponseChange(index, e.target.value)}
                required={question.required}
                style={styles.input}
              >
                <option value="" disabled>Select an option</option>
                {question.options.map((option, optIndex) => (
                  <option key={optIndex} value={option}>{option}</option>
                ))}
              </select>
            </div>
          );

          case 'checkbox':
            return (
              <div key={index} className="survey-question">
                <p>{question.text} {question.required && <span className="required">*</span>}</p>
                {question.options.map((option, optIndex) => (
                  <label key={optIndex} style={styles.checkboxOption}>
                    <input
                      type="checkbox"
                      name={`question-${index}-option-${optIndex}`}
                      value={option}
                      checked={responses[index]?.includes(option) || false}
                      onChange={(e) => handleCheckboxResponseChange(index, option, e.target.checked)}
                      required={question.required}
                    />
                    {option}
                  </label>
                ))}
              </div>
            );


        default:
          return null;
      }
    });
  };

  // Submit survey responses
  const submitSurveyResponse = async () => {
    if (!selectedSurvey) {
      setSubmissionError("Please select a survey to submit.");
      return;
    }

    // Validate required questions
    const requiredQuestions = selectedSurvey.questions.filter(q => q.required);
    const allRequiredAnswered = requiredQuestions.every((question, index) => {
      const responseKey = selectedSurvey.questions.findIndex(q => q === question);
      if (question.type === 'checkbox') {
        return responses.hasOwnProperty(responseKey) && responses[responseKey] && responses[responseKey].length > 0;
      }
      return responses.hasOwnProperty(responseKey) && responses[responseKey] !== undefined && responses[responseKey] !== '';
    });

    if (!allRequiredAnswered) {
      setSubmissionError("Please answer all required questions.");
      return;
    }

    setSubmissionError(null);

    try {
      if (!user) {
        throw new Error("User not authenticated");
      }

      // Add response submission logic to Firestore
      await addDoc(collection(db, 'survey-responses'), {
        surveyId: selectedSurvey.id,
        userId: user.uid,
        responses,
        submittedAt: new Date()
      });

      alert('Survey submitted successfully!');
      // Reset form
      setResponses({});
      setSelectedSurvey(null);
    } catch (error) {
      console.error('Error submitting survey:', error);
      setSubmissionError(`Failed to submit survey: ${error.message}`);
    }
  };

  if (loading) {
    return <div style={styles.loadingText}>Loading surveys...</div>;
  }

  if (error) {
    return (
      <div style={styles.container}>
        <div style={styles.errorMessage}>
          <h2>Error</h2>
          <p>{error}</p>
          <p>Please ensure you are logged in and have the necessary permissions.</p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>Survey Management</h1>

      <div style={styles.userInfo}>
        <h2>Welcome, {user.displayName || user.email}</h2>
      </div>

      <div>
        <h2 style={{ marginBottom: '1rem' }}>Available Surveys</h2>
        <div style={styles.surveyGrid}>
          {surveys.length === 0 ? (
            <p style={{ textAlign: 'center' }}>No surveys available. Create a new survey below!</p>
          ) : (
            surveys.map((survey) => (
              <div
                key={survey.id}
                style={{
                  ...styles.surveyCard,
                  border: selectedSurvey?.id === survey.id ? '2px solid #3498db' : 'none'
                }}
                onClick={() => handleSelectSurvey(survey)}
              >
                <button
                  style={styles.deleteButton}
                  onClick={(e) => handleDeleteSurvey(survey.id, e)}
                  title="Delete survey"
                >
                  ×
                </button>
                <h3>{survey.title}</h3>
                <p style={{ color: '#95a5a6' }}>
                  {survey.questions.length} questions
                </p>
              </div>
            ))
          )}
        </div>
      </div>

      <div style={{ margin: '3rem 0' }}>
        <h2 style={{ marginBottom: '1rem' }}>Create New Survey</h2>
        <SurveyBuilder 
  user={user}
  onSurveyCreated={() => {
    // Refresh surveys after creation
    getSurveys(user.uid).then(result => {
      if (result.success) setSurveys(result.surveys);
    });
  }}
/>
      </div>

      {selectedSurvey && (
        <div style={styles.selectedSurvey}>
          <h2 style={{ marginBottom: '1.5rem' }}>Take Survey: {selectedSurvey.title}</h2>
          {renderSurveyQuestions()}
          {submissionError && <div style={styles.errorMessage}>{submissionError}</div>}
          <button
            onClick={submitSurveyResponse}
            style={{
              ...styles.button,
              ...styles.primaryButton,
              padding: '1rem 2rem',
              fontSize: '1.1rem',
              width: '100%',
              marginTop: '2rem'
            }}
          >
            Submit Survey
          </button>
        </div>
      )}
    </div>
  );
};

export default SurveyPage;