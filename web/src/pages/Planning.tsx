import { Calendar, Sparkles, Clock, ArrowRight } from 'lucide-react';

export default function Planning() {
  return (
    <div className="animate-fade-in-up">
      <div className="mb-10">
        <h1 className="text-4xl md:text-5xl font-display text-warm-900 mb-2">Daily Planning</h1>
        <p className="text-warm-500">AI-powered planning to optimize your day</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="card p-8 group hover:shadow-card-hover transition-all duration-300">
          <div className="p-3 bg-terra-50 rounded-2xl w-fit mb-5">
            <Sparkles className="text-terra-500" size={24} strokeWidth={2} />
          </div>
          <h3 className="font-display text-xl text-warm-900 mb-2">AI Daily Plan</h3>
          <p className="text-warm-500 text-sm mb-6 leading-relaxed">
            Answer a few questions about your day and let Claude AI create an optimized schedule tailored to your energy and priorities.
          </p>
          <button className="btn btn-primary inline-flex items-center gap-2 group/btn">
            Start Planning
            <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="card p-8 group hover:shadow-card-hover transition-all duration-300">
          <div className="p-3 bg-sky/10 rounded-2xl w-fit mb-5">
            <Calendar className="text-sky" size={24} strokeWidth={2} />
          </div>
          <h3 className="font-display text-xl text-warm-900 mb-2">Today's Schedule</h3>
          <p className="text-warm-500 text-sm mb-6 leading-relaxed">
            View your current daily plan, adjust time blocks, and track progress through scheduled tasks.
          </p>
          <button className="btn btn-secondary inline-flex items-center gap-2">
            <Clock size={16} />
            View Schedule
          </button>
        </div>
      </div>

      <div className="card p-6 bg-cream-200/30">
        <div className="flex items-center gap-3 text-warm-400">
          <div className="w-8 h-8 rounded-full bg-cream-300/60 flex items-center justify-center">
            <Sparkles size={16} />
          </div>
          <p className="text-sm">
            <span className="font-medium text-warm-600">Pro tip:</span> Planning your day in the morning can increase productivity by up to 25%.
          </p>
        </div>
      </div>
    </div>
  );
}
