import { useEffect, useState } from 'react';
import { useTaskStore } from '@/store/taskStore';
import { Task, CreateTaskDTO } from '@time-management/shared';
import { Plus, List, LayoutGrid, Clock, X, Calendar as CalendarIcon, CheckSquare } from 'lucide-react';
import toast from 'react-hot-toast';
import TaskForm from '@/components/TaskForm';

type ViewMode = 'list' | 'quadrant';

export default function Tasks() {
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const { tasks, matrix, loading, fetchTasks, fetchMatrix, createTask } = useTaskStore();

  useEffect(() => {
    const loadData = async () => {
      try {
        if (viewMode === 'list') {
          await fetchTasks();
        } else {
          await fetchMatrix();
        }
      } catch (error) {
        toast.error('Failed to load tasks');
        console.error(error);
      }
    };

    loadData();
  }, [viewMode, fetchTasks, fetchMatrix]);

  const handleCreateTask = async (taskData: CreateTaskDTO) => {
    try {
      await createTask(taskData);
      toast.success('Task created successfully!');
      setShowCreateForm(false);

      // Refresh current view
      if (viewMode === 'list') {
        await fetchTasks();
      } else {
        await fetchMatrix();
      }
    } catch (error) {
      toast.error('Failed to create task');
      console.error(error);
      throw error; // Re-throw to let form handle
    }
  };

  const quadrants = [
    {
      key: 'urgent_important',
      title: 'Urgent & Important',
      subtitle: 'Do First',
      className: 'quadrant-urgent-important',
      tasks: matrix?.urgentImportant || [],
    },
    {
      key: 'not_urgent_important',
      title: 'Not Urgent & Important',
      subtitle: 'Schedule',
      className: 'quadrant-not-urgent-important',
      tasks: matrix?.notUrgentImportant || [],
    },
    {
      key: 'urgent_not_important',
      title: 'Urgent & Not Important',
      subtitle: 'Delegate',
      className: 'quadrant-urgent-not-important',
      tasks: matrix?.urgentNotImportant || [],
    },
    {
      key: 'not_urgent_not_important',
      title: 'Not Urgent & Not Important',
      subtitle: 'Eliminate',
      className: 'quadrant-not-urgent-not-important',
      tasks: matrix?.notUrgentNotImportant || [],
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-xl text-white/50 font-display animate-pulse">Loading your tasks...</div>
      </div>
    );
  }

  return (
    <div>
      {/* Header with Controls */}
      <div className="flex items-center justify-between mb-10 animate-fade-in-up">
        <div>
          <h1 className="text-6xl font-display text-gradient mb-2">All Tasks</h1>
          <p className="text-white/60 text-lg">Organize and conquer your workload</p>
        </div>

        <div className="flex gap-4">
          {/* View Toggle */}
          <div className="flex gap-2 bg-white/5 backdrop-blur-sm p-1.5 rounded-2xl border border-white/10">
            <button
              onClick={() => setViewMode('list')}
              className={`px-5 py-3 rounded-xl flex items-center gap-2 transition-all duration-300 font-semibold ${
                viewMode === 'list'
                  ? 'bg-gradient-to-br from-acid-lime/20 to-electric-cyan/10 text-white border-2 border-acid-lime/40 shadow-lg'
                  : 'text-white/60 hover:text-white hover:bg-white/10 border-2 border-transparent'
              }`}
            >
              <List size={20} strokeWidth={viewMode === 'list' ? 2.5 : 2} />
              <span>List</span>
            </button>
            <button
              onClick={() => setViewMode('quadrant')}
              className={`px-5 py-3 rounded-xl flex items-center gap-2 transition-all duration-300 font-semibold ${
                viewMode === 'quadrant'
                  ? 'bg-gradient-to-br from-acid-lime/20 to-electric-cyan/10 text-white border-2 border-acid-lime/40 shadow-lg'
                  : 'text-white/60 hover:text-white hover:bg-white/10 border-2 border-transparent'
              }`}
            >
              <LayoutGrid size={20} strokeWidth={viewMode === 'quadrant' ? 2.5 : 2} />
              <span>Quadrant</span>
            </button>
          </div>

          {/* Create Task Button */}
          <button
            onClick={() => setShowCreateForm(true)}
            className="btn btn-primary flex items-center gap-2"
          >
            <Plus size={20} />
            New Task
          </button>
        </div>
      </div>

      {/* List View */}
      {viewMode === 'list' && (
        <div className="card animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          {tasks.length === 0 ? (
            <div className="text-center py-16 text-white/30">
              <CheckSquare size={64} strokeWidth={1.5} className="mx-auto mb-4 opacity-30" />
              <p className="text-lg mb-2 font-medium">No tasks yet</p>
              <p className="text-sm mb-6 opacity-70">Create your first task to get started!</p>
              <button
                onClick={() => setShowCreateForm(true)}
                className="btn btn-primary inline-flex items-center gap-2"
              >
                <Plus size={20} />
                Create Task
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {tasks.map((task, index) => (
                <div
                  key={task.id}
                  className="animate-fade-in-up"
                  style={{ animationDelay: `${0.05 * index}s` }}
                >
                  <TaskCard task={task} />
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Quadrant View */}
      {viewMode === 'quadrant' && (
        <div className="grid grid-cols-2 gap-8">
          {quadrants.map((quadrant, index) => (
            <div
              key={quadrant.key}
              className="animate-fade-in-up"
              style={{ animationDelay: `${0.1 + index * 0.05}s` }}
            >
              <QuadrantCard quadrant={quadrant} />
            </div>
          ))}
        </div>
      )}

      {/* Create Task Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in-up">
          <div className="bg-gradient-to-br from-deep-indigo/95 to-twilight/90 backdrop-blur-xl rounded-3xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-white/20 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-4xl font-display text-gradient">Create New Task</h2>
              <button
                onClick={() => setShowCreateForm(false)}
                aria-label="Close"
                className="text-white/40 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-xl"
              >
                <X size={28} />
              </button>
            </div>
            <TaskForm
              onSubmit={handleCreateTask}
              onCancel={() => setShowCreateForm(false)}
              loading={loading}
            />
          </div>
        </div>
      )}
    </div>
  );
}

function QuadrantCard({ quadrant }: { quadrant: any }) {
  return (
    <div className={`${quadrant.className} rounded-3xl overflow-hidden backdrop-blur-sm relative`}>
      {/* Decorative corner gradient */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/10 to-transparent rounded-bl-full blur-2xl" />

      <div className={`p-6 border-b border-white/10 relative z-10`}>
        <h3 className="font-display text-2xl text-white mb-1">{quadrant.title}</h3>
        <div className="flex items-center justify-between">
          <p className="text-sm text-white/50 font-semibold tracking-wider uppercase">{quadrant.subtitle}</p>
          <div className="text-4xl font-display text-white/20">{quadrant.tasks.length}</div>
        </div>
      </div>

      <div className="p-6 space-y-3 min-h-[300px] max-h-[400px] overflow-y-auto">
        {quadrant.tasks.length === 0 ? (
          <div className="text-center text-white/30 py-12">
            <p className="text-sm font-medium">No tasks in this quadrant</p>
            <p className="text-xs mt-1 opacity-70">Tasks will appear here</p>
          </div>
        ) : (
          quadrant.tasks.map((task: Task) => (
            <TaskCard key={task.id} task={task} />
          ))
        )}
      </div>
    </div>
  );
}

function TaskCard({ task }: { task: Task }) {
  return (
    <div className="task-card group cursor-pointer">
      <div className="flex items-start justify-between mb-2">
        <h3 className="font-semibold text-white text-lg flex-1 pr-2 group-hover:text-acid-lime transition-colors">
          {task.title}
        </h3>
        {task.estimatedMinutes && (
          <div className="flex items-center gap-1 text-white/40 text-xs bg-white/5 px-2.5 py-1.5 rounded-lg">
            <Clock size={14} />
            <span>{task.estimatedMinutes}m</span>
          </div>
        )}
      </div>

      {task.description && (
        <p className="text-sm text-white/60 mb-3 line-clamp-2">{task.description}</p>
      )}

      <div className="flex items-center gap-6 text-sm text-white/50 mb-3">
        <div className="flex items-center gap-2">
          <div className="w-16 bg-white/10 rounded-full h-1.5 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-sunset-pink to-sunset-orange"
              style={{ width: `${(task.urgency / 10) * 100}%` }}
            />
          </div>
          <span className="text-xs">U:{task.urgency}</span>
        </div>

        <div className="flex items-center gap-2">
          <div className="w-16 bg-white/10 rounded-full h-1.5 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary-400 to-primary-600"
              style={{ width: `${(task.importance / 10) * 100}%` }}
            />
          </div>
          <span className="text-xs">I:{task.importance}</span>
        </div>
      </div>

      <div className="flex items-center justify-between">
        {task.deadline && (
          <span className="flex items-center gap-1.5 text-xs text-white/40">
            <CalendarIcon size={13} />
            {new Date(task.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          </span>
        )}

        {task.tags.length > 0 && (
          <div className="flex gap-1.5 flex-wrap">
            {task.tags.slice(0, 2).map((tag: string) => (
              <span
                key={tag}
                className="px-2.5 py-1 bg-white/10 rounded-lg text-xs text-white/70 font-medium"
              >
                {tag}
              </span>
            ))}
            {task.tags.length > 2 && (
              <span className="px-2.5 py-1 bg-white/10 rounded-lg text-xs text-white/50">
                +{task.tags.length - 2}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
