import React, { useState, useMemo } from 'react';
import {
  Clock,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Play,
  RotateCcw,
  Download,
  Filter,
  Search,
  ChevronDown,
  ChevronUp,
  Terminal,
  Activity,
  Layers,
  FileText,
  Calendar,
  Sparkles,
  ShieldCheck,
  Film,
  Send,
  Video,
  ExternalLink
} from 'lucide-react';
import { AgentExecutionRecord, Language, AgentInfo } from '../types';

interface AgentExecutionLogProps {
  language: Language;
  executionHistory: AgentExecutionRecord[];
  agents: AgentInfo[];
  onReRunAgent?: (agentId: string) => void;
  onClearLogs?: () => void;
  isRunning?: boolean;
}

export const AgentExecutionLog: React.FC<AgentExecutionLogProps> = ({
  language,
  executionHistory = [],
  agents,
  onReRunAgent,
  onClearLogs,
  isRunning = false
}) => {
  const isGu = language === 'gu';

  const [selectedAgentFilter, setSelectedAgentFilter] = useState<string>('all');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [viewMode, setViewMode] = useState<'timeline' | 'table'>('timeline');
  const [expandedRecordId, setExpandedRecordId] = useState<string | null>(null);

  // Filtered execution logs
  const filteredRecords = useMemo(() => {
    return executionHistory.filter(record => {
      // Agent filter
      if (selectedAgentFilter !== 'all' && record.agentId !== selectedAgentFilter) {
        return false;
      }
      // Status filter
      if (selectedStatusFilter !== 'all' && record.status !== selectedStatusFilter) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchTitle = record.topicTitle?.toLowerCase().includes(query);
        const matchAgentGu = record.agentNameGu?.toLowerCase().includes(query);
        const matchAgentEn = record.agentNameEn?.toLowerCase().includes(query);
        const matchSummaryGu = record.summaryGu?.toLowerCase().includes(query);
        const matchSummaryEn = record.summaryEn?.toLowerCase().includes(query);
        return matchTitle || matchAgentGu || matchAgentEn || matchSummaryGu || matchSummaryEn;
      }
      return true;
    });
  }, [executionHistory, selectedAgentFilter, selectedStatusFilter, searchQuery]);

  // Statistics calculation
  const stats = useMemo(() => {
    const total = executionHistory.length;
    const successCount = executionHistory.filter(r => r.status === 'success').length;
    const failedCount = executionHistory.filter(r => r.status === 'failed').length;
    const warningCount = executionHistory.filter(r => r.status === 'warning').length;
    const avgDurationMs = total > 0
      ? Math.round(executionHistory.reduce((acc, r) => acc + (r.durationMs || 0), 0) / total)
      : 0;
    const successRate = total > 0 ? Math.round((successCount / total) * 100) : 100;

    return {
      total,
      successCount,
      failedCount,
      warningCount,
      avgDurationMs,
      successRate
    };
  }, [executionHistory]);

  // Export as JSON
  const handleExportJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(executionHistory, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `vov_agent_execution_audit_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Export as CSV
  const handleExportCsv = () => {
    const headers = ['ID', 'Agent Number', 'Agent Name', 'Status', 'Start Time', 'End Time', 'Duration (ms)', 'Topic', 'Summary'];
    const rows = executionHistory.map(r => [
      r.id,
      r.agentNumber,
      `"${r.agentNameEn}"`,
      r.status,
      `"${r.startTime}"`,
      `"${r.endTime}"`,
      r.durationMs,
      `"${(r.topicTitle || '').replace(/"/g, '""')}"`,
      `"${(r.summaryEn || r.summaryGu || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', encodeURI(csvContent));
    downloadAnchor.setAttribute('download', `vov_agent_audit_${Date.now()}.csv`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const getStatusBadge = (status: AgentExecutionRecord['status']) => {
    switch (status) {
      case 'success':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            <CheckCircle2 className="w-3 h-3" />
            <span>{isGu ? 'સફળ' : 'Success'}</span>
          </span>
        );
      case 'failed':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30 animate-pulse">
            <XCircle className="w-3 h-3" />
            <span>{isGu ? 'નિષ્ફળ' : 'Failed'}</span>
          </span>
        );
      case 'warning':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
            <AlertTriangle className="w-3 h-3" />
            <span>{isGu ? 'ચેતવણી' : 'Warning'}</span>
          </span>
        );
      case 'running':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-sky-500/20 text-sky-300 border border-sky-500/30">
            <Activity className="w-3 h-3 animate-spin" />
            <span>{isGu ? 'ચાલુ છે' : 'Running'}</span>
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* SECTION HEADER & TELEMETRY STRIP */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold uppercase tracking-wider">
                PIPELINE AUDIT TRAIL & LOGS
              </span>
              <span className="text-xs text-slate-500">|</span>
              <span className="text-xs text-slate-300 font-semibold font-['Noto_Sans_Gujarati',sans-serif]">
                {isGu ? '૧૨ એજન્ટ્સ એક્ઝિક્યુશન હિસ્ટ્રી' : '12-Agent Execution Telemetry'}
              </span>
              {isRunning && (
                <span className="flex items-center gap-1 text-[11px] font-bold text-sky-400 bg-sky-500/10 px-2 py-0.5 rounded border border-sky-500/30 animate-pulse">
                  <Activity className="w-3 h-3 animate-spin" />
                  <span>Pipeline Active</span>
                </span>
              )}
            </div>

            <h2 className="text-lg md:text-xl font-bold text-white mt-1 font-['Noto_Sans_Gujarati',sans-serif]">
              {isGu ? 'એજન્ટ એક્ઝિક્યુશન હિસ્ટ્રી અને ઑડિટ લોગ' : 'Agent Execution History & Audit Log'}
            </h2>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl font-['Noto_Sans_Gujarati',sans-serif]">
              {isGu
                ? 'દરેક એજન્ટનું શરૂ થવાનો સમય (Start Time), સમાપ્તિ સમય (End Time), સમયગાળો (Duration) અને સફળ/નિષ્ફળ સ્થિતિનો ઐતિહાસિક ઓડિટ ટ્રેઇલ.'
                : 'Complete chronological audit log recording exact start/end timestamps, latency in milliseconds, and status for each pipeline agent.'}
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleExportJson}
              disabled={executionHistory.length === 0}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition disabled:opacity-40"
              title="Download execution audit log as JSON"
            >
              <Download className="w-3.5 h-3.5 text-sky-400" />
              <span>Export JSON</span>
            </button>

            <button
              type="button"
              onClick={handleExportCsv}
              disabled={executionHistory.length === 0}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition disabled:opacity-40"
              title="Download execution audit log as CSV"
            >
              <FileText className="w-3.5 h-3.5 text-emerald-400" />
              <span>Export CSV</span>
            </button>

            {onClearLogs && (
              <button
                type="button"
                onClick={onClearLogs}
                disabled={executionHistory.length === 0}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-900 hover:bg-rose-950/40 text-slate-400 hover:text-rose-300 border border-slate-800 hover:border-rose-500/30 text-xs transition disabled:opacity-40"
                title="Clear execution log history"
              >
                <RotateCcw className="w-3 h-3" />
                <span>{isGu ? 'સાફ કરો' : 'Clear'}</span>
              </button>
            )}
          </div>
        </div>

        {/* 4 METRIC TILES */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
          <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">Total Runs</span>
            <span className="text-xl font-bold text-white font-mono mt-0.5 block">{stats.total}</span>
            <span className="text-[10px] text-slate-500 mt-0.5 block">Recorded Agent Steps</span>
          </div>

          <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">Success Rate</span>
            <span className="text-xl font-bold text-emerald-400 font-mono mt-0.5 block">{stats.successRate}%</span>
            <span className="text-[10px] text-emerald-500/80 mt-0.5 block">{stats.successCount} Successful Runs</span>
          </div>

          <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">Avg Latency</span>
            <span className="text-xl font-bold text-sky-400 font-mono mt-0.5 block">
              {stats.avgDurationMs > 0 ? `${(stats.avgDurationMs / 1000).toFixed(2)}s` : '0ms'}
            </span>
            <span className="text-[10px] text-slate-500 mt-0.5 block">Across AI Operations</span>
          </div>

          <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">Pipeline Health</span>
            <span className="text-xl font-bold text-amber-300 font-mono mt-0.5 block">
              {stats.failedCount === 0 ? '100% Stable' : `${stats.failedCount} Errors`}
            </span>
            <span className="text-[10px] text-slate-500 mt-0.5 block">Zero Blocking Halts</span>
          </div>
        </div>
      </div>

      {/* FILTER & SEARCH TOOLBAR */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-md">
        <div className="flex flex-wrap items-center gap-2.5 flex-1">
          {/* Search Input */}
          <div className="relative flex-1 min-w-[200px]">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isGu ? 'એજન્ટ, ટાઇટલ કે શબ્દ શોધો...' : 'Search logs by agent, topic or keyword...'}
              className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Filter by Agent */}
          <div className="flex items-center gap-1.5 bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1">
            <Layers className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <select
              value={selectedAgentFilter}
              onChange={(e) => setSelectedAgentFilter(e.target.value)}
              className="bg-transparent text-xs text-slate-200 focus:outline-none cursor-pointer pr-1"
            >
              <option value="all">{isGu ? 'તમામ એજન્ટ્સ (All Agents)' : 'All 12 Agents'}</option>
              {agents.map((agent) => (
                <option key={agent.id} value={agent.id}>
                  Agent #{agent.number}: {isGu ? agent.nameGu : agent.nameEn}
                </option>
              ))}
            </select>
          </div>

          {/* Filter by Status */}
          <div className="flex items-center gap-1.5 bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1">
            <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <select
              value={selectedStatusFilter}
              onChange={(e) => setSelectedStatusFilter(e.target.value)}
              className="bg-transparent text-xs text-slate-200 focus:outline-none cursor-pointer pr-1"
            >
              <option value="all">{isGu ? 'તમામ સ્થિતિ (All Status)' : 'All Status'}</option>
              <option value="success">✓ Success Only</option>
              <option value="failed">✕ Failed Only</option>
              <option value="warning">⚠️ Warning Only</option>
              <option value="running">⏳ Running Only</option>
            </select>
          </div>
        </div>

        {/* View Switcher (Timeline vs Table) */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800 self-end md:self-auto shrink-0">
          <button
            type="button"
            onClick={() => setViewMode('timeline')}
            className={`px-3 py-1 rounded text-xs font-semibold transition ${
              viewMode === 'timeline'
                ? 'bg-emerald-600 text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {isGu ? 'ટાઈમલાઈન' : 'Timeline'}
          </button>
          <button
            type="button"
            onClick={() => setViewMode('table')}
            className={`px-3 py-1 rounded text-xs font-semibold transition ${
              viewMode === 'table'
                ? 'bg-emerald-600 text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {isGu ? 'ટેબલ વ્યૂ' : 'Table View'}
          </button>
        </div>
      </div>

      {/* RECORD COUNT BADGE */}
      <div className="flex items-center justify-between text-xs text-slate-400 px-1 font-mono">
        <span>
          Showing {filteredRecords.length} of {executionHistory.length} execution logs
        </span>
        {searchQuery && (
          <button
            type="button"
            onClick={() => setSearchQuery('')}
            className="text-emerald-400 hover:underline"
          >
            Clear Search
          </button>
        )}
      </div>

      {/* EMPTY STATE */}
      {filteredRecords.length === 0 && (
        <div className="bg-slate-900 border border-dashed border-slate-800 rounded-2xl p-12 text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400 mx-auto text-xl">
            📋
          </div>
          <h3 className="text-base font-bold text-white font-['Noto_Sans_Gujarati',sans-serif]">
            {isGu ? 'હજુ કોઈ એક્ઝિક્યુશન લોગ મળ્યો નથી' : 'No Execution Logs Found'}
          </h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto font-['Noto_Sans_Gujarati',sans-serif]">
            {isGu
              ? 'પાઈપલાઈન શરૂ કરો અથવા કોઈપણ એજન્ટને ટેસ્ટ કરો જેથી તેમની શરૂઆત અને સમાપ્તિ સમય અહીં ઓડિટ ટ્રેઇલમાં આપોઆપ નોંધાઈ જાય.'
              : 'Trigger the autonomous pipeline or run individual agents from the Workflow tab to record start times, end times, and duration records.'}
          </p>
        </div>
      )}

      {/* VIEW MODE 1: CHRONOLOGICAL TIMELINE VIEW */}
      {viewMode === 'timeline' && filteredRecords.length > 0 && (
        <div className="space-y-3">
          {filteredRecords.map((record, index) => {
            const isExpanded = expandedRecordId === record.id;
            return (
              <div
                key={record.id}
                className="bg-slate-900 border border-slate-800 rounded-xl p-4 hover:border-slate-700 transition shadow-lg relative overflow-hidden"
              >
                {/* Accent strip on left */}
                <div
                  className={`absolute left-0 top-0 bottom-0 w-1 ${
                    record.status === 'success'
                      ? 'bg-emerald-500'
                      : record.status === 'failed'
                      ? 'bg-rose-500'
                      : record.status === 'warning'
                      ? 'bg-amber-500'
                      : 'bg-sky-500'
                  }`}
                />

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pl-2">
                  <div className="flex items-start gap-3">
                    {/* Agent Number badge */}
                    <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex flex-col items-center justify-center shrink-0">
                      <span className="text-[10px] text-slate-400 uppercase font-mono leading-none">AGT</span>
                      <span className="text-sm font-bold text-white font-mono leading-tight">#{record.agentNumber}</span>
                    </div>

                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h4 className="text-sm font-bold text-white font-['Noto_Sans_Gujarati',sans-serif]">
                          {isGu ? record.agentNameGu : record.agentNameEn}
                        </h4>
                        {getStatusBadge(record.status)}
                        <span className="text-[11px] font-mono text-emerald-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                          ⏱️ {record.durationMs >= 1000 ? `${(record.durationMs / 1000).toFixed(2)}s` : `${record.durationMs}ms`}
                        </span>
                      </div>

                      <p className="text-xs text-slate-300 mt-1 font-['Noto_Sans_Gujarati',sans-serif] line-clamp-2">
                        {isGu ? record.summaryGu : record.summaryEn}
                      </p>

                      <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-400 font-mono mt-2">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-slate-500" />
                          <span>Start: <span className="text-slate-300">{record.startTime}</span></span>
                        </span>
                        <span>→</span>
                        <span className="flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-slate-500" />
                          <span>End: <span className="text-slate-300">{record.endTime}</span></span>
                        </span>
                        <span className="text-slate-600">|</span>
                        <span className="text-slate-400 truncate max-w-xs" title={record.topicTitle}>
                          Topic: <span className="text-amber-200/90">{record.topicTitle}</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0 pl-2 md:pl-0">
                    {onReRunAgent && (
                      <button
                        type="button"
                        onClick={() => onReRunAgent(record.agentId)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition border border-slate-700"
                        title="Re-run this agent"
                      >
                        <Play className="w-3.5 h-3.5 text-emerald-400" />
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => setExpandedRecordId(isExpanded ? null : record.id)}
                      className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs border border-slate-700 transition"
                    >
                      <span>{isExpanded ? 'Hide Details' : 'View Audit'}</span>
                      {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                    </button>
                  </div>
                </div>

                {/* EXPANDED AUDIT DRAWER */}
                {isExpanded && (
                  <div className="mt-3 pt-3 border-t border-slate-800/80 space-y-3 pl-2 animate-fadeIn">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
                      <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                        <span className="text-[10px] text-slate-500 uppercase font-mono block">Audit Record ID</span>
                        <span className="font-mono text-slate-300 text-[11px] break-all">{record.id}</span>
                      </div>
                      <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                        <span className="text-[10px] text-slate-500 uppercase font-mono block">Execution Latency</span>
                        <span className="font-mono text-emerald-400 font-bold text-xs">{record.durationMs} milliseconds</span>
                      </div>
                      <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                        <span className="text-[10px] text-slate-500 uppercase font-mono block">Anchor Voice & Broadcast</span>
                        <span className="text-slate-300 text-xs font-semibold">Maya (Voice of Valod)</span>
                      </div>
                    </div>

                    {record.error && (
                      <div className="p-3 rounded-lg bg-rose-950/60 border border-rose-500/40 text-xs text-rose-300 space-y-1">
                        <div className="font-bold flex items-center gap-1.5">
                          <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                          <span>Error Telemetry:</span>
                        </div>
                        <p className="font-mono text-[11px] text-rose-200">{record.error}</p>
                      </div>
                    )}

                    {record.outputPreview && (
                      <div>
                        <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block mb-1">
                          Output Payload Preview (JSON):
                        </span>
                        <pre className="bg-slate-950 p-3 rounded-xl border border-slate-800 font-mono text-[11px] text-slate-300 max-h-48 overflow-y-auto overflow-x-auto">
                          {JSON.stringify(record.outputPreview, null, 2)}
                        </pre>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* VIEW MODE 2: AUDIT DATA TABLE VIEW */}
      {viewMode === 'table' && filteredRecords.length > 0 && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-950 border-b border-slate-800 text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                  <th className="py-3 px-4">#</th>
                  <th className="py-3 px-4">Agent Name</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Start Time</th>
                  <th className="py-3 px-4">End Time</th>
                  <th className="py-3 px-4">Duration</th>
                  <th className="py-3 px-4">Summary</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-xs">
                {filteredRecords.map((record) => (
                  <tr key={record.id} className="hover:bg-slate-800/40 transition">
                    <td className="py-2.5 px-4 font-mono font-bold text-slate-300">
                      #{record.agentNumber}
                    </td>
                    <td className="py-2.5 px-4 font-semibold text-white font-['Noto_Sans_Gujarati',sans-serif]">
                      {isGu ? record.agentNameGu : record.agentNameEn}
                    </td>
                    <td className="py-2.5 px-4 whitespace-nowrap">
                      {getStatusBadge(record.status)}
                    </td>
                    <td className="py-2.5 px-4 font-mono text-[11px] text-slate-400 whitespace-nowrap">
                      {record.startTime}
                    </td>
                    <td className="py-2.5 px-4 font-mono text-[11px] text-slate-400 whitespace-nowrap">
                      {record.endTime}
                    </td>
                    <td className="py-2.5 px-4 font-mono text-emerald-400 font-bold whitespace-nowrap">
                      {record.durationMs >= 1000 ? `${(record.durationMs / 1000).toFixed(2)}s` : `${record.durationMs}ms`}
                    </td>
                    <td className="py-2.5 px-4 text-slate-300 font-['Noto_Sans_Gujarati',sans-serif] max-w-xs truncate" title={record.summaryGu}>
                      {isGu ? record.summaryGu : record.summaryEn}
                    </td>
                    <td className="py-2.5 px-4 text-right whitespace-nowrap">
                      {onReRunAgent && (
                        <button
                          type="button"
                          onClick={() => onReRunAgent(record.agentId)}
                          className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-semibold border border-slate-700"
                        >
                          Run
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
