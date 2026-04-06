import { useState, useMemo } from 'react';
import { CreateTaskDTO } from '@time-management/shared';
import Spinner from './Spinner';
import { ChevronRight } from 'lucide-react';

interface TaskFormProps {
  onSubmit: (task: CreateTaskDTO) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

export default function TaskForm({ onSubmit, onCancel, loading }: TaskFormProps) {
  const [formData, setFormData] = useState<CreateTaskDTO>({
    title: '',
    description: '',
    urgency: 5,
    importance: 5,
    estimatedMinutes: undefined,
    deadline: undefined,
    tags: [],
  });

  const [errors, setErrors] = useState<{ title?: string }>({});
  const [tagsInput, setTagsInput] = useState('');

  const quadrantInfo = useMemo(() => {
    const { urgency = 5, importance = 5 } = formData;

    if (urgency >= 6 && importance >= 6) {
      return { name: 'Urgent & Important', subtitle: 'Do First', className: 'bg-terra-50 text-terra-600 border-terra-200' };
    } else if (urgency < 6 && importance >= 6) {
      return { name: 'Not Urgent & Important', subtitle: 'Schedule', className: 'bg-sky/10 text-sky border-sky/20' };
    } else if (urgency >= 6 && importance < 6) {
      return { name: 'Urgent & Not Important', subtitle: 'Delegate', className: 'bg-cream-300/40 text-terra-400 border-cream-300' };
    } else {
      return { name: 'Not Urgent & Not Important', subtitle: 'Eliminate', className: 'bg-warm-50 text-warm-500 border-warm-200' };
    }
  }, [formData.urgency, formData.importance]);

  const validateForm = () => {
    const newErrors: { title?: string } = {};
    if (!formData.title || formData.title.trim().length === 0) {
      newErrors.title = 'Title is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const tags = tagsInput
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0);

    const taskData: CreateTaskDTO = { ...formData, tags };

    try {
      await onSubmit(taskData);
    } catch (error) {
      // Error handled by parent
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Title */}
      <div className="float-input-group">
        <input
          id="title"
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className={`float-input ${errors.title ? 'border-red-300 focus:border-red-400' : ''}`}
          placeholder=" "
          disabled={loading}
        />
        <label htmlFor="title" className="float-label">
          Task <span className="text-terra-500">*</span>
        </label>
        {errors.title && (
          <p className="mt-1.5 text-xs text-red-400 ml-1">{errors.title}</p>
        )}
      </div>

      {/* Description */}
      <div className="float-input-group">
        <textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="float-input min-h-[80px] resize-none"
          placeholder=" "
          rows={2}
          disabled={loading}
        />
        <label htmlFor="description" className="float-label !top-5">
          Description
        </label>
      </div>

      {/* Urgency */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium text-warm-600">Urgency</label>
          <span className="text-sm font-semibold text-terra-500">{formData.urgency}/10</span>
        </div>
        <input
          type="range"
          min="1"
          max="10"
          value={formData.urgency}
          onChange={(e) => setFormData({ ...formData, urgency: parseInt(e.target.value) })}
          className="w-full h-1.5 bg-cream-300 rounded-full appearance-none cursor-pointer accent-terra-500"
          disabled={loading}
        />
        <div className="flex justify-between text-xs text-warm-400 mt-1">
          <span>Low</span>
          <span>High</span>
        </div>
      </div>

      {/* Importance */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium text-warm-600">Importance</label>
          <span className="text-sm font-semibold text-terra-500">{formData.importance}/10</span>
        </div>
        <input
          type="range"
          min="1"
          max="10"
          value={formData.importance}
          onChange={(e) => setFormData({ ...formData, importance: parseInt(e.target.value) })}
          className="w-full h-1.5 bg-cream-300 rounded-full appearance-none cursor-pointer accent-terra-500"
          disabled={loading}
        />
        <div className="flex justify-between text-xs text-warm-400 mt-1">
          <span>Low</span>
          <span>High</span>
        </div>
      </div>

      {/* Quadrant Preview */}
      <div className={`p-4 rounded-2xl border ${quadrantInfo.className}`}>
        <div className="flex items-center justify-between">
          <div>
            <p className="font-semibold text-sm">{quadrantInfo.name}</p>
            <p className="text-xs opacity-70 mt-0.5">{quadrantInfo.subtitle}</p>
          </div>
          <div className="text-xs opacity-50">Quadrant preview</div>
        </div>
      </div>

      {/* Time and Deadline Row */}
      <div className="grid grid-cols-2 gap-4">
        <div className="float-input-group">
          <input
            id="estimatedMinutes"
            type="number"
            min="1"
            value={formData.estimatedMinutes || ''}
            onChange={(e) => setFormData({
              ...formData,
              estimatedMinutes: e.target.value ? parseInt(e.target.value) : undefined
            })}
            className="float-input"
            placeholder=" "
            disabled={loading}
          />
          <label htmlFor="estimatedMinutes" className="float-label">
            Est. minutes
          </label>
        </div>

        <div className="float-input-group">
          <input
            id="deadline"
            type="datetime-local"
            value={formData.deadline ? new Date(formData.deadline).toISOString().slice(0, 16) : ''}
            onChange={(e) => setFormData({
              ...formData,
              deadline: e.target.value ? new Date(e.target.value) : undefined
            })}
            className="float-input text-warm-600"
            disabled={loading}
          />
          <label htmlFor="deadline" className="float-label !top-0 !text-xs !text-terra-500 bg-white">
            Deadline
          </label>
        </div>
      </div>

      {/* Tags */}
      <div className="float-input-group">
        <input
          id="tags"
          type="text"
          value={tagsInput}
          onChange={(e) => setTagsInput(e.target.value)}
          className="float-input"
          placeholder=" "
          disabled={loading}
        />
        <label htmlFor="tags" className="float-label">
          Tags (comma-separated)
        </label>
      </div>

      {/* Buttons */}
      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 btn btn-primary flex items-center justify-center gap-2 py-3.5 group"
        >
          {loading ? (
            <>
              <Spinner />
              <span>Creating...</span>
            </>
          ) : (
            <>
              <span>Create Task</span>
              <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
          className="flex-1 btn btn-secondary disabled:opacity-50"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
