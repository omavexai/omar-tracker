import React, { useState, useEffect } from 'react';

export default function OmarTracker() {
  const [tasks, setTasks] = useState([]);
  const [view, setView] = useState('day');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [collapseMode, setCollapseMode] = useState(false);
  const [expandedTasks, setExpandedTasks] = useState({});

  const DAILY_QUOTES = {
    Sunday: { quote: "Structure isn't limitation. Structure is freedom—it frees your power.", theme: '🏗️ Routine' },
    Monday: { quote: "You have unlimited energy when the path is clear.", theme: '⚡ Ambition' },
    Tuesday: { quote: "Every brick looks small. Every cathedral looks impossible—until it's done.", theme: '🧱 Compound' },
    Wednesday: { quote: "VISA doesn't need superheroes. They need people like you—analytical, driven, clear.", theme: '🎯 Vision' },
    Thursday: { quote: "Every cold call is one step closer to your first client.", theme: '📞 Hustle' },
    Friday: { quote: "You won't feel it until you look back in 4 weeks.", theme: '📈 Perspective' },
    Saturday: { quote: "Burnout is feedback. Rest, rebuild, return stronger.", theme: '💪 Resilience' }
  };

  const FULL_SCHEDULE = {
    Sunday: [
      { id: 's1', name: 'Meal prep (2.5h)', category: 'health', details: 'Prep 5 weekday meals: protein + carb + veg.' },
      { id: 's2', name: 'Light stretching (15m)', category: 'health', details: 'Mobility work, recovery.' },
      { id: 's3', name: 'LinkedIn: Comment on 3 posts', category: 'career', details: 'Find posts from VISA/Amex/Mastercard. Leave thoughtful comments.' },
      { id: 's4', name: 'LinkedIn: Send 2 DMs', category: 'career', details: 'Message people you connected with. Ask about their role.' },
      { id: 's5', name: 'Review week + plan next', category: 'career', details: 'What worked? What was hard?' },
    ],
    Monday: [
      { id: 'm1', name: 'GYM (1h)', category: 'health', details: 'Strength + cardio. Your routine.' },
      { id: 'm2', name: 'Visa: Module 1 (30m)', category: 'career', details: 'Watch: Payment Network. Note: acquiring, issuing, interchange, payment rails.' },
      { id: 'm3', name: 'Visa: Quiz (15m)', category: 'career', details: 'Test your Module 1 knowledge.' },
      { id: 'm4', name: 'Side Hustle: Demos Video (20m)', category: 'hustle', details: 'Watch how to create demos.' },
      { id: 'm5', name: 'LinkedIn: Like & comment 2 posts', category: 'career', details: 'Stay visible in fintech community.' },
    ],
    Tuesday: [
      { id: 't1', name: 'SWIMMING (1h)', category: 'health', details: 'Full body, low impact.' },
      { id: 't2', name: 'Visa: Module 2 (30m)', category: 'career', details: 'Understand issuer role.' },
      { id: 't3', name: 'Side Hustle: Cold Calling Video (25m)', category: 'hustle', details: 'Watch + download scripts. Practice openings.' },
      { id: 't4', name: 'LinkedIn: Send 2 connections', category: 'career', details: 'Personalized: "Hi [Name], transitioning to fintech ops..."' },
      { id: 't5', name: 'LinkedIn: Post 1 insight', category: 'career', details: 'Share what you\'re learning.' },
    ],
    Wednesday: [
      { id: 'w1', name: 'GYM (1h)', category: 'health', details: 'Strength + cardio.' },
      { id: 'w2', name: 'Visa: Module 3 (30m)', category: 'career', details: 'Watch merchant side of payments.' },
      { id: 'w3', name: 'FinTech Article/Podcast (15m)', category: 'career', details: 'Read 1 article or listen to 15m.' },
      { id: 'w4', name: 'Side Hustle: Lead List Update (15m)', category: 'hustle', details: 'Add 10 new prospects.' },
      { id: 'w5', name: 'LinkedIn: Engage 1 post (10m)', category: 'career', details: 'Reply to someone\'s comment.' },
    ],
    Thursday: [
      { id: 'h1', name: 'SWIMMING (1h)', category: 'health', details: 'Full body recovery.' },
      { id: 'h2', name: 'Visa: Module 4 (30m)', category: 'career', details: 'Real-time transfers, digital wallets.' },
      { id: 'h3', name: 'Visa: Final Review (15m)', category: 'career', details: 'Review all modules.' },
      { id: 'h4', name: 'Side Hustle: Sales Review (20m)', category: 'hustle', details: 'Review masterclass + scripts.' },
      { id: 'h5', name: 'LinkedIn: Check profile views', category: 'career', details: 'Track fintech interest.' },
    ],
    Friday: [
      { id: 'f1', name: 'GYM (1h)', category: 'health', details: 'Final push of week.' },
      { id: 'f2', name: 'LinkedIn: Comment on 5 posts (15m)', category: 'career', details: 'Show engagement in fintech.' },
      { id: 'f3', name: 'Job Search (15m)', category: 'career', details: 'Check VISA/Amex/Mastercard careers.' },
      { id: 'f4', name: 'LinkedIn: Review connections', category: 'career', details: 'Count + track engagement.' },
      { id: 'f5', name: 'Side Hustle: Cold Call Prep (15m)', category: 'hustle', details: 'Plan calls for next week.' },
    ],
    Saturday: [
      { id: 'sa1', name: 'REST DAY', category: 'health', details: 'No structured work. Light stretching OK.' },
      { id: 'sa2', name: 'Weekly Reflection', category: 'career', details: 'What worked? What\'s next?' },
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
    health: '#dcfce7',
    career: '#dbeafe',
    hustle: '#f3e8ff',
  };

  const todaysTasks = getTodaysTasks();
  const dayName = getDayName(selectedDate);
  const dayQuote = DAILY_QUOTES[dayName];
  const weekData = getWeekData();
  const weekStats = getWeeklyStats();

  const styles = `
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: Arial, sans-serif; background: linear-gradient(to right, #f0f9ff, #e0e7ff); padding: 20px; }
    .container { max-width: 900px; margin: 0 auto; }
    .header { background: white; border-radius: 8px; padding: 20px; margin-bottom: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
    .header h1 { color: #1e3a8a; margin-bottom: 5px; font-size: 28px; }
    .header p { color: #666; font-size: 14px; }
    .tabs { display: flex; gap: 10px; margin-bottom: 20px; flex-wrap: wrap; }
    .tab-btn { padding: 12px 20px; border: 2px solid #dbeafe; background: white; color: #2563eb; border-radius: 6px; cursor: pointer; font-weight: bold; font-size: 14px; }
    .tab-btn.active { background: #2563eb; color: white; }
    .mode-btn { padding: 12px 20px; border: 2px solid #fed7aa; background: white; color: #ea580c; border-radius: 6px; cursor: pointer; font-weight: bold; font-size: 14px; margin-left: auto; }
    .mode-btn.active { background: #ea580c; color: white; }
    .card { background: white; border-radius: 8px; padding: 20px; margin-bottom: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
    .date-control { display: flex; gap: 10px; align-items: center; margin-bottom: 15px; }
    .date-control button { padding: 8px 16px; background: #f3f4f6; border: none; border-radius: 6px; cursor: pointer; font-weight: bold; }
    .date-control input { padding: 8px; border: 2px solid #dbeafe; border-radius: 6px; text-align: center; font-weight: bold; }
    .day-name { font-size: 24px; font-weight: bold; color: #1e3a8a; text-align: center; flex: 1; }
    .quote { background: linear-gradient(to right, #f3e8ff, #fce7f3); border-left: 4px solid #a855f7; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
    .quote-theme { font-size: 12px; font-weight: bold; color: #7e22ce; text-transform: uppercase; margin-bottom: 8px; }
    .quote-text { font-size: 16px; font-style: italic; color: #333; }
    .task { border: 2px solid #ddd; border-radius: 6px; padding: 0; margin-bottom: 10px; overflow: hidden; }
    .task-button { width: 100%; display: flex; align-items: center; gap: 15px; padding: 15px; text-align: left; cursor: pointer; background: none; border: none; font-size: 14px; }
    .task-button:hover { opacity: 0.8; }
    .task-checkbox { font-size: 20px; flex-shrink: 0; }
    .task-name { flex: 1; font-weight: bold; min-width: 0; }
    .task-name.done { text-decoration: line-through; color: #999; }
    .task-expand { font-size: 18px; cursor: pointer; flex-shrink: 0; transition: transform 0.2s; }
    .task-expand.expanded { transform: rotate(180deg); }
    .task-details { padding: 10px 15px 15px 50px; border-top: 1px solid rgba(0,0,0,0.1); font-size: 13px; color: #666; background: rgba(0,0,0,0.02); }
    .progress-bar { width: 100%; height: 12px; background: #ddd; border-radius: 6px; overflow: hidden; margin: 10px 0; }
    .progress-fill { height: 100%; background: linear-gradient(to right, #10b981, #3b82f6); transition: width 0.3s; }
    .stats { display: grid; grid-cols-1 md:grid-cols-2 gap: 10px; margin-bottom: 20px; }
    .stat-box { background: white; padding: 15px; border-left: 4px solid #2563eb; border-radius: 6px; }
    .stat-label { font-size: 13px; color: #666; margin-bottom: 5px; }
    .stat-value { font-size: 20px; font-weight: bold; color: #1e3a8a; }
    .footer { background: linear-gradient(to right, #2563eb, #4f46e5); color: white; padding: 20px; border-radius: 8px; text-align: center; }
    .footer p { margin: 5px 0; }
    @media (max-width: 600px) { .container { padding: 0 10px; } .header h1 { font-size: 20px; } }
  `;

  return (
    <div>
      <style>{styles}</style>
      <div className="container">
        <div className="header">
          <h1>🎯 Omar's Daily Companion</h1>
          <p>Health • Career • Side Hustle | Oct 18 Countdown</p>
        </div>

        <div className="tabs">
          <button className={`tab-btn ${view === 'day' ? 'active' : ''}`} onClick={() => setView('day')}>📅 Today</button>
          <button className={`tab-btn ${view === 'week' ? 'active' : ''}`} onClick={() => setView('week')}>📊 Week</button>
          <button className={`mode-btn ${collapseMode ? 'active' : ''}`} onClick={() => setCollapseMode(!collapseMode)}>{collapseMode ? '🚨 Burnout' : 'Mode'}</button>
        </div>

        {view === 'day' && (
          <div>
            <div className="card">
              <div className="date-control">
                <button onClick={handlePrevDay}>← Prev</button>
                <div className="day-name">{dayName}</div>
                <button onClick={handleNextDay}>Next →</button>
              </div>
              <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} style={{ width: '100%', marginBottom: '10px' }} />
              <button onClick={handleToday} style={{ width: '100%', padding: '10px', background: '#dbeafe', color: '#2563eb', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>🎯 Go to Today</button>
            </div>

            {dayQuote && (
              <div className="quote">
                <div className="quote-theme">{dayQuote.theme}</div>
                <div className="quote-text">"{dayQuote.quote}"</div>
              </div>
            )}

            <div className="card">
              {todaysTasks.length === 0 ? (
                <p style={{ textAlign: 'center', color: '#999', padding: '30px' }}>✨ No tasks. Rest well.</p>
              ) : (
                <div>
                  {todaysTasks.map((task) => (
                    <div key={task.id} className="task" style={{ backgroundColor: categoryColors[task.category] }}>
                      <button className="task-button" onClick={() => toggleTask(task.id)}>
                        <span className="task-checkbox">{isTaskComplete(task.id) ? '✅' : '⭕'}</span>
                        <span className={`task-name ${isTaskComplete(task.id) ? 'done' : ''}`}>{task.name}</span>
                        <span className={`task-expand ${expandedTasks[task.id] ? 'expanded' : ''}`} onClick={(e) => { e.stopPropagation(); toggleExpand(task.id); }}>▼</span>
                      </button>
                      {expandedTasks[task.id] && <div className="task-details">{task.details}</div>}
                    </div>
                  ))}
                  <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '2px solid #ddd' }}>
                    <p style={{ fontSize: '14px', fontWeight: 'bold', color: '#666', marginBottom: '10px' }}>TODAY: {todaysTasks.filter((t) => isTaskComplete(t.id)).length} / {todaysTasks.length} done</p>
                    <div className="progress-bar">
                      <div className="progress-fill" style={{ width: `${todaysTasks.length > 0 ? Math.round((todaysTasks.filter((t) => isTaskComplete(t.id)).length / todaysTasks.length) * 100) : 0}%` }}></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {view === 'week' && (
          <div>
            <div className="card">
              <h2 style={{ color: '#1e3a8a', marginBottom: '10px' }}>📈 Weekly Progress</h2>
              <p style={{ color: '#666', marginBottom: '10px', fontWeight: 'bold' }}>{weekStats.completedTasks} / {weekStats.totalTasks} tasks completed</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
                <div className="progress-bar" style={{ flex: 1 }}>
                  <div className="progress-fill" style={{ width: `${weekStats.percentage}%` }}></div>
                </div>
                <span style={{ fontSize: '24px', fontWeight: 'bold', color: '#10b981' }}>{weekStats.percentage}%</span>
              </div>
            </div>

            <div className="stats">
              {weekData.map((day) => (
                <div key={day.day} className="stat-box" style={{ cursor: 'pointer' }} onClick={() => { setView('day'); setSelectedDate(day.date); }}>
                  <p style={{ fontSize: '16px', fontWeight: 'bold', color: '#333', marginBottom: '8px' }}>{day.day}</p>
                  <p style={{ fontSize: '14px', color: '#666' }}>{day.completed} / {day.total}</p>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${day.percentage}%` }}></div>
                  </div>
                  <p style={{ fontSize: '12px', color: '#999', marginTop: '5px' }}>{day.percentage}% done</p>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="footer">
          <p style={{ fontSize: '18px', fontWeight: 'bold' }}>💪 Remember</p>
          <p>Missing 1 task = 98% compliance = WINNING</p>
        </div>
      </div>
    </div>
  );
}
