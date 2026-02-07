import { useGetIVRTasks, useUpdateIVRTaskStatus } from '../../hooks/useQueries';
import { Phone } from 'lucide-react';

export default function IVRTasksPage() {
  const { data: tasks = [] } = useGetIVRTasks();
  const updateStatus = useUpdateIVRTaskStatus();

  const handleUpdateStatus = async (taskId: bigint, newStatus: string) => {
    try {
      await updateStatus.mutateAsync({ taskId, status: newStatus });
    } catch (error: any) {
      alert('Failed to update task status: ' + error.message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Phone className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-bold">IVR Call Tasks</h1>
      </div>

      <div className="bg-card border rounded-lg overflow-hidden">
        {tasks.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">
            No IVR tasks found
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-muted">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold">Task ID</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Booking ID</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Type</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Status</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {tasks.map((task) => (
                <tr key={task.id.toString()} className="hover:bg-accent/5">
                  <td className="px-6 py-4 text-sm">#{task.id.toString()}</td>
                  <td className="px-6 py-4 text-sm">#{task.bookingId.toString()}</td>
                  <td className="px-6 py-4 text-sm capitalize">{task.taskType.replace('_', ' ')}</td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 text-xs rounded-full bg-primary/10 text-primary capitalize">
                      {task.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <select
                      value={task.status}
                      onChange={(e) => handleUpdateStatus(task.id, e.target.value)}
                      className="text-sm px-2 py-1 border rounded bg-background"
                      disabled={updateStatus.isPending}
                    >
                      <option value="pending">Pending</option>
                      <option value="queued">Queued</option>
                      <option value="sent">Sent</option>
                      <option value="failed">Failed</option>
                      <option value="completed">Completed</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
