import { useState } from 'react';
import { useSubmitFeedback } from '../../hooks/useQueries';
import { Star } from 'lucide-react';

interface Props {
  bookingId: bigint;
}

export default function LeaveRatingCard({ bookingId }: Props) {
  const [rating, setRating] = useState(0);
  const [comments, setComments] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const submitFeedback = useSubmitFeedback();

  const handleSubmit = async () => {
    if (rating === 0) {
      alert('Please select a rating');
      return;
    }

    try {
      await submitFeedback.mutateAsync({
        bookingId,
        rating: BigInt(rating),
        comments,
      });
      setSubmitted(true);
    } catch (error: any) {
      alert('Failed to submit feedback: ' + error.message);
    }
  };

  if (submitted) {
    return (
      <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6 text-center">
        <p className="font-medium text-green-800 dark:text-green-200">Thank you for your feedback!</p>
      </div>
    );
  }

  return (
    <div className="bg-card border rounded-lg p-6">
      <h3 className="text-lg font-semibold mb-4">Rate Your Experience</h3>

      <div className="space-y-4">
        <div>
          <p className="text-sm text-muted-foreground mb-2">Rating</p>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => setRating(star)}
                className="focus:outline-none"
              >
                <Star
                  className={`h-8 w-8 ${
                    star <= rating
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-muted-foreground'
                  }`}
                />
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Comments</label>
          <textarea
            value={comments}
            onChange={(e) => setComments(e.target.value)}
            className="w-full px-3 py-2 border rounded-md bg-background"
            rows={3}
            placeholder="Share your experience..."
          />
        </div>

        <button
          onClick={handleSubmit}
          disabled={rating === 0 || submitFeedback.isPending}
          className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50"
        >
          {submitFeedback.isPending ? 'Submitting...' : 'Submit Feedback'}
        </button>
      </div>
    </div>
  );
}
