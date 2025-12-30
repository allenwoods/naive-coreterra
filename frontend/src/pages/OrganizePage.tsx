import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useDragAndDrop } from '@/hooks/useDragAndDrop';
import { DragDropZone } from '@/components/features/DragDropZone';

export const OrganizePage: React.FC = () => {
  const { tasks, projects, updateTask } = useApp();
  const [activeTab, setActiveTab] = useState('taskType');
  const clarifiedItems = tasks.filter(t => t.status === 'clarified');
  const { handleDragStart, handleDragOver, handleDragLeave, handleDrop, handleDragEnd } = useDragAndDrop();

  // Mock team members data
  const teamMembers = [
    { id: 1, name: 'Sarah Jenkins', role: 'Frontend', status: 'Available', capacity: 35, avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026024d' },
    { id: 2, name: 'Michael Chen', role: 'QA Lead', status: 'Busy', capacity: 95, avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704d' },
    { id: 3, name: 'Alex Morgan', role: 'Designer', status: 'Available', capacity: 20, avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCgLMjW8x240sh1Nfc2eziuKKztJOrS-snZX06O9Lu5dhonyIdfyB46tBZci1ByjltDkNwid3pE1RQpLhDIWXXNSGX7FH0jqq63r32Lnl5lzqLmLo0f891UaFnE3zYD_RFbuDZDC31Hqz0GZIX817qCiSx5ituryOweosJzbhd0Vc5ARdOHunhX-y4J1FWQ-6JnFSa2ghdmRyjYLakFeB-r3j6Ks2fzaMWK8ILuCpYjQhl6plwe7nG3l-9JVk8YVIVtPkXcQBA1Fsw' },
  ];

  const unassignedTasks = tasks.filter(t => !t.assigneeId && t.status !== 'completed' && t.status !== 'trash');

  const handleTaskDrop = async (item: any, targetId: string) => {
    if (targetId.startsWith('project-')) {
      const projectId = targetId.replace('project-', '');
      await updateTask(item.id, { projectId, status: 'organized' });
    } else if (targetId.startsWith('context-')) {
      const contextId = targetId.replace('context-', '');
      await updateTask(item.id, { contextId, status: 'organized' });
    } else if (targetId.startsWith('schedule-')) {
      await updateTask(item.id, { status: 'scheduled' });
    } else if (targetId.startsWith('member-')) {
      const memberId = parseInt(targetId.replace('member-', ''));
      await updateTask(item.id, { assigneeId: memberId, status: 'organized' });
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden relative bg-slate-50/50">
      <div className="flex-none px-6 md:px-10 py-3 bg-white border-b border-border-color shadow-sm z-10">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full lg:w-auto">
            <TabsList>
              <TabsTrigger value="taskType" className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px]">category</span>
                Board View
              </TabsTrigger>
              <TabsTrigger value="projects" className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px]">rocket_launch</span>
                Projects
              </TabsTrigger>
              <TabsTrigger value="assignee" className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px]">group</span>
                Assignee
              </TabsTrigger>
            </TabsList>
          </Tabs>
          <div className="relative w-full lg:w-96 group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="material-symbols-outlined text-slate-400 text-[20px]">search</span>
            </div>
            <Input
              className="block w-full pl-10 pr-3 py-2 border border-slate-200 rounded-lg bg-slate-50 text-text-main placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary sm:text-sm transition-all"
              placeholder="Search tasks..."
            />
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 md:p-10 bg-slate-50/50">
        <div className="max-w-7xl mx-auto h-full">
          {activeTab === 'taskType' && (
            <div className="flex flex-col h-full gap-6 pb-6">
              <div className="flex-none bg-slate-100/50 p-4 rounded-xl border border-dashed border-slate-300">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
                    <span className="material-symbols-outlined text-lg">style</span>
                    Unsorted Deck
                  </h3>
                  <span className="bg-primary text-white text-xs font-bold px-2 py-0.5 rounded-full">
                    {clarifiedItems.length}
                  </span>
                </div>
                {clarifiedItems.length === 0 ? (
                  <div className="text-center py-8 text-slate-400 text-sm">All cleared! Great job.</div>
                ) : (
                  <div className="flex gap-4 overflow-x-auto pb-2">
                    {clarifiedItems.map(item => (
                      <Card
                        key={item.id}
                        className="flex-none w-72 cursor-grab active:cursor-grabbing"
                        draggable
                        onDragStart={(e) => handleDragStart(e, item)}
                        onDragEnd={handleDragEnd}
                      >
                        <CardContent className="p-4 flex flex-col gap-2">
                          <div className="flex justify-between items-start">
                            <h4 className="font-bold text-slate-800 text-sm leading-tight">{item.title}</h4>
                            <span className="material-symbols-outlined text-slate-300">drag_indicator</span>
                          </div>
                          <div className="flex flex-wrap gap-2 mt-auto">
                            <span className="text-slate-500 text-[10px] bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
                              {item.estimatedTime || 'N/A'}
                            </span>
                            <span className="text-slate-500 text-[10px] bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
                              {item.difficulty || 'Med'}
                            </span>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-6 min-h-0">
                <Card className="bg-blue-50/30 border border-blue-100/50">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 font-bold text-blue-800">
                        <span className="material-symbols-outlined">rocket_launch</span>
                        Projects
                      </div>
                      <Button variant="ghost" size="icon" className="size-6">
                        <span className="material-icons-round text-sm">add</span>
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex-1 overflow-y-auto space-y-3">
                      {projects.map(p => (
                        <DragDropZone
                          key={p.id}
                          id={`project-${p.id}`}
                          onDrop={(item) => handleTaskDrop(item, `project-${p.id}`)}
                          className="bg-white rounded-lg border border-blue-100 shadow-sm hover:shadow-md transition-all cursor-pointer group"
                        >
                          <CardContent className="p-3">
                            <div className="flex justify-between items-start">
                              <span className="text-sm font-bold text-slate-700 group-hover:text-blue-700">{p.title}</span>
                              <span className="text-[10px] bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded">
                                {Math.round((p.completedTasks / p.totalTasks) * 100)}%
                              </span>
                            </div>
                            <p className="text-xs text-slate-500 mt-1">{p.totalTasks - p.completedTasks} pending</p>
                          </CardContent>
                        </DragDropZone>
                      ))}
                      <DragDropZone
                        id="project-misc"
                        onDrop={(item) => handleTaskDrop(item, 'project-misc')}
                        className="bg-white/50 border-2 border-dashed border-blue-200 p-3 rounded-xl text-center text-blue-400 text-sm font-bold cursor-pointer hover:bg-white hover:border-blue-300 transition-all"
                      >
                        Miscellaneous
                      </DragDropZone>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-purple-50/30 border border-purple-100/50">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 font-bold text-purple-800">
                        <span className="material-symbols-outlined">bookmark</span>
                        Contexts
                      </div>
                      <Button variant="ghost" size="icon" className="size-6">
                        <span className="material-icons-round text-sm">add</span>
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex-1 overflow-y-auto space-y-3">
                      {['@Computer', '@Office', '@Home', '@Errands', 'Thinking', 'Waiting For'].map(ctx => (
                        <DragDropZone
                          key={ctx}
                          id={`context-${ctx}`}
                          onDrop={(item) => handleTaskDrop(item, `context-${ctx}`)}
                          className="bg-white rounded-lg border border-purple-100 shadow-sm hover:shadow-md transition-all cursor-pointer group"
                        >
                          <CardContent className="p-3">
                            <span className="text-sm font-bold text-slate-700 group-hover:text-purple-700">{ctx}</span>
                          </CardContent>
                        </DragDropZone>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-orange-50/30 border border-orange-100/50">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 font-bold text-orange-800">
                        <span className="material-symbols-outlined">calendar_clock</span>
                        Scheduled
                      </div>
                      <Button variant="ghost" size="icon" className="size-6">
                        <span className="material-icons-round text-sm">add</span>
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex-1 overflow-y-auto space-y-3">
                      {['Today', 'Tomorrow', 'This Week', 'Next Week', 'Someday'].map(time => (
                        <DragDropZone
                          key={time}
                          id={`schedule-${time}`}
                          onDrop={(item) => handleTaskDrop(item, `schedule-${time}`)}
                          className="bg-white rounded-lg border border-orange-100 shadow-sm hover:shadow-md transition-all cursor-pointer group"
                        >
                          <CardContent className="p-3">
                            <span className="text-sm font-bold text-slate-700 group-hover:text-orange-700">{time}</span>
                          </CardContent>
                        </DragDropZone>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {activeTab === 'projects' && (
            <div className="flex flex-col gap-6 h-full overflow-y-auto pb-10">
              {/* Project Timeline */}
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center mb-4">
                    <CardTitle className="text-sm font-bold uppercase tracking-wider flex items-center gap-2">
                      <span className="material-symbols-outlined text-primary text-lg">timeline</span>
                      Project Timeline
                    </CardTitle>
                    <div className="flex gap-2 text-[10px] font-bold uppercase text-text-secondary">
                      <span className="px-2 py-1 bg-slate-100 rounded">Oct</span>
                      <span className="px-2 py-1 bg-slate-100 rounded">Nov</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <div className="min-w-[400px] flex flex-col gap-4">
                      <div className="flex justify-between pl-24 text-xs font-mono text-text-secondary border-b border-dashed border-slate-200 pb-2">
                        <span>10/10</span>
                        <span>17/10</span>
                        <span>24/10</span>
                        <span>31/10</span>
                      </div>
                      {projects.map((project, idx) => (
                        <div key={project.id} className="relative h-10 flex items-center group">
                          <div className="w-24 shrink-0 text-xs font-bold text-slate-700 leading-tight">
                            {project.title}
                          </div>
                          <div className="flex-1 relative h-6 bg-slate-50 rounded-lg mx-2 border border-slate-100 overflow-hidden">
                            <div className="absolute inset-0 flex justify-between px-0 opacity-20">
                              <div className="w-px h-full bg-slate-400" />
                              <div className="w-px h-full bg-slate-400" />
                              <div className="w-px h-full bg-slate-400" />
                              <div className="w-px h-full bg-slate-400" />
                            </div>
                            <div
                              className="absolute top-1 bottom-1 left-[10%] rounded-md flex items-center px-2 shadow-sm group-hover:bg-blue-200 transition-colors cursor-pointer"
                              style={{
                                width: `${project.progress}%`,
                                backgroundColor: idx === 0 ? '#DBEAFE' : '#E0E7FF',
                                border: `1px solid ${idx === 0 ? '#93C5FD' : '#A5B4FC'}`,
                              }}
                            >
                              <div className="h-1.5 w-full bg-white/50 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-primary"
                                  style={{ width: `${project.progress}%` }}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Active Projects Grid */}
              <div className="flex items-center justify-between sticky top-0 bg-slate-50/50 backdrop-blur-sm z-10 py-2">
                <CardTitle className="text-lg font-bold flex items-center gap-2">
                  <span className="material-symbols-outlined text-text-secondary">grid_view</span>
                  Active Projects
                </CardTitle>
                <Button variant="outline" size="sm" className="text-xs font-bold">
                  <span className="material-symbols-outlined text-sm">add</span>
                  New Project
                </Button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {projects.map(project => (
                  <Card key={project.id} className="hover:border-primary cursor-pointer transition-all">
                    <CardHeader>
                      <div className="flex items-center gap-3 mb-4">
                        <div className="size-10 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-primary">
                          <span className="material-symbols-outlined">web</span>
                        </div>
                        <div className="flex flex-col">
                          <CardTitle className="text-sm leading-tight">{project.title}</CardTitle>
                          <span className="text-text-secondary text-xs mt-0.5">Due in 2 days</span>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex justify-between text-xs text-text-secondary mb-1.5 font-medium">
                        <span>Progress</span>
                        <span className="text-text-main font-bold">{project.progress}%</span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-primary" style={{ width: `${project.progress}%` }} />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'assignee' && (
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-full pb-10">
              {/* Unassigned Pool */}
              <Card className="lg:col-span-1 flex flex-col gap-4 bg-slate-100/50 border border-slate-200 h-full">
                <CardHeader>
                  <CardTitle className="text-sm font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
                    <span className="material-symbols-outlined text-lg">person_off</span>
                    Unassigned Pool
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col gap-3 overflow-y-auto max-h-[600px]">
                    {unassignedTasks.length === 0 ? (
                      <div className="py-10 text-center">
                        <span className="material-symbols-outlined text-slate-300 text-4xl mb-2">check_circle</span>
                        <p className="text-xs text-slate-400">No unassigned tasks.</p>
                      </div>
                    ) : (
                      unassignedTasks.map((item) => (
                        <Card
                          key={item.id}
                          draggable
                          onDragStart={(e) => handleDragStart(e, item)}
                          onDragEnd={handleDragEnd}
                          className="bg-white p-3 shadow-sm border border-slate-200 cursor-grab active:cursor-grabbing hover:border-primary/50 group hover:shadow-md transition-all"
                        >
                          <CardContent className="p-0">
                            <p className="text-sm font-semibold text-slate-800">{item.title}</p>
                            <div className="flex gap-2 mt-2">
                              {item.priority && (
                                <span className="text-[10px] bg-red-50 text-red-600 px-1.5 py-0.5 rounded border border-red-100 font-bold">
                                  High
                                </span>
                              )}
                              <span className="text-[10px] bg-slate-50 text-slate-500 px-1.5 py-0.5 rounded border border-slate-200">
                                {item.estimatedTime || 'N/A'}
                              </span>
                            </div>
                          </CardContent>
                        </Card>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Team Grid */}
              <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 h-fit">
                {teamMembers.map((member) => (
                  <Card key={member.id} className="bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col overflow-hidden">
                    <CardHeader className="p-4 border-b border-slate-100 flex items-center gap-3 bg-slate-50/50">
                      <div
                        className="size-10 rounded-full bg-slate-200 bg-cover"
                        style={{ backgroundImage: `url('${member.avatar}')` }}
                      />
                      <div>
                        <p className="font-bold text-slate-900 text-sm">{member.name}</p>
                        <p className="text-xs text-slate-500">{member.role}</p>
                      </div>
                    </CardHeader>
                    <DragDropZone
                      id={`member-${member.id}`}
                      onDrop={(item) => handleTaskDrop(item, `member-${member.id}`)}
                      className="p-4 bg-slate-50/20 flex-1 min-h-[150px] flex flex-col gap-2 border-dashed border-2 border-transparent hover:border-blue-200 transition-all rounded-b-xl"
                    >
                      {tasks
                        .filter(t => t.assigneeId === member.id)
                        .map((task) => (
                          <Card key={task.id} className="bg-white p-2.5 rounded-lg border border-slate-200 shadow-sm text-sm text-slate-700 flex justify-between group">
                            <span>{task.title}</span>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-500 h-5 w-5"
                              onClick={async () => {
                                await updateTask(task.id, { assigneeId: undefined });
                              }}
                            >
                              <span className="material-icons-round text-sm">remove_circle_outline</span>
                            </Button>
                          </Card>
                        ))}
                      <div className="mt-auto pt-4 flex justify-center opacity-50 text-xs font-bold text-slate-400 uppercase tracking-widest pointer-events-none">
                        Drop here
                      </div>
                    </DragDropZone>
                    <div className="p-2 bg-slate-50 border-t border-slate-100">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${member.capacity > 80 ? 'bg-red-500' : 'bg-primary'}`}
                            style={{ width: `${member.capacity}%` }}
                          />
                        </div>
                        <span className="text-xs font-bold text-slate-400 w-8">{member.capacity}%</span>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <span
                          className={`material-symbols-outlined text-[14px] ${
                            member.status === 'Available' ? 'text-green-600' : member.status === 'Busy' ? 'text-red-500' : 'text-slate-400'
                          }`}
                        >
                          {member.status === 'Available'
                            ? 'check_circle'
                            : member.status === 'Busy'
                            ? 'do_not_disturb_on'
                            : 'remove_circle'}
                        </span>
                        <span className="text-xs font-bold text-slate-600">{member.status}</span>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

