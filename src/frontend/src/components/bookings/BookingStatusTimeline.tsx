import { CheckCircle, Circle } from 'lucide-react';
import type { BookingStatus } from '../../backend';

interface Props {
  status: BookingStatus;
}

const statusSteps = [
  { key: 'pending', label: 'Pending' },
  { key: 'confirmed', label: 'Confirmed' },
  { key: 'inProgress', label: 'In Progress' },
  { key: 'completed', label: 'Completed' },
];

export default function BookingStatusTimeline({ status }: Props) {
  const currentIndex = statusSteps.findIndex(s => s.key === status);

  return (
    <div className="space-y-4">
      <h3 className="font-semibold">Status Timeline</h3>
      <div className="space-y-3">
        {statusSteps.map((step, index) => {
          const isCompleted = index <= currentIndex;
          const isCurrent = index === currentIndex;

          return (
            <div key={step.key} className="flex items-center gap-3">
              {isCompleted ? (
                <CheckCircle className="h-5 w-5 text-green-500 shrink-0" />
              ) : (
                <Circle className="h-5 w-5 text-muted-foreground shrink-0" />
              )}
              <span className={isCurrent ? 'font-medium' : 'text-muted-foreground'}>
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
