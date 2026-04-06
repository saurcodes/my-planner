import { Target, Play, Shield, Timer, ArrowRight } from 'lucide-react';

export default function Focus() {
  return (
    <div className="animate-fade-in-up">
      <div className="mb-10">
        <h1 className="text-4xl md:text-5xl font-display text-warm-900 mb-2">Focus Mode</h1>
        <p className="text-warm-500">Deep work sessions with distraction blocking</p>
      </div>

      {/* Focus Timer Card */}
      <div className="card p-10 text-center mb-8">
        <div className="w-48 h-48 rounded-full border-4 border-cream-300 flex items-center justify-center mx-auto mb-8 relative">
          <div className="absolute inset-2 rounded-full border-2 border-dashed border-terra-200 animate-[spin_30s_linear_infinite]" />
          <div className="text-center">
            <div className="text-5xl font-display text-warm-900">25:00</div>
            <div className="text-xs text-warm-400 font-medium tracking-wider uppercase mt-1">minutes</div>
          </div>
        </div>
        <button className="btn btn-primary inline-flex items-center gap-3 px-10 py-4 text-base group">
          <Play size={20} fill="currentColor" />
          Start Focus Session
          <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="card p-6 hover:shadow-card-hover transition-all duration-300">
          <div className="p-3 bg-terra-50 rounded-2xl w-fit mb-4">
            <Timer className="text-terra-500" size={20} strokeWidth={2} />
          </div>
          <h3 className="font-display text-lg text-warm-900 mb-1">Pomodoro Timer</h3>
          <p className="text-warm-500 text-sm leading-relaxed">
            Work in focused 25-minute intervals with structured breaks.
          </p>
        </div>

        <div className="card p-6 hover:shadow-card-hover transition-all duration-300">
          <div className="p-3 bg-sky/10 rounded-2xl w-fit mb-4">
            <Shield className="text-sky" size={20} strokeWidth={2} />
          </div>
          <h3 className="font-display text-lg text-warm-900 mb-1">Site Blocking</h3>
          <p className="text-warm-500 text-sm leading-relaxed">
            Block distracting websites during your focus sessions.
          </p>
        </div>

        <div className="card p-6 hover:shadow-card-hover transition-all duration-300">
          <div className="p-3 bg-sage/10 rounded-2xl w-fit mb-4">
            <Target className="text-sage" size={20} strokeWidth={2} />
          </div>
          <h3 className="font-display text-lg text-warm-900 mb-1">Task Linking</h3>
          <p className="text-warm-500 text-sm leading-relaxed">
            Link focus sessions to specific tasks for better tracking.
          </p>
        </div>
      </div>
    </div>
  );
}
