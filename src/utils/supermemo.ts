import { supermemo, SuperMemoGrade } from 'supermemo';
import { StatusCard } from 'src/model/consts';

export type ReviewRatingKey = 'again' | 'hard' | 'good' | 'easy';

const gradeByRating: Record<ReviewRatingKey, SuperMemoGrade> = {
  again: 1,
  hard: 3,
  good: 4,
  easy: 5,
};

type SuperMemoParams = {
  interval: number;
  repetitions: number;
  easeFactor: number;
};

const resolveCardStatus = (repetition: number) => {
  if (repetition >= 5) {
    return StatusCard.MASTERED;
  }

  return StatusCard.LEARNING;
};

export const calculateNextReviewState = (
  params: SuperMemoParams,
  rating: ReviewRatingKey,
  nowTimestamp = Date.now(),
) => {
  const result = supermemo(
    {
      interval: params.interval,
      repetition: params.repetitions,
      efactor: params.easeFactor,
    },
    gradeByRating[rating],
  );

  console.log('supermemo result', result);
  return {
    interval: result.interval,
    repetitions: result.repetition,
    easeFactor: result.efactor,
    nextReviewAt: new Date(nowTimestamp + result.interval * 24 * 60 * 60 * 1000),
    status: resolveCardStatus(result.repetition),
  };
};
