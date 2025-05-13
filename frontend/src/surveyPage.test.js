// surveyPage.test.js
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SurveyPage from './SurveyPage';
import { getSurveys, addDoc, collection } from './firebaseConfig';

// Mock firebaseConfig functions
jest.mock('./firebaseConfig', () => ({
  ...jest.requireActual('./firebaseConfig'), // Import other functions
  getSurveys: jest.fn(),
  addDoc: jest.fn(),
  collection: jest.fn(() => ({})), // Mock collection if needed
  db: {} // Mock db object if needed
}));

const mockUser = {
  uid: 'testUserId',
  displayName: 'Test User',
  email: 'test@example.com'
};

const mockSurveys = [
  { id: '1', title: 'Survey A', questions: [{ type: 'multiple-choice', text: 'Question 1', options: ['Yes', 'No'], required: true }] },
  { id: '2', title: 'Survey B', questions: [{ type: 'rating-scale', text: 'Question 2', min: 1, max: 5 }] },
];

describe('SurveyPage Component', () => {
  beforeEach(() => {
    getSurveys.mockResolvedValue({ success: true, surveys: mockSurveys });
    addDoc.mockResolvedValue({ id: 'responseId' });
  });

  test('renders loading state initially', () => {
    getSurveys.mockResolvedValue(new Promise(() => {})); // Simulate loading
    render(<SurveyPage user={mockUser} />);
    expect(screen.getByText('Loading surveys...')).toBeInTheDocument();
  });

  test('renders error message if fetching surveys fails', async () => {
    getSurveys.mockResolvedValue({ success: false, error: 'Failed to fetch' });
    render(<SurveyPage user={mockUser} />);
    await waitFor(() => {
      expect(screen.getByText('Error')).toBeInTheDocument();
      expect(screen.getByText('Failed to fetch')).toBeInTheDocument();
    });
  });

  test('renders available surveys', async () => {
    render(<SurveyPage user={mockUser} />);
    await waitFor(() => {
      expect(screen.getByText('Available Surveys')).toBeInTheDocument();
      expect(screen.getByText('Survey A')).toBeInTheDocument();
      expect(screen.getByText('Survey B')).toBeInTheDocument();
    });
  });

  test('updates selectedSurvey state when a survey is selected', async () => {
    render(<SurveyPage user={mockUser} />);
    await waitFor(() => {
      fireEvent.click(screen.getByText('Survey A'));
      expect(screen.getByText('Take Survey: Survey A')).toBeInTheDocument();
    });
  });

  test('renders multiple choice question for the selected survey', async () => {
    render(<SurveyPage user={mockUser} />);
    await waitFor(() => {
      fireEvent.click(screen.getByText('Survey A'));
      expect(screen.getByText('Question 1')).toBeInTheDocument();
      expect(screen.getByLabelText('Yes')).toBeInTheDocument();
      expect(screen.getByLabelText('No')).toBeInTheDocument();
    });
  });

  test('renders rating scale question for the selected survey', async () => {
    render(<SurveyPage user={mockUser} />);
    await waitFor(() => {
      fireEvent.click(screen.getByText('Survey B'));
      expect(screen.getByText('Question 2')).toBeInTheDocument();
      expect(screen.getByRole('slider', { min: '1', max: '5' })).toBeInTheDocument();
    });
  });

  test('handles response change for multiple choice question', async () => {
    render(<SurveyPage user={mockUser} />);
    await waitFor(() => {
      fireEvent.click(screen.getByText('Survey A'));
      fireEvent.click(screen.getByLabelText('Yes'));
      expect(screen.getByLabelText('Yes').checked).toBe(true);
    });
  });

  test('handles response change for rating scale question', async () => {
    render(<SurveyPage user={mockUser} />);
    await waitFor(() => {
      fireEvent.click(screen.getByText('Survey B'));
      const slider = screen.getByRole('slider');
      fireEvent.change(slider, { target: { value: '3' } });
      expect(slider.value).toBe('3');
      expect(screen.getByText('Rating: 3')).toBeInTheDocument();
    });
  });

  test('shows submission error if required questions are not answered', async () => {
    render(<SurveyPage user={mockUser} />);
    await waitFor(() => {
      fireEvent.click(screen.getByText('Survey A'));
      fireEvent.click(screen.getByText('Submit Survey'));
      expect(screen.getByText('Please answer all required questions.')).toBeInTheDocument();
    });
  });

  test('submits survey response successfully', async () => {
    render(<SurveyPage user={mockUser} />);
    await waitFor(() => {
      fireEvent.click(screen.getByText('Survey A'));
      fireEvent.click(screen.getByLabelText('Yes'));
      fireEvent.click(screen.getByText('Submit Survey'));
      expect(addDoc).toHaveBeenCalledTimes(1);
      expect(screen.getByText('Survey submitted successfully!')).toBeInTheDocument();
      expect(screen.queryByText('Take Survey: Survey A')).toBeNull(); // Survey is unselected
    });
  });

  test('shows error if survey submission fails', async () => {
    addDoc.mockRejectedValue(new Error('Submission failed'));
    render(<SurveyPage user={mockUser} />);
    await waitFor(() => {
      fireEvent.click(screen.getByText('Survey A'));
      fireEvent.click(screen.getByLabelText('Yes'));
      fireEvent.click(screen.getByText('Submit Survey'));
      expect(addDoc).toHaveBeenCalledTimes(1);
      expect(screen.getByText('Failed to submit survey: Submission failed')).toBeInTheDocument();
    });
  });

  test('renders conditional question when the condition is met', async () => {
    const mockSurveysWithConditional = [
      {
        id: '3',
        title: 'Conditional Survey',
        questions: [
          { type: 'multiple-choice', text: 'Do you like ice cream?', options: ['Yes', 'No'] },
          { type: 'conditional', text: 'What is your favorite flavor?', dependsOn: 'Do you like ice cream?', condition: 'Yes', required: true },
        ],
      },
    ];
    getSurveys.mockResolvedValue({ success: true, surveys: mockSurveysWithConditional });
    render(<SurveyPage user={mockUser} />);
    await waitFor(() => {
      fireEvent.click(screen.getByText('Conditional Survey'));
      expect(screen.getByText('Do you like ice cream?')).toBeInTheDocument();
      expect(screen.queryByText('What is your favorite flavor?')).toBeNull(); // Initially hidden
      fireEvent.click(screen.getByLabelText('Yes'));
      expect(screen.getByText('What is your favorite flavor?')).toBeInTheDocument();
      fireEvent.click(screen.getByLabelText('No'));
      expect(screen.queryByText('What is your favorite flavor?')).toBeNull(); // Hidden again
    });
  });

  test('does not render conditional question if the dependency question is not found', async () => {
    const mockSurveysWithInvalidConditional = [
      {
        id: '4',
        title: 'Invalid Conditional Survey',
        questions: [
          { type: 'conditional', text: 'This should not show', dependsOn: 'NonExistent Question', condition: 'Yes' },
        ],
      },
    ];
    getSurveys.mockResolvedValue({ success: true, surveys: mockSurveysWithInvalidConditional });
    render(<SurveyPage user={mockUser} />);
    await waitFor(() => {
      fireEvent.click(screen.getByText('Invalid Conditional Survey'));
      expect(screen.queryByText('This should not show')).toBeNull();
    });
  });
});