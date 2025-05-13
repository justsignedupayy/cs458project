// surveyBuilder.test.js
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import SurveyBuilder from './SurveyBuilder';

describe('SurveyBuilder Component', () => {
  test('renders the component', () => {
    render(<SurveyBuilder />);
    expect(screen.getByText('Create New Survey')).toBeInTheDocument();
  });

  test('adds a multiple choice question when the button is clicked', () => {
    render(<SurveyBuilder />);
    fireEvent.click(screen.getByTestId('add-multiple-choice'));
    expect(screen.getByText('Question 1 (multiple-choice)')).toBeInTheDocument();
  });

  test('adds a rating scale question when the button is clicked', () => {
    render(<SurveyBuilder />);
    fireEvent.click(screen.getByTestId('add-rating-scale'));
    expect(screen.getByText('Question 1 (rating-scale)')).toBeInTheDocument();
  });

  test('adds a conditional question when the button is clicked', () => {
    render(<SurveyBuilder />);
    fireEvent.click(screen.getByTestId('add-conditional-question'));
    expect(screen.getByText('Question 1 (conditional)')).toBeInTheDocument();
  });

  test('removes a question when the remove button is clicked', () => {
    render(<SurveyBuilder />);
    fireEvent.click(screen.getByTestId('add-multiple-choice'));
    expect(screen.getByText('Question 1 (multiple-choice)')).toBeInTheDocument();
    fireEvent.click(screen.getByText('Remove'));
    expect(screen.queryByText('Question 1 (multiple-choice)')).toBeNull();
  });

  test('updates the text of a question', () => {
    render(<SurveyBuilder />);
    fireEvent.click(screen.getByTestId('add-multiple-choice'));
    const questionTextarea = screen.getByPlaceholderText('Enter question text');
    fireEvent.change(questionTextarea, { target: { value: 'New question text' } });
    expect(questionTextarea.value).toBe('New question text');
  });

  test('adds an option to a multiple choice question', () => {
    render(<SurveyBuilder />);
    fireEvent.click(screen.getByTestId('add-multiple-choice'));
    fireEvent.click(screen.getByText('Add Option'));
    const optionInputs = screen.getAllByPlaceholderText(/Option \d+/);
    expect(optionInputs.length).toBe(3);
  });

  test('removes an option from a multiple choice question', () => {
    render(<SurveyBuilder />);
    fireEvent.click(screen.getByTestId('add-multiple-choice'));
    fireEvent.click(screen.getByText('Remove')); // Remove the default second option
    const optionInputs = screen.getAllByPlaceholderText(/Option \d+/);
    expect(optionInputs.length).toBe(1);
    fireEvent.click(screen.getByText('Add Option'));
    fireEvent.click(screen.getByText('Add Option'));
    let optionInputsAfterAdd = screen.getAllByPlaceholderText(/Option \d+/);
    expect(optionInputsAfterAdd.length).toBe(3);
    const removeButtons = screen.getAllByText('Remove');
    fireEvent.click(removeButtons[1]); // Remove the second added option
    optionInputsAfterAdd = screen.getAllByPlaceholderText(/Option \d+/);
    expect(optionInputsAfterAdd.length).toBe(2);
  });

  test('updates an option in a multiple choice question', () => {
    render(<SurveyBuilder />);
    fireEvent.click(screen.getByTestId('add-multiple-choice'));
    const optionInput = screen.getByPlaceholderText('Option 1');
    fireEvent.change(optionInput, { target: { value: 'New option text' } });
    expect(optionInput.value).toBe('New option text');
  });

  test('updates the min value of a rating scale question', () => {
    render(<SurveyBuilder />);
    fireEvent.click(screen.getByTestId('add-rating-scale'));
    const minInput = screen.getByLabelText('Min Value:');
    fireEvent.change(minInput, { target: { value: '2' } });
    expect(minInput.value).toBe('2');
  });

  test('updates the max value of a rating scale question', () => {
    render(<SurveyBuilder />);
    fireEvent.click(screen.getByTestId('add-rating-scale'));
    const maxInput = screen.getByLabelText('Max Value:');
    fireEvent.change(maxInput, { target: { value: '10' } });
    expect(maxInput.value).toBe('10');
  });

  test('updates the dependency of a conditional question', () => {
    render(<SurveyBuilder />);
    fireEvent.click(screen.getByTestId('add-conditional-question'));
    const dependsOnInput = screen.getByPlaceholderText('Enter the text of the question this depends on');
    fireEvent.change(dependsOnInput, { target: { value: 'Previous Question' } });
    expect(dependsOnInput.value).toBe('Previous Question');
  });

  test('updates the condition of a conditional question', () => {
    render(<SurveyBuilder />);
    fireEvent.click(screen.getByTestId('add-conditional-question'));
    const conditionInput = screen.getByPlaceholderText('Enter the required answer for the above question');
    fireEvent.change(conditionInput, { target: { value: 'Yes' } });
    expect(conditionInput.value).toBe('Yes');
  });

  test('marks a question as required', () => {
    render(<SurveyBuilder />);
    fireEvent.click(screen.getByTestId('add-multiple-choice'));
    const requiredCheckbox = screen.getByLabelText('Required');
    fireEvent.click(requiredCheckbox);
    expect(requiredCheckbox.checked).toBe(true);
  });

  test('shows validation error if survey title is missing on submit', async () => {
    render(<SurveyBuilder />);
    fireEvent.click(screen.getByText('Save Survey'));
    expect(await screen.findByText('Survey must have a title')).toBeInTheDocument();
  });

  test('shows validation error if required questions are missing text on submit', async () => {
    render(<SurveyBuilder />);
    fireEvent.click(screen.getByTestId('add-multiple-choice'));
    const requiredCheckbox = screen.getByLabelText('Required');
    fireEvent.click(requiredCheckbox);
    fireEvent.change(screen.getByPlaceholderText('Enter Survey Title'), { target: { value: 'Test Survey' } });
    fireEvent.click(screen.getByText('Save Survey'));
    expect(await screen.findByText('Please fill in all required questions')).toBeInTheDocument();
  });

  // Mocking firebaseConfig for submitSurvey function is more complex and might be done in integration tests.
  // Here we can at least test the validation logic.
});