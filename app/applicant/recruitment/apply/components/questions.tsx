'use client';

import React, { useEffect, useState, forwardRef, useImperativeHandle } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { getQuestions, updateQuestionAnswer } from '@/api/applicant';
import { Label } from '@/components/ui/label';
import { customToast } from '@/components/common/toastr';

/**
 * @description
 * Questions is a dynamic form component that fetches and displays a set of questions for a job applicant.
 * It handles different question types (short answer, long detail, dropdown, checkbox, and file upload) and manages the state of the applicant's answers.
 * The component includes validation for required fields and exposes `validate` and `saveAnswers` functions to the parent component via a forwarded ref, allowing for external control over form submission.
 * It uses unique `data-testid` and `id` attributes for UI elements to support test automation.
 */
interface Question {
  id: number;
  question_name: string;
  answer_type: 'short' | 'long_detail' | 'dropdown' | 'checkbox' | 'file_upload';
  options: string[] | null;
  is_required: boolean;
  correct_answer: string | null;
  tags: string[];
  created_at: string;
  updated_at: string;
  applicant_answer: string | null;
}

export interface QuestionsRef {
  validate: () => boolean;
  saveAnswers: () => Promise<void>;
}

interface QuestionsProps {
  jobId: string | null;
  applicantId: string | null;
  setLoading?: (loading: boolean) => void;
}

const Questions = forwardRef<QuestionsRef, QuestionsProps>(({ jobId, applicantId }, ref) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<{ [key: number]: string | string[] }>({});
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState<{ [key: number]: string }>({});

  /**
   * @description
   * Fetches questions from the API when the component mounts or when `jobId` or `applicantId` changes.
   * It updates the local state with the fetched questions and sets `loading` to false.
   */
  useEffect(() => {
    const fetchQuestions = async () => {
      if (!jobId || !applicantId) return;
      try {
        setLoading(true);
        const response = await getQuestions(jobId, applicantId);
        console.log(response);

        if (response.status) {
          setQuestions(response.data);
          // Pre-populate answers if they exist
          const initialAnswers: { [key: number]: string | string[] } = {};
          response.data.forEach((question: Question) => {
            if (question.applicant_answer) {
              try {
                // Parse the escaped JSON string

                const finalAnswer = question.applicant_answer.split('\"')[1]
                if (question.answer_type === 'checkbox') {
                  initialAnswers[question.id] = finalAnswer.split(',').map((s: string) => s.trim());
                } else {
                  initialAnswers[question.id] = finalAnswer;
                }
              } catch (error) {
                console.error('Error parsing applicant answer:', error);
                // Fallback to original logic
                if (question.answer_type === 'checkbox') {
                  initialAnswers[question.id] = question.applicant_answer.split(',').map((s: string) => s.trim());
                } else {
                  initialAnswers[question.id] = question.applicant_answer;
                }
              }

              console.log(initialAnswers);

            }
          });
          setAnswers(initialAnswers);
        }
        setLoading(false);
      } catch (error: any) {
        customToast('Error fetching questions', error?.response?.data?.message as string, 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [jobId, applicantId]);

  /**
   * @description
   * Handles changes to an answer for a specific question.
   * It updates the local `answers` state and clears any validation errors for that question.
   * @param {number} questionId - The ID of the question being answered.
   * @param {string | string[]} value - The new value of the answer.
   */
  const handleAnswerChange = (questionId: number, value: string | string[], answerType: string) => {
    if (answerType === 'short') {
      if (value.length > 500) {
        setErrors(prev => ({ ...prev, [questionId]: 'Answer cannot exceed 500 characters' }));
        return
      }
    }
    if (answerType === 'long_detail') {
      if (value.length > 5000) {
        setErrors(prev => ({ ...prev, [questionId]: 'Answer cannot exceed 5000 characters' }));
        return
      }
    }
    setAnswers(prev => ({ ...prev, [questionId]: value }));
    if (errors[questionId]) {
      setErrors(prev => ({ ...prev, [questionId]: '' }));
    }
  };

  /**
   * @description
   * Validates all required questions to ensure they have been answered.
   * It updates the `errors` state with any validation failures and returns a boolean indicating overall form validity.
   * @returns {boolean} - True if all required questions are answered, otherwise false.
   */
  const validate = (): boolean => {
    const newErrors: { [key: number]: string } = {};
    let isValid = true;

    questions.forEach(question => {
      if (question.is_required) {
        const answer = answers[question.id];
        if (!answer || (Array.isArray(answer) && answer.length === 0) || (typeof answer === 'string' && answer.trim() === '')) {
          newErrors[question.id] = 'This question is required';
          isValid = false;
        }
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  /**
   * @description
   * Saves all applicant answers to the backend API.
   * It iterates through the `answers` state and sends each answer to the `updateQuestionAnswer` API endpoint.
   * @returns {Promise<void>} A promise that resolves when all answers are saved or rejects on error.
   */
  const saveAnswers = async () => {
    if (!jobId || !applicantId) throw new Error('Missing job or applicant ID');

    try {
      for (const question of questions) {
        const answer = answers[question.id];
        if (answer) {
          const payload = {
            job_id: Number(jobId),
            applicant_id: Number(applicantId),
            question_id: question.id,
            answer: Array.isArray(answer) ? answer.join(', ') : answer,
          };
          await updateQuestionAnswer(payload);
        }
      }
    } catch (error: any) {
      customToast('Error saving answers', error?.response?.data?.message as string, 'error');
      throw error;
    }
  };

  /**
   * @description
   * Exposes `validate` and `saveAnswers` functions to the parent component via a forwarded ref.
   */
  useImperativeHandle(ref, () => ({
    validate,
    saveAnswers
  }));

  /**
   * @description
   * Renders the appropriate UI element for a given question based on its `answer_type`.
   * @param {Question} question - The question object to render.
   * @returns {JSX.Element} The JSX for the question's input field.
   */
  const renderQuestion = (question: Question) => {
    const answer = answers[question.id] || (question.answer_type === 'checkbox' ? [] : '');
    const error = errors[question.id];

    switch (question.answer_type) {
      case 'short':
        return (
          <>
            <Input
              className={`mt-[8px] h-[48px] ${error ? 'border-red-500' : ''}`}
              placeholder="Enter your answer"
              value={answer as string}
              onChange={(e) => handleAnswerChange(question.id, e.target.value, question.answer_type)}
              data-testid={`question-input-${question.id}`}
              id={`question-input-${question.id}`}
            />
            <p className="text-[12px] text-right">{answer.length} / 500</p>
          </>
        );

      case 'long_detail':
        return (
          <>
            <Textarea
              className={`mt-[8px] h-[153px] ${error ? 'border-red-500' : ''}`}
              placeholder="Enter your detailed answer"
              value={answer as string}
              onChange={(e) => handleAnswerChange(question.id, e.target.value, question.answer_type)}
              data-testid={`question-textarea-${question.id}`}
              id={`question-textarea-${question.id}`}
            />
            <p className="text-[12px] text-right">{answer.length} / 5000</p>
          </>
        );

      case 'dropdown':
        return (
          <Select
            value={answer as string}
            onValueChange={(value) => handleAnswerChange(question.id, value, question.answer_type)}
          >
            <SelectTrigger
              className={`w-full h-[48px] mt-[8px] ${error ? 'border-red-500' : ''}`}
              data-testid={`question-dropdown-trigger-${question.id}`}
              id={`question-dropdown-trigger-${question.id}`}
            >
              <SelectValue placeholder="Select an option" />
            </SelectTrigger>
            <SelectContent data-testid={`question-dropdown-content-${question.id}`}>
              {question.options?.map((option, index) => (
                <SelectItem
                  key={index}
                  value={option}
                  data-testid={`question-dropdown-item-${question.id}-${index}`}
                  id={`question-dropdown-item-${question.id}-${index}`}
                >
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      case 'checkbox':
        return (
          <div className="mt-[8px] space-y-2">
            {question.options?.map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <Checkbox
                  id={`checkbox-${question.id}-${index}`}
                  checked={Array.isArray(answer) && answer.includes(option)}
                  onCheckedChange={(checked) => {
                    const currentAnswers = Array.isArray(answer) ? answer : [];
                    const newAnswers = checked
                      ? [...currentAnswers, option]
                      : currentAnswers.filter(a => a !== option);
                    handleAnswerChange(question.id, newAnswers, question.answer_type);
                  }}
                  data-testid={`question-checkbox-${question.id}-${index}`}
                />
                <Label htmlFor={`checkbox-${question.id}-${index}`}>{option}</Label>
              </div>
            ))}
          </div>
        );

      case 'file_upload':
        return (
          <Input
            type="file"
            className={`mt-[8px] h-[48px] ${error ? 'border-red-500' : ''}`}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                handleAnswerChange(question.id, file.name, question.answer_type);
              }
            }}
            data-testid={`question-file-upload-${question.id}`}
            id={`question-file-upload-${question.id}`}
          />
        );

      default:
        return <div>Unsupported question type</div>;
    }
  };

  if (loading) {
    return (
      <div>
        <p className="font-medium text-[22px]/[30px]">Applicant Questions</p>
        <p className="mt-[8px] text-[14px]/[13px] text-[#787878]">Loading questions...</p>
      </div>
    );
  }

  return (
    <div>
      <p className="font-medium text-[22px]/[30px]">Applicant Questions</p>
      <p className="mt-[8px] text-[14px]/[13px] text-[#787878]">Please answer the following questions</p>

      {questions.map((question) => (
        <div key={question.id} className="mt-[16px]" data-testid={`question-container-${question.id}`}>
          <p className='text-[14px]/[22px] text-[#353535] font-medium'>
            {question.question_name}
            {question.is_required && <span className="text-red-500 ml-1">*</span>}
          </p>
          {renderQuestion(question)}
          {errors[question.id] && (
            <p className="text-red-500 text-sm mt-1" data-testid={`question-error-${question.id}`}>{errors[question.id]}</p>
          )}
        </div>
      ))}
    </div>
  );
});

Questions.displayName = 'Questions';

export default Questions;
