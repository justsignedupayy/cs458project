import React, { useState, useEffect } from 'react';
import {
  getSurveys,
  addDoc,
  collection,
  db
} from './firebaseConfig';
import SurveyBuilder from './SurveyBuilder';

const SurveyPage = ({ user }) => {
  const [surveys, setSurveys] = useState([]);
  const [selectedSurvey, setSelectedSurvey] = useState(null);
  const [responses, setResponses] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submissionError, setSubmissionError] = useState(null);

  // Fetch existing surveys
  useEffect(() => {
    const fetchSurveys = async () => {
      try {
        setLoading(true);

        // Ensure user is authenticated
        if (!user) {
          throw new Error("User not authenticated");
        }

        const result = await getSurveys();

        if (result.success) {
          setSurveys(result.surveys);
          setError(null);
        } else {
          setError(result.error);
        }
      } catch (err) {
        setError(err.message || 'Failed to fetch surveys');
        console.error('Survey fetch error:', err);
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
                <label key={optIndex}>
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
              />
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
    return <div>Loading surveys...</div>;
  }

  if (error) {
    return (
      <div className="error-container">
        <h2>Error</h2>
        <p>{error}</p>
        <p>Please ensure you are logged in and have the necessary permissions.</p>
      </div>
    );
  }

  return (
    <div className="survey-page">
      <h1>Survey Management</h1>

      {/* User Information */}
      <div className="user-info">
        <h2>Welcome, {user.displayName || user.email}</h2>
      </div>

      {/* Survey Selection */}
      <div className="survey-selection">
        <h2>Available Surveys</h2>
        {surveys.length === 0 ? (
          <p>No surveys available. Create a new survey below!</p>
        ) : (
          surveys.map((survey) => (
            <button
              key={survey.id}
              onClick={() => handleSelectSurvey(survey)}
              className="survey-select-button"
            >
              {survey.title}
            </button>
          ))
        )}
      </div>

      {/* Survey Builder Component */}
      <SurveyBuilder />

      {/* Selected Survey Rendering */}
      {selectedSurvey && (
        <div className="selected-survey">
          <h2>Take Survey: {selectedSurvey.title}</h2>
          {renderSurveyQuestions()}
          {submissionError && <p className="error-message">{submissionError}</p>}
          <button
            onClick={submitSurveyResponse}
            className="submit-survey-button"
          >
            Submit Survey
          </button>
        </div>
      )}
    </div>
  );
};

export default SurveyPage;