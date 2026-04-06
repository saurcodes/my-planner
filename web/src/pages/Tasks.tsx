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
  const { tasks, matrix, loading, creating, fetchTasks, fetchMatrix, createTask } = useTaskStore();

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

      if (viewMode === 'list') {
        await fetchTasks();
      } else {
        await fetchMatrix();
      }
    } catch (error) {
      toast.error('Failed to create task');
      console.error(error);
      throw error;
    }
  };

  const quadrants = [
    { key: 'urgent_important', title: 'Urgent & Important', subtitle: 'Do First', className: 'quadrant-urgent-important', tasks: matrix?.urgentImportant || [] },
    { key: 'not_urgent_important', title: 'Not Urgent & Important', subtitle: 'Schedule', className: 'quadrant-not-urgent-important', tasks: matrix?.notUrgentImportant || [] },
    { key: 'urgent_not_important', title: 'Urgent & Not Important', subtitle: 'Delegate', className: 'quadrant-urgent-not-important', tasks: matrix?.urgentNotImportant || [] },
    { key: 'not_urgent_not_important', title: 'Not Urgent & Not Important', subtitle: 'Eliminate', className: 'quadrant-not-urgent-not-important', tasks: matrix?.notUrgentNotImportant || [] },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-2 border-terra-200 border-t-terra-500 rounded-full animate-spin" />
          <p className="text-warm-400 text-sm font-medium">Loading your tasks...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4 animate-fade-in-up">
        <div>
          <h1 className="text-4xl md:text-5xl font-display text-warm-900 mb-2">All Tasks</h1>
          <p className="text-warm-500">Organize and conquer your workload</p>
        </div>

        <div className="flex gap-3">
          {/* View Toggle */}
          <div className="flex gap-1 bg-cream-200/60 p-1 rounded-2xl">
            <button
              onClick={() => setViewMode('list')}
              className={`px-4 py-2.5 rounded-xl flex items-center gap-2 transition-all duration-200 text-sm font-medium ${
                viewMode === 'list'
                  ? 'bg-white text-warm-900 shadow-soft'
                  : 'text-warm-400 hover:text-warm-600'
              }`}
            >
              <List size={18} />
              <span>List</span>
            </button>
            <button
              onClick={() => setViewMode('quadrant')}
              className={`px-4 py-2.5 rounded-xl flex items-center gap-2 transition-all duration-200 text-sm font-medium ${
                viewMode === 'quadrant'
                  ? 'bg-white text-warm-900 shadow-soft'
                  : 'text-warm-400 hover:text-warm-600'
              }`}
            >
              <LayoutGrid size={18} />
              <span>Matrix</span>
            </button>
          </div>

          <button
            onClick={() => setShowCreateForm(true)}
            className="btn btn-primary flex items-center gap-2"
          >
            <Plus size={18} />
            New Task
          </button>
        </div>
      </div>

      {/* List View */}
      {viewMode === 'list' && (
        <div className="card animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          {tasks.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-16 h-16 bg-cream-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <CheckSquare size={28} strokeWidth={1.5} className="text-warm-300" />
              </div>
              <p className="text-warm-600 font-medium mb-1">No tasks yet</p>
              <p className="text-sm text-warm-400 mb-6">Create your first task to get started!</p>
              <button
                onClick={() => setShowCreateForm(true)}
                className="btn btn-primary inline-flex items-center gap-2"
              >
                <Plus size={18} />
                Create Task
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {tasks.map((task, index) => (
                <div
                  key={task.id}
                  className="animate-fade-in-up"
                  style={{ animationDelay: `${0.04 * index}s` }}
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {quadrants.map((quadrant, index) => (
            <div
              key={quadrant.key}
              className="animate-fade-in-up"
              style={{ animationDelay: `${0.08 + index * 0.05}s` }}
            >
              <QuadrantCard quadrant={quadrant} />
            </div>
          ))}
        </div>
      )}

      {/* Create Task Modal */}
      {showCreateForm && (
        <div
          className="fixed inset-0 bg-warm-900/20 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in-up"
          onClick={(e) => { if (e.target === e.currentTarget) setShowCreateForm(false); }}
          onKeyDown={(e) => { if (e.key === 'Escape') setShowCreateForm(false); }}
        >
          <div className="bg-white rounded-3xl p-8 max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-warm-xl border border-warm-100">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-display text-warm-900">Create New Task</h2>
              <button
                onClick={() => setShowCreateForm(false)}
                aria-label="Close"
                className="text-warm-300 hover:text-warm-600 transition-colors p-2 hover:bg-cream-200 rounded-xl"
              >
                <X size={22} />
              </button>
            </div>
            <TaskForm
              onSubmit={handleCreateTask}
              onCancel={() => setShowCreateForm(false)}
              loading={creating}
            />
          </div>
        </div>
      )}
    </div>
  );
}

function QuadrantCard({ quadrant }: { quadrant: any }) {
  return (
    <div className={`${quadrant.className} rounded-3xl overflow-hidden`}>
      <div className="p-6 border-b border-warm-100/50">
        <h3 className="font-display text-lg text-warm-900 mb-0.5">{quadrant.title}</h3>
        <div className="flex items-center justify-between">
          <p className="text-xs text-warm-400 font-medium tracking-wider uppercase">{quadrant.subtitle}</p>
          <div className="text-2xl font-display text-warm-300">{quadrant.tasks.length}</div>
        </div>
      </div>

      <div className="p-5 space-y-3 min-h-[240px] max-h-[360px] overflow-y-auto custom-scrollbar">
        {quadrant.tasks.length === 0 ? (
          <div className="text-center text-warm-300 py-10">
            <p className="text-sm font-medium">No tasks in this quadrant</p>
            <p className="text-xs mt-1 opacity-60">Tasks will appear here</p>
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
        <h3 className="font-semibold text-warm-800 text-sm flex-1 pr-2 group-hover:text-terra-600 transition-colors">
          {task.title}
        </h3>
        {task.estimatedMinutes && (
          <div className="flex items-center gap-1 text-warm-400 text-xs bg-cream-200/60 px-2 py-0.5 rounded-lg">
            <Clock size={12} />
            <span>{task.estimatedMinutes}m</span>
          </div>
        )}
      </div>

      {task.description && (
        <p className="text-xs text-warm-500 mb-3 line-clamp-2">{task.description}</p>
      )}

      <div className="flex items-center gap-4 text-xs text-warm-400 mb-3">
        <div className="flex items-center gap-1.5">
          <div className="w-12 bg-cream-300/60 rounded-full h-1 overflow-hidden">
            <div className="h-full bg-terra-400 rounded-full" style={{ width: `${(task.urgency / 10) * 100}%` }} />
          </div>
          <span>U:{task.urgency}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-12 bg-cream-300/60 rounded-full h-1 overflow-hidden">
            <div className="h-full bg-sky rounded-full" style={{ width: `${(task.importance / 10) * 100}%` }} />
          </div>
          <span>I:{task.importance}</span>
        </div>
      </div>

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
              <span key={tag} className="px-2 py-0.5 bg-cream-200/80 rounded-lg text-xs text-warm-600 font-medium">
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
