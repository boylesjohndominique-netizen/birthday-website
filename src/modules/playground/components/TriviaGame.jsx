import { useState } from 'react';
import { CheckCircle2, XCircle, Brain } from 'lucide-react';
import { Card } from '../../../components/ui/Card.jsx';
import { Button } from '../../../components/ui/Button.jsx';
import { useAsync } from '../../../hooks/useAsync.js';
import { getTriviaQuestions, saveGameResult } from '../PlaygroundService.js';
import { SkeletonLines } from '../../../components/ui/Skeleton.jsx';

const PASS_THRESHOLD = 0.6;

export function TriviaGame({ onUnlock }) {
  const { data: questions, isLoading } = useAsync(() => getTriviaQuestions(), []);
  const [step, setStep] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState(null);
  const [done, setDone] = useState(false);

  if (isLoading) return <SkeletonLines count={4} />;
  if (!questions?.length) return null;

  const q = questions[step];
  const isLast = step === questions.length - 1;

  async function handleAnswer(i) {
    if (selected !== null) return;
    setSelected(i);
    const correct = i === q.answer_index;
    const nextScore = correct ? score + 1 : score;
    setScore(nextScore);

    setTimeout(async () => {
      if (isLast) {
        const passed = nextScore / questions.length >= PASS_THRESHOLD;
        await saveGameResult('trivia', { score: nextScore, unlocked: passed });
        setDone(true);
        if (passed) onUnlock?.('trivia');
      } else {
        setStep((s) => s + 1);
        setSelected(null);
      }
    }, 700);
  }

  if (done) {
    const passed = score / questions.length >= PASS_THRESHOLD;
    return (
      <Card className="text-center space-y-2">
        <Brain size={24} className="mx-auto text-crimson-500" aria-hidden="true" />
        <p className="font-display text-xl text-oxblood-700">
          {score} / {questions.length} correct
        </p>
        <p className="text-sm text-charcoal-light">
          {passed ? 'You know me so well. Unlocked a reward!' : 'Close! Try again anytime.'}
        </p>
      </Card>
    );
  }

  return (
    <Card>
      <p className="text-xs uppercase tracking-wide text-oxblood-300 mb-2">
        Question {step + 1} of {questions.length}
      </p>
      <h3 className="font-display text-lg text-oxblood-700 mb-4">{q.question}</h3>
      <div className="grid grid-cols-1 gap-2" role="group" aria-label="Answer choices">
        {q.choices.map((choice, i) => {
          const isCorrect = selected !== null && i === q.answer_index;
          const isWrong = selected === i && i !== q.answer_index;
          return (
            <button
              key={choice}
              type="button"
              onClick={() => handleAnswer(i)}
              disabled={selected !== null}
              className={`flex items-center justify-between rounded-lg border px-4 py-3 text-left text-sm transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-crimson-500 ${
                isCorrect
                  ? 'border-crimson-400 bg-blush-100'
                  : isWrong
                  ? 'border-oxblood-300 bg-oxblood-50'
                  : 'border-oxblood-100 hover:bg-blush-50'
              } disabled:cursor-default`}
            >
              {choice}
              {isCorrect && <CheckCircle2 size={16} className="text-crimson-500" aria-hidden="true" />}
              {isWrong && <XCircle size={16} className="text-oxblood-400" aria-hidden="true" />}
            </button>
          );
        })}
      </div>
    </Card>
  );
}
