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
}

const Questions = forwardRef<QuestionsRef, QuestionsProps>(({ jobId, applicantId }, ref) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<{ [key: number]: string | string[] }>({});
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState<{ [key: number]: string }>({});

  useEffect(() => {
    const fetchQuestions = async () => {
      if (!jobId || !applicantId) return;
      try {
        const response = await getQuestions(jobId, applicantId);
        console.log(response);

        if (response.status) {
          setQuestions(response.data);
        }
      } catch (error) {
        console.error('Error fetching questions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [jobId, applicantId]);

  const handleAnswerChange = (questionId: number, value: string | string[]) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
    // Clear error when user starts answering
    if (errors[questionId]) {
      setErrors(prev => ({ ...prev, [questionId]: '' }));
    }
  };

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
    } catch (error) {
      console.error('Error saving answers:', error);
      throw error;
    }
  };

  useImperativeHandle(ref, () => ({
    validate,
    saveAnswers
  }));

  const renderQuestion = (question: Question) => {
    const answer = answers[question.id] || '';
    const error = errors[question.id];

    switch (question.answer_type) {
      case 'short':
        return (
          <Input
            className={`mt-[8px] h-[48px] ${error ? 'border-red-500' : ''}`}
            placeholder="Enter your answer"
            value={answer as string}
            onChange={(e) => handleAnswerChange(question.id, e.target.value)}
          />
        );

      case 'long_detail':
        return (
          <Textarea
            className={`mt-[8px] h-[153px] ${error ? 'border-red-500' : ''}`}
            placeholder="Enter your detailed answer"
            value={answer as string}
            onChange={(e) => handleAnswerChange(question.id, e.target.value)}
          />
        );

      case 'dropdown':
        return (
          <Select
            value={answer as string}
            onValueChange={(value) => handleAnswerChange(question.id, value)}
          >
            <SelectTrigger className={`w-full h-[48px] mt-[8px] ${error ? 'border-red-500' : ''}`}>
              <SelectValue placeholder="Select an option" />
            </SelectTrigger>
            <SelectContent>
              {question.options?.map((option, index) => (
                <SelectItem key={index} value={option}>
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
                  id={`${question.id}-${index}`}
                  checked={Array.isArray(answer) && answer.includes(option)}
                  onCheckedChange={(checked) => {
                    const currentAnswers = Array.isArray(answer) ? answer : [];
                    const newAnswers = checked
                      ? [...currentAnswers, option]
                      : currentAnswers.filter(a => a !== option);
                    handleAnswerChange(question.id, newAnswers);
                  }}
                />
                <Label htmlFor={`${question.id}-${index}`}>{option}</Label>
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
                handleAnswerChange(question.id, file.name);
              }
            }}
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
        <div key={question.id} className="mt-[16px]">
          <p className='text-[14px]/[22px] text-[#353535] font-medium'>
            {question.question_name}
            {question.is_required && <span className="text-red-500 ml-1">*</span>}
          </p>
          {renderQuestion(question)}
          {errors[question.id] && (
            <p className="text-red-500 text-sm mt-1">{errors[question.id]}</p>
          )}
        </div>
      ))}
    </div>
  );
});

Questions.displayName = 'Questions';

export default Questions;
