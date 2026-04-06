import { useEffect } from 'react';
import { useTaskStore } from '@/store/taskStore';
import { Task } from '@time-management/shared';
import { Plus, AlertCircle, Clock, Calendar as CalendarIcon, Zap, TrendingUp } from 'lucide-react';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const { matrix, loading, fetchMatrix } = useTaskStore();

  useEffect(() => {
    fetchMatrix().catch((error) => {
      toast.error('Failed to load tasks');
      console.error(error);
    });
  }, []);

  const quadrants = [
    {
      key: 'urgent_important',
      title: 'Urgent & Important',
      subtitle: 'Do First',
      className: 'quadrant-urgent-important',
      icon: AlertCircle,
      iconBg: 'bg-terra-50',
      iconColor: 'text-terra-500',
      tasks: matrix?.urgentImportant || [],
    },
    {
      key: 'not_urgent_important',
      title: 'Not Urgent & Important',
      subtitle: 'Schedule',
      className: 'quadrant-not-urgent-important',
      icon: CalendarIcon,
      iconBg: 'bg-sky/10',
      iconColor: 'text-sky',
      tasks: matrix?.notUrgentImportant || [],
    },
    {
      key: 'urgent_not_important',
      title: 'Urgent & Not Important',
      subtitle: 'Delegate',
      className: 'quadrant-urgent-not-important',
      icon: Zap,
      iconBg: 'bg-cream-300/50',
      iconColor: 'text-terra-400',
      tasks: matrix?.urgentNotImportant || [],
    },
    {
      key: 'not_urgent_not_important',
      title: 'Not Urgent & Not Important',
      subtitle: 'Eliminate',
      className: 'quadrant-not-urgent-not-important',
      icon: TrendingUp,
      iconBg: 'bg-sage/10',
      iconColor: 'text-sage',
      tasks: matrix?.notUrgentNotImportant || [],
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-2 border-terra-200 border-t-terra-500 rounded-full animate-spin" />
          <p className="text-warm-400 text-sm font-medium">Loading your priorities...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-10 animate-fade-in-up">
        <h1 className="text-4xl md:text-5xl font-display text-warm-900 mb-2">
          Eisenhower Matrix
        </h1>
        <p className="text-warm-500">Master time by understanding urgency and importance</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
        <div className="card p-6 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          <div className="flex items-start justify-between">
            <div className="p-3 bg-terra-50 rounded-2xl">
              <AlertCircle className="text-terra-500" size={22} strokeWidth={2} />
            </div>
            <div className="text-right">
              <div className="text-3xl font-display text-warm-900">
                {matrix?.urgentImportant.length || 0}
              </div>
              <div className="text-xs text-warm-400 font-medium tracking-wider uppercase mt-1">Critical</div>
            </div>
          </div>
          <div className="text-sm text-warm-600 font-medium mt-4">Urgent & Important</div>
        </div>

        <div className="card p-6 animate-fade-in-up" style={{ animationDelay: '0.15s' }}>
          <div className="flex items-start justify-between">
            <div className="p-3 bg-cream-200 rounded-2xl">
              <Clock className="text-terra-400" size={22} strokeWidth={2} />
            </div>
            <div className="text-right">
              <div className="text-3xl font-display text-warm-900">
                {(matrix?.urgentImportant.length || 0) + (matrix?.urgentNotImportant.length || 0)}
              </div>
              <div className="text-xs text-warm-400 font-medium tracking-wider uppercase mt-1">Urgent</div>
            </div>
          </div>
          <div className="text-sm text-warm-600 font-medium mt-4">Total Urgent Tasks</div>
        </div>

        <div className="card p-6 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <div className="flex items-start justify-between">
            <div className="p-3 bg-sage/10 rounded-2xl">
              <CalendarIcon className="text-sage" size={22} strokeWidth={2} />
            </div>
            <div className="text-right">
              <div className="text-3xl font-display text-warm-900">
                {(matrix?.urgentImportant.length || 0) + (matrix?.notUrgentImportant.length || 0) + (matrix?.urgentNotImportant.length || 0) + (matrix?.notUrgentNotImportant.length || 0)}
              </div>
              <div className="text-xs text-warm-400 font-medium tracking-wider uppercase mt-1">Total</div>
            </div>
          </div>
          <div className="text-sm text-warm-600 font-medium mt-4">All Active Tasks</div>
        </div>
      </div>

      {/* Matrix Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {quadrants.map((quadrant, index) => (
          <QuadrantCard key={quadrant.key} quadrant={quadrant} index={index} />
        ))}
      </div>
    </div>
  );
}

function QuadrantCard({ quadrant, index }: { quadrant: any; index: number }) {
  const Icon = quadrant.icon;

  return (
    <div
      className={`${quadrant.className} rounded-3xl overflow-hidden animate-fade-in-up`}
      style={{ animationDelay: `${0.25 + index * 0.08}s` }}
    >
      <div className="p-6 border-b border-warm-100/50">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-xl ${quadrant.iconBg}`}>
              <Icon size={20} strokeWidth={2} className={quadrant.iconColor} />
            </div>
            <div>
              <h3 className="font-display text-lg text-warm-900">{quadrant.title}</h3>
              <p className="text-xs text-warm-400 font-medium tracking-wider uppercase">{quadrant.subtitle}</p>
            </div>
          </div>
          <div className="text-2xl font-display text-warm-300">{quadrant.tasks.length}</div>
        </div>
      </div>

      <div className="p-5 space-y-3 min-h-[280px] max-h-[400px] overflow-y-auto custom-scrollbar">
        {quadrant.tasks.length === 0 ? (
          <div className="text-center text-warm-300 py-12">
            <Icon size={36} strokeWidth={1.5} className="mx-auto mb-3 opacity-40" />
            <p className="text-sm font-medium">No tasks here</p>
            <p className="text-xs mt-1 opacity-60">Add a task to get started</p>
          </div>
        ) : (
          quadrant.tasks.map((task: Task, taskIndex: number) => (
            <div
              key={task.id}
              className="animate-fade-in-up"
              style={{ animationDelay: `${0.03 * taskIndex}s` }}
            >
              <TaskCard task={task} />
            </div>
          ))
        )}

        <Link
          to="/tasks"
          className="w-full p-3.5 border border-dashed border-warm-200 rounded-2xl hover:border-terra-300 hover:bg-terra-50/30 transition-all duration-300 flex items-center justify-center gap-2 text-warm-400 hover:text-terra-500 group"
        >
          <Plus size={16} className="group-hover:rotate-90 transition-transform duration-300" />
          <span className="text-sm font-medium">Add Task</span>
        </Link>
      </div>
    </div>
  );
}

function TaskCard({ task }: { task: Task }) {
  return (
    <div className="task-card group cursor-pointer">
      <div className="flex items-start justify-between mb-2">
        <h4 className="font-semibold text-warm-800 text-sm flex-1 pr-2 group-hover:text-terra-600 transition-colors">
          {task.title}
        </h4>
        {task.estimatedMinutes && (
          <div className="flex items-center gap-1 text-warm-400 text-xs bg-cream-200/60 px-2 py-0.5 rounded-lg">
            <Clock size={11} />
            <span>{task.estimatedMinutes}m</span>
          </div>
        )}
      </div>

      {task.description && (
        <p className="text-xs text-warm-500 mb-3 line-clamp-2">{task.description}</p>
      )}

      <div className="flex items-center justify-between">
        {task.deadline && (
          <span className="flex items-center gap-1 text-xs text-warm-400">
            <CalendarIcon size={11} />
            {new Date(task.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          </span>
        )}

        {task.tags?.length > 0 && (
          <div className="flex gap-1 flex-wrap">
            {task.tags.slice(0, 2).map((tag: string) => (
              <span
                key={tag}
                className="px-2 py-0.5 bg-cream-200/80 rounded-lg text-xs text-warm-600 font-medium"
              >
                {tag}
              </span>
            ))}
            {task.tags.length > 2 && (
              <span className="px-2 py-0.5 bg-cream-200/60 rounded-lg text-xs text-warm-400">
                +{task.tags.length - 2}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
