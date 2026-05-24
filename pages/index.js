import React, { useState, useEffect } from 'react';
import { CheckCircle2, Circle, TrendingUp, AlertCircle, Zap } from 'lucide-react';

export default function OmarTrackerDeployed() {
  const [tasks, setTasks] = useState([]);
  const [view, setView] = useState('day');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [collapseMode, setCollapseMode] = useState(false);
  const [expandedTasks, setExpandedTasks] = useState({});
  const [syncStatus, setSyncStatus] = useState('✅ Auto-saved');

  const DAILY_QUOTES = {
    Sunday: { quote: "Structure isn't limitation. Structure is freedom—it frees your power.", theme: '🏗️ Routine' },
    Monday: { quote: "You have unlimited energy when the path is clear.", theme: '⚡ Ambition' },
    Tuesday: { quote: "Every brick looks small. Every cathedral looks impossible—until it's done.", theme: '🧱 Compound' },
    Wednesday: { quote: "VISA doesn't need superheroes. They need people like you—analytical, driven, clear.", theme: '🎯 Vision' },
    Thursday: { quote: "Every cold call is one step closer to your first client. Every 'no' is a yes you didn't waste time on.", theme: '📞 Hustle' },
    Friday: { quote: "You won't feel the weight of this week until you look back in 4 weeks. Then you'll see it.", theme: '📈 Perspective' },
    Saturday: { quote: "Burnout is not failure. It's feedback. Rest, rebuild, return stronger.", theme: '💪 Resilience' }
  };

  const FULL_SCHEDULE = {
    Sunday: [
      { id: 's1', name: 'Meal prep (2.5h)', category: 'health', details: 'Prep 5 weekday meals: protein + carb + veg.' },
      { id: 's2', name: 'Light stretching (15m)', category: 'health', details: 'Mobility work, recovery.' },
      { id: 's3', name: 'LinkedIn: Comment on 3 fintech posts', category: 'career', details: 'Find posts from VISA/Amex/Mastercard. Leave thoughtful comments (not just "great post").' },
      { id: 's4', name: 'LinkedIn: Send 2 personalized DMs', category: 'career', details: 'Message people you connected with this week. Ask about their role/experience.' },
      { id: 's5', name: 'Review week + plan next', category: 'career', details: 'What worked? What was hard? Update tracker.' },
    ],
    Monday: [
      { id: 'm1', name: 'GYM (1h)', category: 'health', details: 'Strength + cardio. Your routine.' },
      { id: 'm2', name: 'Visa: Module 1 - Payment Network (30m)', category: 'career', details: 'Watch + note: acquiring, issuing, interchange, payment rails.' },
      { id: 'm3', name: 'Visa: Quiz (15m)', category: 'career', details: 'Test your Module 1 knowledge.' },
      { id: 'm4', name: 'Side Hustle: Client Acq - Demos Video (20m)', category: 'hustle', details: 'Watch how to create demos. Download template.' },
      { id: 'm5', name: 'LinkedIn: Like & comment on 2 posts', category: 'career', details: 'Stay visible in fintech community.' },
    ],
    Tuesday: [
      { id: 't1', name: 'SWIMMING (1h)', category: 'health', details: 'Full body, low impact.' },
      { id: 't2', name: 'Visa: Module 2 - Issuing Banks (30m)', category: 'career', details: 'Understand issuer role.' },
      { id: 't3', name: 'Side Hustle: Cold Calling Video (25m)', category: 'hustle', details: 'Watch + download scripts. Practice openings.' },
      { id: 't4', name: 'LinkedIn: Send 2 connection requests', category: 'career', details: 'Personalized: "Hi [Name], I\'m transitioning to fintech ops..."' },
      { id: 't5', name: 'LinkedIn: Update 1 post with fintech insight', category: 'career', details: 'Share what you\'re learning (e.g., "Just learned about payment rails...")' },
    ],
    Wednesday: [
      { id: 'w1', name: 'GYM (1h)', category: 'health', details: 'Strength + cardio.' },
      { id: 'w2', name: 'Visa: Module 3 - Acquiring Banks (30m)', category: 'career', details: 'Watch merchant side of payments.' },
      { id: 'w3', name: 'FinTech Article or Podcast (15m)', category: 'career', details: 'Read 1 article or listen to 15m podcast.' },
      { id: 'w4', name: 'Side Hustle: Lead List Update (15m)', category: 'hustle', details: 'Add 10 new prospects from scraper.' },
      { id: 'w5', name: 'LinkedIn: Engage on 1 VISA/Amex post (10m)', category: 'career', details: 'Reply to someone\'s comment. Start a conversation.' },
    ],
    Thursday: [
      { id: 'h1', name: 'SWIMMING (1h)', category: 'health', details: 'Full body recovery.' },
      { id: 'h2', name: 'Visa: Module 4 - Digital Payments (30m)', category: 'career', details: 'Real-time transfers, digital wallets.' },
      { id: 'h3', name: 'Visa: Final Review (15m)', category: 'career', details: 'Review all modules. Solidify vocab.' },
      { id: 'h4', name: 'Side Hustle: Sales Section Review (20m)', category: 'hustle', details: 'Review sales masterclass + scripts.' },
      { id: 'h5', name: 'LinkedIn: Check who viewed your profile', category: 'career', details: 'Track which fintech people are interested. Note their companies.' },
    ],
    Friday: [
      { id: 'f1', name: 'GYM (1h)', category: 'health', details: 'Final push of week.' },
      { id: 'f2', name: 'LinkedIn: Comment on 5 industry posts (15m)', category: 'career', details: 'Show you\'re engaged + learning in the space.' },
      { id: 'f3', name: 'Job Search: Check VISA/Amex/Mastercard careers (15m)', category: 'career', details: 'Bookmark new openings. Note job titles/requirements.' },
      { id: 'f4', name: 'LinkedIn: Review connections made this week', category: 'career', details: 'Count connections, track engagement. Plan next week\'s strategy.' },
      { id: 'f5', name: 'Side Hustle: Cold Call Prep (15m)', category: 'hustle', details: 'Plan calls for next week. Review scripts.' },
    ],
    Saturday: [
      { id: 'sa1', name: 'REST DAY', category: 'health', details: 'No structured work. Light stretching OK.' },
      { id: 'sa2', name: 'Weekly Reflection', category: 'career', details: 'What worked? LinkedIn connections? Courses progressing?' },
    ]
  };

  const COLLAPSE_SCHEDULE = {
    Sunday: [{ id: 's1', name: 'Meal prep (2.5h)', category: 'health', details: 'Only task today.' }],
    Monday: [{ id: 'm1', name: 'GYM (30m light)', category: 'health', details: 'Light, no pressure.' }],
    Tuesday: [{ id: 't4', name: 'LinkedIn: 1 connection (5m)', category: 'career', details: 'Quality over quantity.' }],
    Wednesday: [{ id: 'w2', name: 'Career study (15m)', category: 'career', details: 'Podcast or article.' }],
    Thursday: [],
    Friday: [],
    Saturday: [],
  };

  const schedule = collapseMode ? COLLAPSE_SCHEDULE : FULL_SCHEDULE;

  useEffect(() => {
    const saved = localStorage.getItem('omarTasksData');
    if (saved) {
      try {
        setTasks(JSON.parse(saved));
      } catch (e) {
        console.log('Could not load saved data');
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('omarTasksData', JSON.stringify(tasks));
    setSyncStatus('✅ Auto-saved');
    setTimeout(() => setSyncStatus('✅ Auto-saved'), 2000);
  }, [tasks]);

  const getDayName = (dateStr) => {
    const date = new Date(dateStr + 'T00:00:00');
    return ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][date.getDay()];
  };

  const getTodaysTasks = () => {
    const dayName = getDayName(selectedDate);
    return schedule[dayName] || [];
  };

  const toggleTask = (taskId) => {
    const key = `${selectedDate}_${taskId}`;
    setTasks((prev) => (prev.includes(key) ? prev.filter((t) => t !== key) : [...prev, key]));
  };

  const toggleExpand = (taskId) => {
    setExpandedTasks((prev) => ({ ...prev, [taskId]: !prev[taskId] }));
  };

  const isTaskComplete = (taskId) => {
    return tasks.includes(`${selectedDate}_${taskId}`);
  };

  const getWeekData = () => {
    const today = new Date(selectedDate);
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());

    const weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return weekDays.map((day, idx) => {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + idx);
      const dateStr = date.toISOString().split('T')[0];
      const dayTasks = schedule[day] || [];
      const completedCount = dayTasks.filter((t) => tasks.includes(`${dateStr}_${t.id}`)).length;
      return {
        day,
        date: dateStr,
        total: dayTasks.length,
        completed: completedCount,
        percentage: dayTasks.length > 0 ? Math.round((completedCount / dayTasks.length) * 100) : 0,
      };
    });
  };

  const getWeeklyStats = () => {
    const weekData = getWeekData();
    const totalTasks = weekData.reduce((sum, d) => sum + d.total, 0);
    const completedTasks = weekData.reduce((sum, d) => sum + d.completed, 0);
    return { totalTasks, completedTasks, percentage: totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0 };
  };

  const handlePrevDay = () => {
    const date = new Date(selectedDate);
    date.setDate(date.getDate() - 1);
    setSelectedDate(date.toISOString().split('T')[0]);
  };

  const handleNextDay = () => {
    const date = new Date(selectedDate);
    date.setDate(date.getDate() + 1);
    setSelectedDate(date.toISOString().split('T')[0]);
  };

  const handleToday = () => {
    setSelectedDate(new Date().toISOString().split('T')[0]);
  };

  const categoryColors = {
    health: 'bg-green-50 border-green-300',
    career: 'bg-blue-50 border-blue-300',
    hustle: 'bg-purple-50 border-purple-300',
  };

  const categoryBadges = {
    health: 'bg-green-100 text-green-800',
    career: 'bg-blue-100 text-blue-800',
    hustle: 'bg-purple-100 text-purple-800',
  };

  const todaysTasks = getTodaysTasks();
  const dayName = getDayName(selectedDate);
  const dayQuote = DAILY_QUOTES[dayName];
  const weekData = getWeekData();
  const weekStats = getWeeklyStats();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 pb-20">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-4">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-3xl font-bold text-blue-900">🎯 Omar's Daily Companion</h1>
            <div className="text-xs font-bold text-green-600 flex items-center gap-1">
              <Zap className="w-4 h-4" /> {syncStatus}
            </div>
          </div>
          <p className="text-gray-600 text-sm">Health • Career • Side Hustle | Oct 18 Countdown</p>
        </div>

        {collapseMode && (
          <div className="bg-orange-50 border-2 border-orange-300 rounded-lg p-4 mb-6 flex items-start gap-3">
            <AlertCircle className="w-6 h-6 text-orange-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-bold text-orange-900">🚨 Burnout Mode: 50% Routine</p>
              <p className="text-sm text-orange-800">Recovering. Come back stronger.</p>
            </div>
          </div>
        )}

        <div className="flex gap-2 mb-6 flex-wrap">
          <button
            onClick={() => setView('day')}
            className={`px-6 py-3 rounded-lg font-bold transition text-sm ${
              view === 'day'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-blue-600 border-2 border-blue-200 hover:bg-blue-50'
            }`}
          >
            📅 Today
          </button>
          <button
            onClick={() => setView('week')}
            className={`px-6 py-3 rounded-lg font-bold transition text-sm ${
              view === 'week'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-blue-600 border-2 border-blue-200 hover:bg-blue-50'
            }`}
          >
            📊 Week
          </button>
          <button
            onClick={() => setCollapseMode(!collapseMode)}
            className={`px-6 py-3 rounded-lg font-bold transition ml-auto text-sm ${
              collapseMode
                ? 'bg-orange-600 text-white'
                : 'bg-white text-orange-600 border-2 border-orange-200 hover:bg-orange-50'
            }`}
          >
            {collapseMode ? '🚨 Burnout' : 'Mode'}
          </button>
        </div>

        {view === 'day' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center justify-between gap-4 mb-4">
                <button onClick={handlePrevDay} className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 font-bold text-sm">
                  ← Prev
                </button>
                <div className="text-center flex-1">
                  <p className="text-3xl font-bold text-blue-900">{dayName}</p>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="mt-2 px-4 py-2 border-2 border-blue-300 rounded-lg text-center font-semibold text-sm"
                  />
                </div>
                <button onClick={handleNextDay} className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 font-bold text-sm">
                  Next →
                </button>
              </div>
              <button onClick={handleToday} className="w-full px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 font-bold text-sm">
                🎯 Go to Today
              </button>
            </div>

            {dayQuote && (
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg shadow-lg p-6 border-l-4 border-purple-500">
                <p className="text-xs font-bold text-purple-600 uppercase tracking-wide mb-2">{dayQuote.theme}</p>
                <p className="text-base italic text-gray-800">"{dayQuote.quote}"</p>
              </div>
            )}

            <div className="bg-white rounded-lg shadow-lg p-6">
              {todaysTasks.length === 0 ? (
                <p className="text-gray-600 text-center py-12 text-lg">✨ No tasks. Rest well.</p>
              ) : (
                <div className="space-y-3">
                  {todaysTasks.map((task) => (
                    <div key={task.id} className={`border-2 rounded-lg overflow-hidden transition ${categoryColors[task.category]}`}>
                      <button
                        onClick={() => toggleTask(task.id)}
                        className="w-full flex items-center gap-4 p-4 text-left hover:opacity-80 transition"
                      >
                        {isTaskComplete(task.id) ? (
                          <CheckCircle2 className="w-6 h-6 flex-shrink-0 text-green-600" />
                        ) : (
                          <Circle className="w-6 h-6 flex-shrink-0 text-gray-400" />
                        )}
                        <div className="flex-1 min-w-0">
                          <p className={`font-bold text-sm sm:text-base ${isTaskComplete(task.id) ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                            {task.name}
                          </p>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleExpand(task.id);
                          }}
                          className={`text-xl transition flex-shrink-0 ${expandedTasks[task.id] ? 'rotate-180' : ''}`}
                        >
                          ▼
                        </button>
                      </button>
                      {expandedTasks[task.id] && (
                        <div className="px-4 pb-4 pt-2 border-t-2 border-current border-opacity-20 bg-opacity-50">
                          <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">{task.details}</p>
                        </div>
                      )}
                    </div>
                  ))}

                  <div className="mt-6 pt-6 border-t-2 border-gray-200">
                    <p className="text-xs sm:text-sm font-bold text-gray-600 mb-3">
                      TODAY: {todaysTasks.filter((t) => isTaskComplete(t.id)).length} / {todaysTasks.length} done
                    </p>
                    <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-green-500 to-blue-600 h-3 transition-all"
                        style={{
                          width: `${
                            todaysTasks.length > 0
                              ? Math.round((todaysTasks.filter((t) => isTaskComplete(t.id)).length / todaysTasks.length) * 100)
                              : 0
                          }%`,
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {view === 'week' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-blue-900">Weekly Progress</h2>
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                  <span className="text-3xl font-bold text-green-600">{weekStats.percentage}%</span>
                </div>
              </div>
              <p className="text-gray-600 mb-4 font-semibold">
                {weekStats.completedTasks} / {weekStats.totalTasks} tasks completed
              </p>
              <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-green-500 via-blue-500 to-purple-600 h-4 transition-all"
                  style={{ width: `${weekStats.percentage}%` }}
                ></div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {weekData.map((day) => (
                <button
                  key={day.day}
                  onClick={() => {
                    setView('day');
                    setSelectedDate(day.date);
                  }}
                  className="bg-white rounded-lg shadow hover:shadow-lg transition text-left cursor-pointer border-l-4 border-blue-600 p-5 hover:bg-blue-50"
                >
                  <p className="font-bold text-gray-900">{day.day}</p>
                  <p className="text-xs sm:text-sm text-gray-600 mt-2 font-semibold">
                    {day.completed} / {day.total}
                  </p>
                  <div className="mt-3 w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2" style={{ width: `${day.percentage}%` }}></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">{day.percentage}%</p>
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="mt-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg shadow-lg p-6 text-center text-white">
          <p className="text-lg font-bold mb-2">💪 Remember</p>
          <p className="text-sm">Missing 1 task = 98% compliance = WINNING</p>
        </div>
      </div>
    </div>
  );
}
