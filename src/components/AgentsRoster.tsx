import React from 'react';
import {
  Flame,
  Link2,
  Cpu,
  PenTool,
  ShieldCheck,
  TrendingUp,
  Film,
  BellRing,
  Send,
  MessageSquareShare,
  BarChart3,
  Play,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowRight,
  ExternalLink,
  Video
} from 'lucide-react';
import { AgentInfo, Language } from '../types';

interface AgentsRosterProps {
  language: Language;
  agents: AgentInfo[];
  onRunAgent: (agentId: string) => void;
  onSelectAgent: (agent: AgentInfo) => void;
}

export const AgentsRoster: React.FC<AgentsRosterProps> = ({
  language,
  agents,
  onRunAgent,
  onSelectAgent,
}) => {
  const isGu = language === 'gu';

  const getAgentIcon = (iconName: string) => {
    switch (iconName) {
      case 'Flame': return <Flame className="w-5 h-5 text-amber-400" />;
      case 'Link2': return <Link2 className="w-5 h-5 text-cyan-400" />;
      case 'Cpu': return <Cpu className="w-5 h-5 text-blue-400" />;
      case 'PenTool': return <PenTool className="w-5 h-5 text-emerald-400" />;
      case 'ShieldCheck': return <ShieldCheck className="w-5 h-5 text-green-400" />;
      case 'TrendingUp': return <TrendingUp className="w-5 h-5 text-yellow-400" />;
      case 'Film': return <Film className="w-5 h-5 text-purple-400" />;
      case 'Video': return <Video className="w-5 h-5 text-rose-400" />;
      case 'BellRing': return <BellRing className="w-5 h-5 text-rose-400" />;
      case 'Send': return <Send className="w-5 h-5 text-indigo-400" />;
      case 'MessageSquareShare': return <MessageSquareShare className="w-5 h-5 text-pink-400" />;
      case 'BarChart3': return <BarChart3 className="w-5 h-5 text-teal-400" />;
      default: return <Sparkles className="w-5 h-5 text-slate-400" />;
    }
  };

  const coreAgents = agents.filter(a => !a.isSuperhitExtra);
  const superhitAgents = agents.filter(a => a.isSuperhitExtra);

  return (
    <div className="space-y-8">
      {/* Intro Header */}
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl shadow-lg">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded bg-red-500/20 text-red-400 border border-red-500/30 text-[11px] font-bold uppercase tracking-wider">
            COMPLETE AI NEWSROOM ROSTER
          </span>
          <span className="text-xs text-slate-400">|</span>
          <span className="text-xs text-slate-300 font-semibold font-['Noto_Sans_Gujarati',sans-serif]">
            {isGu ? '૧૨ સ્વાયત્ત એજન્ટોની સંપૂર્ણ ટીમ' : '12 Autonomous Agents Roster'}
          </span>
        </div>
        <h2 className="text-lg font-bold text-white mt-1 font-['Noto_Sans_Gujarati',sans-serif]">
          {isGu
            ? '૭ કોર પ્રોડક્શન એજન્ટો + ૫ એડવાન્સ્ડ ગ્રોથ & વિડિયો સિન્થેસાઇઝર્સ'
            : '7 Core Production Agents + 5 Advanced Growth & Video Synthesizers'}
        </h2>
        <p className="text-xs text-slate-400 mt-0.5">
          {isGu
            ? 'દરેક એજન્ટ પોતાની વિશેષ જવાબદારી સંભાળે છે અને એકબીજા સાથે નિર્વિધ્ન રીતે જોડાયેલા છે.'
            : 'Each agent is specialized with explicit goals, safety checks, and tool integrations.'}
        </p>
      </div>

      {/* SECTION 1: CORE 7 AGENTS */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-bold text-white font-['Noto_Sans_Gujarati',sans-serif]">
            {isGu ? 'મુખ્ય ૭ પ્રોડક્શન એજન્ટો (Core Pipeline)' : '7 Core Production Pipeline Agents'}
          </h3>
          <span className="text-xs text-slate-500 font-mono">(Agents 1 to 7)</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {coreAgents.map((agent) => (
            <div
              key={agent.id}
              onClick={() => onSelectAgent(agent)}
              className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl p-4 shadow-lg transition flex flex-col justify-between cursor-pointer group"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0 group-hover:scale-105 transition">
                      {getAgentIcon(agent.icon)}
                    </div>
                    <div>
                      <span className="text-[10px] font-mono font-bold text-red-400">
                        AGENT #{agent.number}
                      </span>
                      <h4 className="text-xs font-bold text-white font-['Noto_Sans_Gujarati',sans-serif] line-clamp-1">
                        {isGu ? agent.nameGu : agent.nameEn}
                      </h4>
                    </div>
                  </div>
                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                      agent.status === 'completed'
                        ? 'text-emerald-400 bg-emerald-950/60 border border-emerald-500/30'
                        : agent.status === 'running'
                        ? 'text-amber-400 bg-amber-950/60 border border-amber-500/30'
                        : 'text-slate-400 bg-slate-800 border border-slate-700'
                    }`}
                  >
                    {agent.status}
                  </span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed font-['Noto_Sans_Gujarati',sans-serif] mb-4">
                  {isGu ? agent.roleGu : agent.roleEn}
                </p>
              </div>

              <div>
                <div className="pt-3 border-t border-slate-800/80 mb-3">
                  <span className="text-[10px] uppercase font-bold text-slate-500 block mb-1">
                    {isGu ? 'ટૂલ્સ & ઇન્ટિગ્રેશન:' : 'Connected Stack:'}
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {agent.toolsUsed.map((tool, i) => (
                      <span key={i} className="text-[10px] bg-slate-950 px-2 py-0.5 rounded text-slate-400 border border-slate-800 font-mono">
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-800/60">
                  <span className="text-[11px] text-slate-500 group-hover:text-slate-300 transition flex items-center gap-1">
                    {isGu ? 'વિગત જુઓ' : 'Inspect'}
                    <ArrowRight className="w-3 h-3" />
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onRunAgent(agent.id);
                    }}
                    className="px-2.5 py-1 rounded bg-slate-800 hover:bg-red-600 text-white text-[11px] font-semibold transition flex items-center gap-1 shadow"
                  >
                    <Play className="w-3 h-3 fill-current" />
                    <span>{isGu ? 'ચલાવો' : 'Run'}</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 2: 4 SUPERHIT EXTRA AGENTS */}
      <div className="space-y-4 pt-4 border-t border-slate-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-bold text-white font-['Noto_Sans_Gujarati',sans-serif]">
              {isGu
                ? 'મેં ઉમેરેલા ૪ નવા એજન્ટો (જે તમારી ચેનલને સુપરહિટ બનાવશે)'
                : '4 New Superhit Agents (Growth, Safety & Viral Engagement)'}
            </h3>
          </div>
          <span className="text-xs text-amber-400 font-bold bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/30">
            ★ CHANNEL ACCELERATOR
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {superhitAgents.map((agent) => (
            <div
              key={agent.id}
              onClick={() => onSelectAgent(agent)}
              className="bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 border-2 border-amber-500/30 hover:border-amber-500/60 rounded-xl p-5 shadow-xl transition flex flex-col justify-between cursor-pointer group"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center shrink-0 group-hover:scale-105 transition">
                      {getAgentIcon(agent.icon)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono font-bold text-amber-400">
                          AGENT #{agent.number}
                        </span>
                        <span className="text-[9px] font-bold text-amber-300 bg-amber-500/20 px-1.5 py-0.2 rounded">
                          SUPERHIT
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-white font-['Noto_Sans_Gujarati',sans-serif]">
                        {isGu ? agent.nameGu : agent.nameEn}
                      </h4>
                    </div>
                  </div>
                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                      agent.status === 'completed'
                        ? 'text-emerald-400 bg-emerald-950/60 border border-emerald-500/30'
                        : 'text-slate-400 bg-slate-800 border border-slate-700'
                    }`}
                  >
                    {agent.status}
                  </span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed font-['Noto_Sans_Gujarati',sans-serif] mb-4">
                  {isGu ? agent.roleGu : agent.roleEn}
                </p>
              </div>

              <div>
                <div className="pt-3 border-t border-slate-800 mb-3">
                  <span className="text-[10px] uppercase font-bold text-slate-500 block mb-1">
                    {isGu ? 'ટૂલ્સ & ઇન્ટિગ્રેશન:' : 'Connected Stack:'}
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {agent.toolsUsed.map((tool, i) => (
                      <span key={i} className="text-[10px] bg-slate-950 px-2 py-0.5 rounded text-amber-200/80 border border-slate-800 font-mono">
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-800/60">
                  <span className="text-xs text-slate-400 group-hover:text-amber-300 transition flex items-center gap-1 font-medium">
                    {isGu ? 'આ એજન્ટનું આઉટપુટ જુઓ' : 'View Agent Intelligence'}
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onRunAgent(agent.id);
                    }}
                    className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-slate-950 text-xs font-bold transition flex items-center gap-1.5 shadow"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>{isGu ? 'એજન્ટ રન કરો' : 'Execute Agent'}</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
