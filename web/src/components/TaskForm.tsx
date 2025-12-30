import { useState, useMemo } from 'react';
import { CreateTaskDTO } from '@time-management/shared';

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

  // Calculate which quadrant this task will fall into
  const quadrantInfo = useMemo(() => {
    const { urgency = 5, importance = 5 } = formData;

    if (urgency >= 6 && importance >= 6) {
      return {
        name: 'Urgent & Important',
        subtitle: 'Do First',
        color: 'bg-red-100 text-red-900 border-red-300',
      };
    } else if (urgency < 6 && importance >= 6) {
      return {
        name: 'Not Urgent & Important',
        subtitle: 'Schedule',
        color: 'bg-blue-100 text-blue-900 border-blue-300',
      };
    } else if (urgency >= 6 && importance < 6) {
      return {
        name: 'Urgent & Not Important',
        subtitle: 'Delegate',
        color: 'bg-yellow-100 text-yellow-900 border-yellow-300',
      };
    } else {
      return {
        name: 'Not Urgent & Not Important',
        subtitle: 'Eliminate',
        color: 'bg-gray-100 text-gray-900 border-gray-300',
      };
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

    if (!validateForm()) {
      return;
    }

    // Parse tags from comma-separated input
    const tags = tagsInput
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0);

    const taskData: CreateTaskDTO = {
      ...formData,
      tags,
    };

    await onSubmit(taskData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Title */}
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
          Title <span className="text-red-500">*</span>
        </label>
        <input
          id="title"
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.title ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="Enter task title"
          disabled={loading}
        />
        {errors.title && (
          <p className="mt-1 text-sm text-red-600">{errors.title}</p>
        )}
      </div>

      {/* Description */}
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={3}
          placeholder="Add task description (optional)"
          disabled={loading}
        />
      </div>

      {/* Urgency Slider */}
      <div>
        <label htmlFor="urgency" className="block text-sm font-medium text-gray-700 mb-1">
          Urgency: <span className="font-bold text-blue-600">{formData.urgency}/10</span>
        </label>
        <input
          id="urgency"
          type="range"
          min="1"
          max="10"
          value={formData.urgency}
          onChange={(e) => setFormData({ ...formData, urgency: parseInt(e.target.value) })}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
          disabled={loading}
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>Low (1)</span>
          <span>High (10)</span>
        </div>
      </div>

      {/* Importance Slider */}
      <div>
        <label htmlFor="importance" className="block text-sm font-medium text-gray-700 mb-1">
          Importance: <span className="font-bold text-blue-600">{formData.importance}/10</span>
        </label>
        <input
          id="importance"
          type="range"
          min="1"
          max="10"
          value={formData.importance}
          onChange={(e) => setFormData({ ...formData, importance: parseInt(e.target.value) })}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
          disabled={loading}
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>Low (1)</span>
          <span>High (10)</span>
        </div>
      </div>

      {/* Quadrant Preview */}
      <div className={`p-4 rounded-lg border-2 ${quadrantInfo.color}`}>
        <div className="flex items-center justify-between">
          <div>
            <p className="font-semibold">{quadrantInfo.name}</p>
            <p className="text-sm opacity-80">{quadrantInfo.subtitle}</p>
          </div>
          <div className="text-xs opacity-70">
            Task will appear here
          </div>
        </div>
      </div>

      {/* Estimated Minutes */}
      <div>
        <label htmlFor="estimatedMinutes" className="block text-sm font-medium text-gray-700 mb-1">
          Estimated Time (minutes)
        </label>
        <input
          id="estimatedMinutes"
          type="number"
          min="1"
          value={formData.estimatedMinutes || ''}
          onChange={(e) => setFormData({
            ...formData,
            estimatedMinutes: e.target.value ? parseInt(e.target.value) : undefined
          })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="e.g., 30"
          disabled={loading}
        />
      </div>

      {/* Deadline */}
      <div>
        <label htmlFor="deadline" className="block text-sm font-medium text-gray-700 mb-1">
          Deadline
        </label>
        <input
          id="deadline"
          type="datetime-local"
          value={formData.deadline ? new Date(formData.deadline).toISOString().slice(0, 16) : ''}
          onChange={(e) => setFormData({
            ...formData,
            deadline: e.target.value ? new Date(e.target.value) : undefined
          })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={loading}
        />
      </div>

      {/* Tags */}
      <div>
        <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-1">
          Tags
        </label>
        <input
          id="tags"
          type="text"
          value={tagsInput}
          onChange={(e) => setTagsInput(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="work, personal, urgent (comma-separated)"
          disabled={loading}
        />
      </div>

      {/* Buttons */}
      <div className="flex gap-3 pt-4">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
        >
          {loading ? 'Creating...' : 'Create Task'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
          className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
