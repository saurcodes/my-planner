import { useEffect } from 'react';
import { useTaskStore } from '@/store/taskStore';
import { Task } from '@time-management/shared';
import { Plus, AlertCircle, Clock, Calendar as CalendarIcon, Zap, TrendingUp } from 'lucide-react';
import toast from 'react-hot-toast';

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
      iconColor: 'text-sunset-pink',
      tasks: matrix?.urgentImportant || [],
    },
    {
      key: 'not_urgent_important',
      title: 'Not Urgent & Important',
      subtitle: 'Schedule',
      className: 'quadrant-not-urgent-important',
      icon: CalendarIcon,
      iconColor: 'text-primary-400',
      tasks: matrix?.notUrgentImportant || [],
    },
    {
      key: 'urgent_not_important',
      title: 'Urgent & Not Important',
      subtitle: 'Delegate',
      className: 'quadrant-urgent-not-important',
      icon: Zap,
      iconColor: 'text-sunset-orange',
      tasks: matrix?.urgentNotImportant || [],
    },
    {
      key: 'not_urgent_not_important',
      title: 'Not Urgent & Not Important',
      subtitle: 'Eliminate',
      className: 'quadrant-not-urgent-not-important',
      icon: TrendingUp,
      iconColor: 'text-white/40',
      tasks: matrix?.notUrgentNotImportant || [],
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-xl text-white/50 font-display animate-pulse">Loading your priorities...</div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-10 animate-fade-in-up">
        <h1 className="text-6xl font-display text-gradient mb-3">
          Eisenhower Matrix
        </h1>
        <p className="text-white/60 text-lg">Master time by understanding urgency and importance</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-6 mb-10">
        <div className="card animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          <div className="flex items-start justify-between mb-4">
            <div className="p-4 bg-gradient-to-br from-sunset-pink/20 to-sunset-orange/10 rounded-2xl border border-sunset-pink/30">
              <AlertCircle className="text-sunset-pink" size={28} strokeWidth={2} />
            </div>
            <div className="text-right">
              <div className="text-5xl font-display text-gradient-sunset mb-1">
                {matrix?.urgentImportant.length || 0}
              </div>
              <div className="text-xs text-white/50 font-semibold tracking-wider uppercase">Critical</div>
            </div>
          </div>
          <div className="text-sm text-white/70 font-medium">Urgent & Important</div>
        </div>

        <div className="card animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <div className="flex items-start justify-between mb-4">
            <div className="p-4 bg-gradient-to-br from-sunset-orange/20 to-sunset-gold/10 rounded-2xl border border-sunset-orange/30">
              <Clock className="text-sunset-orange" size={28} strokeWidth={2} />
            </div>
            <div className="text-right">
              <div className="text-5xl font-display text-white mb-1">
                {(matrix?.urgentImportant.length || 0) + (matrix?.urgentNotImportant.length || 0)}
              </div>
              <div className="text-xs text-white/50 font-semibold tracking-wider uppercase">Urgent</div>
            </div>
          </div>
          <div className="text-sm text-white/70 font-medium">Total Urgent Tasks</div>
        </div>

        <div className="card animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
          <div className="flex items-start justify-between mb-4">
            <div className="p-4 bg-gradient-to-br from-acid-lime/20 to-electric-cyan/10 rounded-2xl border border-acid-lime/30">
              <CalendarIcon className="text-acid-lime" size={28} strokeWidth={2} />
            </div>
            <div className="text-right">
              <div className="text-5xl font-display text-gradient mb-1">
                {Object.values(matrix || {}).reduce((sum, tasks) => sum + tasks.length, 0)}
              </div>
              <div className="text-xs text-white/50 font-semibold tracking-wider uppercase">Total</div>
            </div>
          </div>
          <div className="text-sm text-white/70 font-medium">All Active Tasks</div>
        </div>
      </div>

      {/* Matrix Grid */}
      <div className="grid grid-cols-2 gap-8">
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
      className={`${quadrant.className} rounded-3xl overflow-hidden backdrop-blur-sm animate-fade-in-up relative`}
      style={{ animationDelay: `${0.4 + index * 0.1}s` }}
    >
      {/* Decorative corner gradient */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/10 to-transparent rounded-bl-full blur-2xl" />

      <div className="p-6 border-b border-white/10 relative z-10">
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-3">
            <div className={`p-3 rounded-2xl ${quadrant.iconColor} bg-white/5 backdrop-blur-sm`}>
              <Icon size={24} strokeWidth={2.5} />
            </div>
            <div>
              <h3 className="font-display text-2xl text-white mb-1">{quadrant.title}</h3>
              <p className="text-sm text-white/50 font-semibold tracking-wider uppercase">{quadrant.subtitle}</p>
            </div>
          </div>
          <div className="text-4xl font-display text-white/20">{quadrant.tasks.length}</div>
        </div>
      </div>

      <div className="p-6 space-y-3 min-h-[350px] max-h-[450px] overflow-y-auto custom-scrollbar">
        {quadrant.tasks.length === 0 ? (
          <div className="text-center text-white/30 py-12">
            <Icon size={48} strokeWidth={1.5} className="mx-auto mb-3 opacity-30" />
            <p className="text-sm font-medium">No tasks in this quadrant</p>
            <p className="text-xs mt-1 opacity-70">Add a task to get started</p>
          </div>
        ) : (
          quadrant.tasks.map((task: Task, taskIndex: number) => (
            <div
              key={task.id}
              className="animate-fade-in-up"
              style={{ animationDelay: `${0.05 * taskIndex}s` }}
            >
              <TaskCard task={task} />
            </div>
          ))
        )}

        <button className="w-full p-4 border-2 border-dashed border-white/20 rounded-2xl hover:border-white/40 hover:bg-white/5 transition-all duration-300 flex items-center justify-center gap-2 text-white/50 hover:text-white/80 group">
          <Plus size={18} className="group-hover:rotate-90 transition-transform duration-300" />
          <span className="text-sm font-semibold">Add Task</span>
        </button>
      </div>
    </div>
  );
}

function TaskCard({ task }: { task: Task }) {
  return (
    <div className="task-card group cursor-pointer">
      <div className="flex items-start justify-between mb-2">
        <h4 className="font-semibold text-white text-base flex-1 pr-2 group-hover:text-acid-lime transition-colors">
          {task.title}
        </h4>
        {task.estimatedMinutes && (
          <div className="flex items-center gap-1 text-white/40 text-xs bg-white/5 px-2 py-1 rounded-lg">
            <Clock size={12} />
            <span>{task.estimatedMinutes}m</span>
          </div>
        )}
      </div>

      {task.description && (
        <p className="text-sm text-white/60 mb-3 line-clamp-2">{task.description}</p>
      )}

      <div className="flex items-center justify-between">
        {task.deadline && (
          <span className="flex items-center gap-1 text-xs text-white/40">
            <CalendarIcon size={12} />
            {new Date(task.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          </span>
        )}

        {task.tags.length > 0 && (
          <div className="flex gap-1 flex-wrap">
            {task.tags.slice(0, 2).map((tag: string) => (
              <span
                key={tag}
                className="px-2 py-0.5 bg-white/10 rounded-lg text-xs text-white/70 font-medium"
              >
                {tag}
              </span>
            ))}
            {task.tags.length > 2 && (
              <span className="px-2 py-0.5 bg-white/10 rounded-lg text-xs text-white/50">
                +{task.tags.length - 2}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
