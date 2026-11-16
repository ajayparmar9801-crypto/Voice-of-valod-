import React, { useState } from 'react';
import {
  MessageSquareShare,
  Send,
  Sparkles,
  Heart,
  TrendingUp,
  Smile,
  ShieldAlert,
  Bot,
  User,
  CheckCircle2,
  RefreshCw
} from 'lucide-react';
import { Language, PipelineState } from '../types';

interface AutoReplySectionProps {
  language: Language;
  pipelineState: PipelineState;
}

export const AutoReplySection: React.FC<AutoReplySectionProps> = ({
  language,
  pipelineState,
}) => {
  const isGu = language === 'gu';

  const initialReplies = pipelineState.agentOutputs['agent-10']?.output?.simulatedEngagements || [
    {
      commenterName: 'જિગ્નેશ પટેલ (Jignesh Patel)',
      avatar: '👨‍💼',
      userComment: 'આ નોકરીઓ માટે અરજી ક્યારથી શરૂ થશે? ક્વાલિફિકેશન શું જોઈશે?',
      sentiment: 'curious',
      aiReplyGujarati: 'નમસ્કાર જિગ્નેશભાઈ! સત્તાવાર પોર્ટલ પર આગામી મહિનાથી રજિસ્ટ્રેશન લિંક લાઈવ થશે. આઈટી, ફાયનાન્સ અને એન્જિનિયરિંગ ગ્રેજ્યુએટ્સ માટે ઉત્તમ તક છે. અમે લિંક ડિસ્ક્રિપ્શનમાં અપડેટ કરીશું!',
      aiReplyEnglish: 'Hello Jignesh! Official registration links will go live next month on the portal. Great opportunities for IT and finance graduates!',
      engagementTactic: 'Information Assistance + High retention bookmark reminder'
    },
    {
      commenterName: 'પ્રિયા શાહ (Priya Shah)',
      avatar: '👩‍💻',
      userComment: 'ગુજરાતના યુવાનો માટે આ ખરેખર ગર્વની ક્ષણ છે! શાનદાર રીપોર્ટિંગ!',
      sentiment: 'positive',
      aiReplyGujarati: 'ખૂબ ખૂબ આભાર પ્રિયાજી! અમારો પ્રયાસ આપ સુધી સૌથી સાચા અને પ્રેરણાદાયક સમાચાર પહોંચાડવાનો છે. ચેનલને સબ્સ્ક્રાઇબ કરવાનું ભૂલતા નહીં! 🙏✨',
      aiReplyEnglish: 'Thank you Priya! We strive to deliver the most accurate news. Do share with friends!',
      engagementTactic: 'Gratitude + Community building'
    },
    {
      commenterName: 'રાહુલ મહેતા (Rahul Mehta)',
      avatar: '🧑‍🔧',
      userComment: 'શું આ માત્ર મોટી ડિગ્રી વાળા માટે જ છે કે સામાન્ય ગ્રેજ્યુએટ પણ એપ્લાય કરી શકે?',
      sentiment: 'skeptical',
      aiReplyGujarati: 'રાહુલભાઈ, આમાં ઓપરેશન્સ, કસ્ટમર સપોર્ટ અને બેક-ઓફિસ સહિત વિવિધ ૫૦+ કેટેગરીમાં જગ્યાઓ છે. દરેક ગ્રેજ્યુએટ માટે ભરપૂર તકો રહેલી છે!',
      aiReplyEnglish: 'Rahul, there are diverse roles across operations, back-office, and tech for all graduates!',
      engagementTactic: 'Doubt clearing + Encouraging participation'
    }
  ];

  const [comments, setComments] = useState(initialReplies);
  const [newCommentInput, setNewCommentInput] = useState('');
  const [isReplying, setIsReplying] = useState(false);

  const handlePostUserComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentInput.trim()) return;

    const userText = newCommentInput.trim();
    setNewCommentInput('');
    setIsReplying(true);

    try {
      // Call server backend to get live AI response
      const res = await fetch('/api/pipeline/run-agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          agentId: 'agent-10',
          topic: pipelineState.selectedTopic,
          context: { customUserComment: userText }
        })
      });

      const data = await res.json();
      const generated = data?.result?.output?.simulatedEngagements?.[0] || {
        commenterName: 'તમે (Viewer)',
        avatar: '👤',
        userComment: userText,
        sentiment: 'positive',
        aiReplyGujarati: `આપની કમેન્ટ માટે આભાર! ${pipelineState.selectedTopic.titleGujarati} અંગે વધુ વિગતો ટૂંક સમયમાં પિન કમેન્ટમાં શેર કરવામાં આવશે. જોડાયેલા રહો!`,
        aiReplyEnglish: `Thank you for your comment! More details regarding this story will be pinned soon.`,
        engagementTactic: 'Instant positive feedback + Notification loop'
      };

      setComments((prev: any[]) => [
        {
          commenterName: 'તમે (Viewer)',
          avatar: '👤',
          userComment: userText,
          sentiment: 'positive',
          aiReplyGujarati: generated.aiReplyGujarati || `આભાર! આ મુદ્દે વધુ અપડેટ માટે બેલ આઈકન દબાવો!`,
          aiReplyEnglish: generated.aiReplyEnglish || `Thank you! Stay tuned for more updates.`,
          engagementTactic: 'Instant real-time engagement'
        },
        ...prev
      ]);
    } catch {
      // Fallback response
      setComments((prev: any[]) => [
        {
          commenterName: 'તમે (Viewer)',
          avatar: '👤',
          userComment: userText,
          sentiment: 'positive',
          aiReplyGujarati: `નમસ્કાર! આપના વિચાર બદલ આભાર. અમારા એડિટોરિયલ ગ્રુપ દ્વારા તમારી કમેન્ટ નોંધી લેવાઈ છે. 🙏`,
          aiReplyEnglish: `Hello! Thank you for sharing your thoughts. Our editorial desk has noted this.`,
          engagementTactic: 'Direct community acknowledgment'
        },
        ...prev
      ]);
    } finally {
      setIsReplying(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded bg-pink-500/20 text-pink-400 border border-pink-500/30 text-[11px] font-bold uppercase tracking-wider">
              AGENT 10 • SUPERHIT ENGAGEMENT
            </span>
            <span className="text-xs text-slate-400">|</span>
            <span className="text-xs text-slate-300 font-semibold font-['Noto_Sans_Gujarati',sans-serif]">
              {isGu ? 'ઓટો-રિપ્લાય અને પબ્લિક કનેક્ટ એજન્ટ' : 'Auto-Reply & Audience Engagement Agent'}
            </span>
          </div>
          <h2 className="text-lg font-bold text-white mt-1 font-['Noto_Sans_Gujarati',sans-serif]">
            {isGu
              ? 'પોસ્ટ પબ્લિશ થયા પછી ઓટોમેટિક AI કમેન્ટ જવાબો'
              : 'Post-Publish 24/7 AI Community Conversation & Positive Engagement'}
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            {isGu
              ? 'યુઝર્સની કમેન્ટ્સના AI દ્વારા તાત્કાલિક, વિવેકી અને માહિતીસભર જવાબો આપી એલ્ગોરિધમમાં એન્ગેજમેન્ટ ૧૦ ગણું વધારે છે.'
              : 'Boosts post reach 10x by delivering polite, prompt, and factual replies to YouTube and Facebook comments.'}
          </p>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-3 bg-slate-950 p-3 rounded-xl border border-slate-800 shrink-0 text-xs">
          <div>
            <span className="text-[10px] text-slate-500 uppercase font-semibold">
              {isGu ? 'સરેરાશ રિપ્લાય ટાઈમ' : 'Avg Reply Speed'}
            </span>
            <p className="text-sm font-bold text-emerald-400 font-mono">1.2 સેકન્ડ (Instant)</p>
          </div>
          <span className="text-slate-700">|</span>
          <div>
            <span className="text-[10px] text-slate-500 uppercase font-semibold">
              {isGu ? 'પોઝિટિવિટી રેટ' : 'Sentiment Score'}
            </span>
            <p className="text-sm font-bold text-pink-400 font-mono">94% Positive</p>
          </div>
        </div>
      </div>

      {/* Interactive Comment Tester Box */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg">
        <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-2 flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-pink-400" />
          {isGu ? 'લાઈવ કમેન્ટ ટેસ્ટ કરો (તમારી કમેન્ટ લખો અને AI નો જવાબ જુઓ):' : 'Live Test Comment Box (Write any comment to test AI reply):'}
        </h3>
        <form onSubmit={handlePostUserComment} className="flex gap-2">
          <input
            type="text"
            value={newCommentInput}
            onChange={(e) => setNewCommentInput(e.target.value)}
            placeholder={
              isGu
                ? 'દા.ત., શું આ યોજના સામાન્ય વર્ગના યુવાનો માટે ફાયદાકારક સાબિત થશે?'
                : 'e.g., How can young professionals in Gujarat apply for these opportunities?'
            }
            className="flex-1 px-4 py-2.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-pink-500 font-['Noto_Sans_Gujarati',sans-serif]"
          />
          <button
            type="submit"
            disabled={isReplying || !newCommentInput.trim()}
            className="px-5 py-2.5 rounded-lg bg-pink-600 hover:bg-pink-500 text-white text-xs font-bold shadow flex items-center gap-1.5 transition disabled:opacity-50"
          >
            {isReplying ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
            <span>{isGu ? 'કમેન્ટ મોકલો' : 'Post Comment'}</span>
          </button>
        </form>
      </div>

      {/* Comment & AI Replies Feed */}
      <div className="space-y-3">
        {comments.map((item: any, idx: number) => (
          <div
            key={idx}
            className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow space-y-3 hover:border-slate-700 transition"
          >
            {/* User comment row */}
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-base shrink-0">
                {item.avatar || '👤'}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-white">
                    {item.commenterName}
                  </h4>
                  <span className="text-[10px] text-slate-500 font-mono">
                    {item.sentiment === 'positive' ? '😊 Positive' : item.sentiment === 'curious' ? '🤔 Question' : '🧐 Skeptical'}
                  </span>
                </div>
                <p className="text-xs text-slate-300 mt-1 font-['Noto_Sans_Gujarati',sans-serif] leading-relaxed">
                  "{item.userComment}"
                </p>
              </div>
            </div>

            {/* AI Auto-Reply branch */}
            <div className="ml-6 pl-4 border-l-2 border-pink-500/40 space-y-2">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-pink-500/10 text-pink-400 font-bold text-[10px] border border-pink-500/30 flex items-center gap-1">
                  <Bot className="w-3 h-3" />
                  {isGu ? 'વોઇસ ઓફ વાલોડ ન્યૂઝ (ઓફિશિયલ)' : 'Voice of Valod News (Official Reply)'}
                </span>
                <span className="text-[10px] text-emerald-400 font-mono">Verified Host</span>
              </div>

              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800/80 text-xs text-slate-200 font-['Noto_Sans_Gujarati',sans-serif] leading-relaxed">
                {item.aiReplyGujarati}
              </div>

              {item.engagementTactic && (
                <div className="flex items-center gap-2 text-[10px] text-slate-500">
                  <span className="font-semibold text-slate-400">Tactic:</span>
                  <span>{item.engagementTactic}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
