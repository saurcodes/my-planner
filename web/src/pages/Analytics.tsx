import { BarChart3, TrendingUp, Clock, Sparkles, ArrowRight } from 'lucide-react';

export default function Analytics() {
  return (
    <div className="animate-fade-in-up">
      <div className="mb-10">
        <h1 className="text-4xl md:text-5xl font-display text-warm-900 mb-2">Analytics</h1>
        <p className="text-warm-500">Track your productivity trends and AI-generated insights</p>
      </div>

      {/* Stats Preview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
        <div className="card p-6">
          <div className="flex items-start justify-between">
            <div className="p-3 bg-terra-50 rounded-2xl">
              <TrendingUp className="text-terra-500" size={20} strokeWidth={2} />
            </div>
            <div className="text-right">
              <div className="text-3xl font-display text-warm-900">--</div>
              <div className="text-xs text-warm-400 font-medium tracking-wider uppercase mt-1">Score</div>
            </div>
          </div>
          <div className="text-sm text-warm-600 font-medium mt-4">Productivity Score</div>
        </div>

        <div className="card p-6">
          <div className="flex items-start justify-between">
            <div className="p-3 bg-sky/10 rounded-2xl">
              <Clock className="text-sky" size={20} strokeWidth={2} />
            </div>
            <div className="text-right">
              <div className="text-3xl font-display text-warm-900">--</div>
              <div className="text-xs text-warm-400 font-medium tracking-wider uppercase mt-1">Hours</div>
            </div>
          </div>
          <div className="text-sm text-warm-600 font-medium mt-4">Focus Time This Week</div>
        </div>

        <div className="card p-6">
          <div className="flex items-start justify-between">
            <div className="p-3 bg-sage/10 rounded-2xl">
              <BarChart3 className="text-sage" size={20} strokeWidth={2} />
            </div>
            <div className="text-right">
              <div className="text-3xl font-display text-warm-900">--</div>
              <div className="text-xs text-warm-400 font-medium tracking-wider uppercase mt-1">Done</div>
            </div>
          </div>
          <div className="text-sm text-warm-600 font-medium mt-4">Tasks Completed</div>
        </div>
      </div>

      {/* Chart Placeholder */}
      <div className="card p-8 mb-8">
        <h3 className="font-display text-xl text-warm-900 mb-6">Productivity Trends</h3>
        <div className="h-48 flex items-end gap-2 px-4">
          {[40, 65, 45, 80, 55, 70, 90, 60, 75, 85, 50, 95].map((height, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-2">
              <div
                className="w-full bg-terra-100 rounded-t-lg transition-all duration-500 hover:bg-terra-300"
                style={{ height: `${height}%` }}
              />
              <span className="text-[10px] text-warm-400">
                {['J','F','M','A','M','J','J','A','S','O','N','D'][i]}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* AI Insights */}
      <div className="card p-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-display text-xl text-warm-900">AI Insights</h3>
          <button className="btn btn-primary text-sm inline-flex items-center gap-2 py-2.5 px-5 group">
            <Sparkles size={16} />
            Generate
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
        <div className="text-center py-10">
          <div className="w-14 h-14 bg-cream-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Sparkles size={24} className="text-warm-300" />
          </div>
          <p className="text-warm-600 font-medium mb-1">No insights yet</p>
          <p className="text-sm text-warm-400">Complete some tasks and focus sessions to generate AI insights</p>
        </div>
      </div>
    </div>
  );
}
