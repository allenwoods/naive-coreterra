import React, { useState, useEffect } from 'react';
import { getCalendarDays, formatDate } from '@/lib/dateUtils';
import { Card, CardContent } from '@/components/ui/card';
import { calendarAPI, type CalendarEvent } from '@/lib/api';

export const CalendarPage: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const calendarDays = getCalendarDays(year, month);

  useEffect(() => {
    const loadEvents = async () => {
      try {
        const loadedEvents = await calendarAPI.getEvents();
        setEvents(loadedEvents);
      } catch (error) {
        console.error('Failed to load calendar events:', error);
      }
    };
    loadEvents();
  }, []);

  const getEventsForDay = (day: number) => {
    return events.filter(e => e.date === day);
  };

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="flex-1 flex flex-col h-full bg-background-light overflow-hidden">
      <main className="flex flex-col flex-1 min-w-0 overflow-y-auto scroll-smooth relative">
        <div className="sticky top-0 z-10 bg-surface-light/95 backdrop-blur border-b border-border-color px-6 py-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-3">
                <h1 className="text-text-main text-3xl font-black leading-tight tracking-tight">
                  {formatDate(currentDate)}
                </h1>
                <span className="bg-primary/10 text-primary px-2.5 py-0.5 rounded text-xs font-bold uppercase tracking-wider border border-primary/20">
                  Focus Phase
                </span>
              </div>
              <div className="flex items-center gap-4 text-text-secondary text-sm mt-1">
                <div className="flex items-center gap-1.5">
                  <span className="size-2 rounded-full bg-red-500" />
                  <span className="text-xs font-bold uppercase tracking-wide">Deadline</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="size-2 rounded-full bg-blue-500" />
                  <span className="text-xs font-bold uppercase tracking-wide">Appointment</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="size-2 rounded-full border border-slate-300 border-dashed bg-slate-100" />
                  <span className="text-xs font-bold uppercase tracking-wide text-slate-500">Soft Block (Do Date)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex-1 flex">
          <div className="flex-1 p-6 min-h-[800px]">
            <div className="grid grid-cols-7 gap-px bg-border-color rounded-xl overflow-hidden border border-border-color shadow-sm h-full">
              {/* Week day headers */}
              {weekDays.map(day => (
                <div
                  key={day}
                  className="bg-surface-alt p-3 text-center text-xs font-bold text-text-secondary uppercase tracking-wider h-10 flex items-center justify-center"
                >
                  {day}
                </div>
              ))}

              {/* Calendar days */}
              {calendarDays.map((calDay, idx) => {
                const dayEvents = calDay.isCurrentMonth ? getEventsForDay(calDay.day) : [];
                const isToday = calDay.isCurrentMonth && calDay.day === new Date().getDate() && month === new Date().getMonth();
                const hasDeadline = dayEvents.some(e => e.type === 'deadline');

                return (
                  <div
                    key={idx}
                    className={`min-h-[140px] p-2 flex flex-col gap-1 group transition-colors ${
                      calDay.isCurrentMonth
                        ? hasDeadline
                          ? 'bg-red-50/20 ring-1 ring-inset ring-red-100'
                          : 'bg-surface-light hover:bg-primary-light/30'
                        : 'bg-surface-alt/50'
                    }`}
                  >
                    <span
                      className={`text-sm font-medium ml-1 ${
                        calDay.isCurrentMonth ? 'text-text-main' : 'text-text-secondary'
                      } ${isToday ? 'flex items-center justify-center size-7 rounded-full bg-red-500 text-white shadow-md shadow-red-500/30' : ''}`}
                    >
                      {calDay.day}
                    </span>

                    {dayEvents.map((event, eIdx) => (
                      <div
                        key={eIdx}
                        className={`${event.color} p-1.5 rounded border-l-2 ${event.border} cursor-pointer hover:opacity-80 transition-opacity shadow-sm ${
                          event.type === 'deadline' ? 'flex items-start gap-1' : ''
                        }`}
                      >
                        {event.type === 'deadline' && (
                          <span className="material-symbols-outlined text-[14px] text-red-700 mt-0.5">warning</span>
                        )}
                        <div>
                          {event.time && (
                            <p className="text-[10px] font-bold text-blue-800 uppercase tracking-wide">
                              {event.time}
                            </p>
                          )}
                          {event.type === 'deadline' && (
                            <p className="text-[10px] font-bold text-red-800 uppercase tracking-wide">Deadline</p>
                          )}
                          <p
                            className={`text-[11px] font-medium truncate ${
                              event.type === 'deadline'
                                ? 'text-red-900'
                                : event.type === 'appointment'
                                ? 'text-blue-900'
                                : 'text-slate-600'
                            }`}
                          >
                            {event.title}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Sidebar */}
          <aside className="w-80 bg-surface-light border-l border-border-color flex flex-col overflow-y-auto hidden xl:flex shrink-0 shadow-lg z-10">
            <div className="p-6 border-b border-border-color bg-slate-50">
              <h3 className="text-xs font-bold text-text-secondary uppercase tracking-wider mb-2">
                GTD Calendar Rules
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Only place items here that <strong>must</strong> happen on a specific day or time.
                <br />
                <br />
                Use "Soft Blocks" for tasks you'd <em>like</em> to do, but can move if necessary.
              </p>
            </div>
            <div className="p-6">
              <h3 className="text-text-secondary font-bold text-sm uppercase tracking-wider flex items-center gap-2 mb-4">
                Upcoming Hard Landscape
              </h3>
              <div className="flex flex-col gap-3">
                <div className="flex gap-3 items-start">
                  <div className="flex flex-col items-center min-w-[3rem] bg-red-50 border border-red-100 rounded-lg p-1">
                    <span className="text-xs font-bold text-red-600 uppercase">Oct</span>
                    <span className="text-lg font-bold text-slate-800">05</span>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-800">Q3 Financial Report</p>
                    <p className="text-xs text-red-500 font-medium">Critical Deadline</p>
                  </div>
                </div>
                <div className="flex gap-3 items-start">
                  <div className="flex flex-col items-center min-w-[3rem] bg-blue-50 border border-blue-100 rounded-lg p-1">
                    <span className="text-xs font-bold text-blue-600 uppercase">Oct</span>
                    <span className="text-lg font-bold text-slate-800">12</span>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-800">Board Meeting</p>
                    <p className="text-xs text-blue-500 font-medium">10:00 AM - 12:00 PM</p>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
};

