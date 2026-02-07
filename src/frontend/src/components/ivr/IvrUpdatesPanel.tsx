import { useGetIVRTasks } from '../../hooks/useQueries';
import { Phone } from 'lucide-react';

interface Props {
  bookingId: bigint;
}

export default function IvrUpdatesPanel({ bookingId }: Props) {
  const { data: allTasks = [] } = useGetIVRTasks();
  
  const tasks = allTasks.filter(t => t.bookingId === bookingId);

  if (tasks.length === 0) {
    return null;
  }

  return (
    <div className="bg-card border rounded-lg p-6">
      <div className="flex items-center gap-2 mb-4">
        <Phone className="h-5 w-5 text-muted-foreground" />
        <h3 className="font-semibold">IVR Updates</h3>
      </div>

      <div className="space-y-3">
        {tasks.map((task) => (
          <div key={task.id.toString()} className="flex justify-between items-center p-3 bg-accent/10 rounded-md">
            <div>
              <p className="text-sm font-medium capitalize">{task.taskType.replace('_', ' ')}</p>
              <p className="text-xs text-muted-foreground">Task #{task.id.toString()}</p>
            </div>
            <span className="px-2 py-1 text-xs rounded-full bg-muted capitalize">
              {task.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
