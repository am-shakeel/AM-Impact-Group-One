
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, ArrowRight, BookOpen, MessageSquare, FlaskConical, PlayCircle,
  CheckCircle2, Lock, Code, Sparkles, Terminal, Play, RotateCcw, Bug, Lightbulb,
  Award, Trophy, ChevronDown, ChevronUp, BrainCircuit, Check, X as XIcon, RefreshCw,
  HelpCircle
} from 'lucide-react';
import { getLearningItems } from '../services/mockDb';
import { LearningItem, TARGET_AUDIENCES } from '../types';

type TabType = 'path' | 'interview' | 'projects' | 'jobs' | 'practice';

const PathDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [activeTab, setActiveTab] = useState<TabType>('path');
  
  // Data State
  const [items, setItems] = useState<LearningItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Sandbox State
  const [isSandboxOpen, setIsSandboxOpen] = useState(false);
  const [currentChallengeIdx, setCurrentChallengeIdx] = useState(0);
  const [code, setCode] = useState('');
  const [consoleOutput, setConsoleOutput] = useState<string[]>(['System ready... Waiting for input.']);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isBadgeUnlocked, setIsBadgeUnlocked] = useState(false);
  
  // Quiz State
  const [activeQuizModuleId, setActiveQuizModuleId] = useState<string | null>(null);
  const [userAnswers, setUserAnswers] = useState<Record<string, number>>({});
  const [showQuizResults, setShowQuizResults] = useState(false);
  
  // Accordion State
  const [openAccordionId, setOpenAccordionId] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, [slug]);

  const loadData = async () => {
    setLoading(true);
    if (slug) {
        const data = await getLearningItems(slug);
        setItems(data);
    }
    setLoading(false);
  };

  const challenges = items
    .filter(i => i.type === 'practice')
    .sort((a,b) => (a.order || 0) - (b.order || 0));

  // Get active quiz questions based on selected module
  const currentQuizQuestions = items
    .filter(i => i.type === 'quiz' && i.moduleId === activeQuizModuleId)
    .sort((a,b) => (a.order || 0) - (b.order || 0));

  // Init Sandbox
  useEffect(() => {
    if (isSandboxOpen && challenges.length > 0) {
      const challenge = challenges[currentChallengeIdx];
      setCode(challenge.content || '');
      setConsoleOutput(['--- New Challenge Loaded ---', `Challenge #${currentChallengeIdx + 1}: ${challenge.title}`]);
      setIsSuccess(false);
    }
  }, [isSandboxOpen, currentChallengeIdx, challenges]);

  const runCode = () => {
    setConsoleOutput(prev => [...prev, '> Validating logic...']);
    const challenge = challenges[currentChallengeIdx];
    
    setTimeout(() => {
      let isCorrect = false;
      try {
          const meta = challenge.meta ? JSON.parse(challenge.meta) : {};
          const regexStr = meta.regex || '';
          if (regexStr) {
             const regex = new RegExp(regexStr);
             isCorrect = regex.test(code);
          } else {
             // Fallback if no regex defined
             isCorrect = true; 
          }
      } catch (e) {
          console.error("Validation error", e);
      }

      if (isCorrect) {
        setConsoleOutput(prev => [...prev, '✓ Success: Logic validated.', '✓ Result: Challenge passed.']);
        setIsSuccess(true);
        if (currentChallengeIdx === challenges.length - 1) {
          setIsBadgeUnlocked(true);
        }
      } else {
        setConsoleOutput(prev => [...prev, '✖ Error: Script failed validation.', '✖ Help: Re-read the hint and check your syntax.']);
        setIsSuccess(false);
      }
    }, 500);
  };

  const nextChallenge = () => {
    if (currentChallengeIdx < challenges.length - 1) {
      setCurrentChallengeIdx(prev => prev + 1);
    }
  };

  const getContent = () => {
    const targetInfo = TARGET_AUDIENCES.find(t => t.slug === slug);
    let bgColor = 'bg-slate-700';
    let role = 'Professional';

    if (slug?.startsWith('dev')) {
        bgColor = 'bg-am-600';
        role = 'Developer';
    } else if (slug?.startsWith('arch')) {
        bgColor = 'bg-violet-600';
        role = 'Architect';
    } else if (slug?.startsWith('ba')) {
        bgColor = 'bg-emerald-600';
        role = 'Business Analyst';
    } else if (slug?.startsWith('po')) {
        bgColor = 'bg-orange-600';
        role = 'Product Owner';
    }

    return {
      title: targetInfo ? targetInfo.label : (slug?.split('-').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' ') || 'Path Detail'),
      role,
      bgColor,
    };
  };

  const content = getContent();

  const getHint = (challenge: LearningItem) => {
    try {
        const meta = challenge.meta ? JSON.parse(challenge.meta) : {};
        return meta.hint || "No hint available.";
    } catch { return "No hint available."; }
  };

  // --- Quiz Logic ---
  const handleQuizOptionSelect = (questionId: string, optionIndex: number) => {
    if (showQuizResults) return; // Disable changes after submit
    setUserAnswers(prev => ({ ...prev, [questionId]: optionIndex }));
  };

  const submitQuiz = () => {
    if (Object.keys(userAnswers).length < currentQuizQuestions.length) {
        if (!confirm("You haven't answered all questions. Submit anyway?")) return;
    }
    setShowQuizResults(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetQuiz = () => {
    setUserAnswers({});
    setShowQuizResults(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const calculateScore = () => {
    let score = 0;
    currentQuizQuestions.forEach(q => {
        try {
            const meta = q.meta ? JSON.parse(q.meta) : {};
            if (userAnswers[q.id] === meta.correctIndex) {
                score++;
            }
        } catch {}
    });
    return score;
  };

  const startQuizForModule = (moduleId: string) => {
      setActiveQuizModuleId(moduleId);
      setUserAnswers({});
      setShowQuizResults(false);
  };

  const closeQuiz = () => {
      setActiveQuizModuleId(null);
      setUserAnswers({});
      setShowQuizResults(false);
  };

  return (
    <div className="bg-slate-50 dark:bg-slate-950 min-h-screen transition-colors duration-200">
      {/* Header */}
      <div className={`${content.bgColor} text-white py-12 px-4 shadow-inner transition-colors duration-300`}>
        <div className="container mx-auto max-w-7xl">
          <Link to="/learn" className="inline-flex items-center text-white/80 hover:text-white mb-6 text-sm font-medium">
            <ArrowLeft size={16} className="mr-2" /> Back to Career Hub
          </Link>
          <div className="flex flex-col md:flex-row justify-between items-end gap-6">
            <div>
              <h1 className="text-3xl md:text-5xl font-black mb-2 tracking-tight">{content.title}</h1>
              <p className="text-white/80 max-w-2xl text-lg">
                Your end-to-end journey to becoming a {content.title} at top tier MNCs.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation (Hidden when in specific modes) */}
      {!isSandboxOpen && !activeQuizModuleId && (
        <div className="sticky top-[80px] bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 z-40 shadow-sm overflow-x-auto">
            <div className="container mx-auto max-w-7xl px-4">
            <div className="flex space-x-8 whitespace-nowrap">
                {[
                { id: 'path', label: 'Learning Path', icon: <BookOpen size={18} /> },
                { id: 'interview', label: 'Interview Prep', icon: <MessageSquare size={18} /> },
                { id: 'projects', label: 'Real Projects', icon: <FlaskConical size={18} /> },
                { id: 'practice', label: 'Practice Zone', icon: <PlayCircle size={18} /> },
                ].map(tab => (
                <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as TabType)}
                    className={`flex items-center py-4 px-2 border-b-2 font-bold text-sm transition ${
                    activeTab === tab.id 
                    ? `border-am-600 text-am-600 dark:text-am-400` 
                    : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                    }`}
                >
                    <span className="mr-2">{tab.icon}</span>
                    {tab.label}
                </button>
                ))}
            </div>
            </div>
        </div>
      )}

      {/* Content Area */}
      <div className="container mx-auto max-w-7xl px-4 py-12">
        {loading ? (
            <div className="text-center py-20 text-slate-500">Loading learning content...</div>
        ) : (
            <>
                {/* QUIZ INTERFACE (Overlay) */}
                {activeQuizModuleId && (
                    <div className="animate-in fade-in zoom-in-95 duration-300 max-w-3xl mx-auto">
                        <div className="mb-6">
                            <button onClick={closeQuiz} className="flex items-center text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white font-bold transition mb-4">
                                <ArrowLeft size={18} className="mr-2" /> Back to Modules
                            </button>
                            <div className="text-center">
                                <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Module Quiz</h2>
                                <p className="text-slate-600 dark:text-slate-400">Test your knowledge for this module.</p>
                            </div>
                        </div>

                        {currentQuizQuestions.length > 0 ? (
                            <div className="space-y-8">
                                {showQuizResults && (
                                    <div className="bg-white dark:bg-slate-900 border-2 border-am-500 rounded-2xl p-8 text-center shadow-lg mb-8 animate-in fade-in slide-in-from-top-4">
                                        <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Your Score</div>
                                        <div className="text-5xl font-black text-slate-900 dark:text-white mb-4">
                                            {calculateScore()} <span className="text-2xl text-slate-400">/ {currentQuizQuestions.length}</span>
                                        </div>
                                        <p className="text-slate-600 dark:text-slate-300 mb-6">
                                            {calculateScore() === currentQuizQuestions.length ? 'Perfect Score! You are a master.' : 
                                             calculateScore() > currentQuizQuestions.length / 2 ? 'Good job! Keep practicing.' : 'Review the material and try again.'}
                                        </p>
                                        <button onClick={resetQuiz} className="bg-am-600 text-white px-6 py-2 rounded-full font-bold hover:bg-am-700 transition flex items-center justify-center mx-auto">
                                            <RefreshCw size={16} className="mr-2"/> Retake Quiz
                                        </button>
                                    </div>
                                )}

                                {currentQuizQuestions.map((q, idx) => {
                                    let options = [];
                                    let correctIndex = -1;
                                    try {
                                        options = JSON.parse(q.content || '[]');
                                        correctIndex = JSON.parse(q.meta || '{}').correctIndex;
                                    } catch {}

                                    const selected = userAnswers[q.id];
                                    const isCorrect = selected === correctIndex;
                                    
                                    return (
                                        <div key={q.id} className={`bg-white dark:bg-slate-900 p-6 rounded-xl border shadow-sm transition ${
                                            showQuizResults 
                                                ? isCorrect 
                                                    ? 'border-green-500 dark:border-green-600' 
                                                    : 'border-red-500 dark:border-red-600'
                                                : 'border-slate-200 dark:border-slate-800'
                                        }`}>
                                            <div className="flex gap-4">
                                                <div className="font-mono text-sm text-slate-400 pt-1">Q{idx + 1}.</div>
                                                <div className="flex-grow">
                                                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">{q.title}</h3>
                                                    
                                                    <div className="space-y-3">
                                                        {options.map((opt: string, i: number) => {
                                                            let btnClass = "w-full text-left p-3 rounded-lg border text-sm transition flex items-center justify-between ";
                                                            
                                                            if (showQuizResults) {
                                                                if (i === correctIndex) {
                                                                    btnClass += "bg-green-50 border-green-500 text-green-800 dark:bg-green-900/30 dark:border-green-600 dark:text-green-300 font-medium";
                                                                } else if (i === selected && i !== correctIndex) {
                                                                    btnClass += "bg-red-50 border-red-500 text-red-800 dark:bg-red-900/30 dark:border-red-600 dark:text-red-300";
                                                                } else {
                                                                    btnClass += "border-slate-200 dark:border-slate-700 opacity-50";
                                                                }
                                                            } else {
                                                                if (i === selected) {
                                                                    btnClass += "bg-am-50 border-am-500 text-am-900 dark:bg-am-900/30 dark:border-am-500 dark:text-am-100 shadow-sm ring-1 ring-am-200 dark:ring-am-800";
                                                                } else {
                                                                    btnClass += "border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300";
                                                                }
                                                            }

                                                            return (
                                                                <button 
                                                                    key={i}
                                                                    onClick={() => handleQuizOptionSelect(q.id, i)}
                                                                    className={btnClass}
                                                                    disabled={showQuizResults}
                                                                >
                                                                    <span>{opt}</span>
                                                                    {showQuizResults && i === correctIndex && <CheckCircle2 size={18} className="text-green-600"/>}
                                                                    {showQuizResults && i === selected && i !== correctIndex && <XIcon size={18} className="text-red-600"/>}
                                                                </button>
                                                            );
                                                        })}
                                                    </div>

                                                    {showQuizResults && q.description && (
                                                        <div className="mt-4 p-4 bg-slate-50 dark:bg-slate-800 rounded-lg text-sm text-slate-600 dark:text-slate-300 border-l-4 border-am-500">
                                                            <strong>Explanation:</strong> {q.description}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}

                                {!showQuizResults && (
                                    <div className="text-center pt-6">
                                        <button 
                                            onClick={submitQuiz}
                                            className="bg-am-900 dark:bg-white dark:text-slate-900 text-white px-12 py-3 rounded-xl font-bold hover:bg-am-800 dark:hover:bg-slate-200 transition shadow-lg"
                                        >
                                            Submit Quiz
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="text-center p-12 bg-white dark:bg-slate-900 rounded-xl border border-dashed border-slate-300 dark:border-slate-800">
                                <p className="text-slate-500">No quiz questions available for this module yet.</p>
                            </div>
                        )}
                    </div>
                )}

                {/* PRACTICE ZONE LANDING */}
                {activeTab === 'practice' && !isSandboxOpen && (
                <div className="max-w-4xl mx-auto space-y-12">
                    <div className="text-center">
                    <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-4">Practice Zone</h2>
                    <p className="text-slate-600 dark:text-slate-400">Sharpen your ServiceNow technical skills through active challenges.</p>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-8">
                    <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm text-center group">
                        <div className="w-16 h-16 bg-am-100 dark:bg-am-900/30 text-am-600 dark:text-am-400 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition relative">
                        <Code size={32} />
                        {isBadgeUnlocked && <div className="absolute -top-2 -right-2 bg-yellow-400 p-1.5 rounded-full ring-2 ring-white dark:ring-slate-900"><Trophy size={14} className="text-slate-900"/></div>}
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Scripting Sandbox</h3>
                        <p className="text-sm text-slate-500 mb-6">{challenges.length > 0 ? `Fix ${challenges.length} broken scripts` : 'No challenges available'} to unlock the badge.</p>
                        <button 
                        onClick={() => setIsSandboxOpen(true)}
                        disabled={challenges.length === 0}
                        className="bg-slate-900 dark:bg-white dark:text-slate-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-am-600 dark:hover:bg-am-500 transition disabled:opacity-50"
                        >
                        Launch Editor
                        </button>
                    </div>
                    </div>
                </div>
                )}

                {/* SANDBOX EDITOR */}
                {isSandboxOpen && challenges.length > 0 && (
                <div className="animate-in fade-in zoom-in-95 duration-300">
                    <div className="flex justify-between items-center mb-6">
                    <button onClick={() => setIsSandboxOpen(false)} className="flex items-center text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white font-bold transition">
                        <ArrowLeft size={18} className="mr-2" /> Exit Sandbox
                    </button>
                    <div className="flex items-center space-x-6">
                        <div className="flex items-center space-x-2">
                            <Award size={18} className={isBadgeUnlocked ? 'text-yellow-400' : 'text-slate-300'} />
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Zen Coder Quest</span>
                        </div>
                        <div className="flex items-center space-x-3">
                        <span className="text-xs font-bold text-slate-400">{currentChallengeIdx + 1} / {challenges.length}</span>
                        <div className="w-40 h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                            <div className="bg-am-600 h-full transition-all duration-700 ease-out" style={{ width: `${((currentChallengeIdx + 1) / challenges.length) * 100}%` }}></div>
                        </div>
                        </div>
                    </div>
                    </div>

                    <div className="grid lg:grid-cols-12 gap-6 h-[72vh]">
                    {/* Challenge Description */}
                    <div className="lg:col-span-3 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-y-auto shadow-sm flex flex-col">
                        <div className="flex items-center text-am-600 dark:text-am-400 mb-4">
                        <Bug size={20} className="mr-2" />
                        <h3 className="font-bold uppercase tracking-widest text-xs">Bug Report</h3>
                        </div>
                        <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{challenges[currentChallengeIdx].title}</h4>
                        <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-6">
                        {challenges[currentChallengeIdx].description}
                        </p>
                        <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800 mt-auto">
                        <div className="flex items-center text-slate-500 dark:text-slate-400 mb-2">
                            <Lightbulb size={16} className="mr-2" />
                            <span className="text-[10px] font-bold uppercase tracking-wider">Solution Hint</span>
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 italic">
                            {getHint(challenges[currentChallengeIdx])}
                        </p>
                        </div>
                    </div>

                    {/* Code Editor */}
                    <div className="lg:col-span-6 bg-[#0d1117] rounded-2xl border border-slate-800 flex flex-col shadow-2xl overflow-hidden relative group">
                        <div className="bg-[#161b22] px-4 py-2.5 flex items-center justify-between border-b border-slate-800/50">
                        <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 rounded-full bg-slate-700"></div>
                            <div className="w-3 h-3 rounded-full bg-slate-700"></div>
                            <div className="w-3 h-3 rounded-full bg-slate-700"></div>
                            <span className="text-[10px] text-slate-500 font-mono ml-4 uppercase tracking-widest">script_include.js</span>
                        </div>
                        <button onClick={() => setCode(challenges[currentChallengeIdx].content || '')} className="text-slate-500 hover:text-slate-300 p-1 transition" title="Reset Code">
                            <RotateCcw size={14} />
                        </button>
                        </div>
                        <div className="flex-grow flex font-mono text-[13px] overflow-hidden">
                        <div className="bg-[#0d1117] text-[#484f58] p-4 text-right select-none border-r border-slate-800/30 min-w-[45px] pt-[1.1rem]">
                            {code.split('\n').map((_, i) => <div key={i} className="leading-6">{i + 1}</div>)}
                        </div>
                        <textarea 
                            autoFocus
                            spellCheck={false}
                            className="w-full h-full bg-[#0d1117] text-[#c9d1d9] p-4 pt-[1.1rem] outline-none resize-none caret-am-500 selection:bg-am-600/30 leading-6"
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                        />
                        </div>
                        
                        {/* Overlay Completion State */}
                        {isSuccess && isBadgeUnlocked && currentChallengeIdx === challenges.length - 1 && (
                        <div className="absolute inset-0 bg-slate-900/90 flex flex-col items-center justify-center p-8 text-center animate-in fade-in slide-in-from-bottom-10 duration-500">
                            <div className="w-24 h-24 bg-yellow-400 rounded-full flex items-center justify-center mb-6 animate-bounce">
                            <Trophy size={48} className="text-slate-900" />
                            </div>
                            <h2 className="text-3xl font-black text-white mb-2">ZEN CODER UNLOCKED!</h2>
                            <p className="text-slate-400 mb-8 max-w-sm">You've successfully squashed 10 critical bugs. Your platform mastery has reached a new tier.</p>
                            <button 
                            onClick={() => setIsSandboxOpen(false)}
                            className="bg-white text-slate-900 px-8 py-3 rounded-xl font-bold hover:bg-yellow-400 transition"
                            >
                            Collect Your Badge
                            </button>
                        </div>
                        )}

                        <div className="absolute bottom-6 right-6 flex space-x-3">
                        {isSuccess && !isBadgeUnlocked && (
                            <button 
                            onClick={nextChallenge}
                            className="bg-green-600 text-white px-6 py-2.5 rounded-xl font-bold flex items-center hover:bg-green-700 transition shadow-lg shadow-green-500/30 animate-in slide-in-from-right-4"
                            >
                            Next Bug <ArrowRight size={18} className="ml-2" />
                            </button>
                        )}
                        {!isSuccess && (
                            <button 
                            onClick={runCode}
                            className="bg-am-600 text-white px-8 py-3 rounded-xl font-bold flex items-center hover:bg-am-500 transition shadow-lg shadow-am-500/20 active:scale-95"
                            >
                            <Play size={18} className="mr-2" /> Run Script
                            </button>
                        )}
                        </div>
                    </div>

                    {/* Console Output */}
                    <div className="lg:col-span-3 bg-[#010409] rounded-2xl border border-slate-800 p-6 flex flex-col shadow-inner overflow-hidden">
                        <div className="flex items-center text-slate-500 mb-4 border-b border-slate-800 pb-2">
                        <Terminal size={14} className="mr-2" />
                        <span className="text-[10px] font-bold uppercase tracking-widest">Compiler Log</span>
                        </div>
                        <div className="flex-grow font-mono text-[11px] overflow-y-auto space-y-2 text-[#8b949e]">
                        {consoleOutput.map((line, i) => (
                            <div key={i} className={line.startsWith('✓') ? 'text-green-400' : line.startsWith('✖') ? 'text-red-400' : ''}>
                            {line}
                            </div>
                        ))}
                        <div className="animate-pulse w-1.5 h-3.5 bg-[#484f58] inline-block align-middle ml-1"></div>
                        </div>
                    </div>
                    </div>
                </div>
                )}

                {/* MODULES & LEARNING PATHS */}
                {!isSandboxOpen && !activeQuizModuleId && activeTab === 'path' && (
                <div className="grid lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-8">
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Curriculum Modules</h2>
                    {items.filter(i => i.type === 'path').length > 0 ? (
                        items.filter(i => i.type === 'path').map((item, i) => {
                            const quizCount = items.filter(q => q.type === 'quiz' && q.moduleId === item.id).length;
                            return (
                                <div key={item.id} className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-start group hover:shadow-lg transition">
                                    <div className="w-10 h-10 rounded-full bg-am-100 dark:bg-am-900/30 text-am-600 dark:text-am-400 flex items-center justify-center font-black shrink-0 mr-6 group-hover:bg-am-600 group-hover:text-white transition mb-4 sm:mb-0">
                                        {i + 1}
                                    </div>
                                    <div className="flex-grow w-full">
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="text-xl font-bold text-slate-900 dark:text-white">{item.title}</h3>
                                            <button className="text-am-600 dark:text-am-400 p-2 hover:bg-am-50 dark:hover:bg-slate-800 rounded-lg" title="Start Module">
                                                <PlayCircle size={24} />
                                            </button>
                                        </div>
                                        <p className="text-slate-600 dark:text-slate-400 text-sm mb-4 leading-relaxed">
                                        {item.description}
                                        </p>
                                        
                                        {/* Quiz Button Integrated Here */}
                                        {quizCount > 0 && (
                                            <div className="mt-2 pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                                                <button 
                                                    onClick={() => startQuizForModule(item.id)}
                                                    className="text-xs font-bold bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 px-3 py-1.5 rounded-full flex items-center hover:bg-orange-100 dark:hover:bg-orange-900/40 transition"
                                                >
                                                    <HelpCircle size={14} className="mr-1.5"/> Take Quiz ({quizCount})
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div className="p-8 text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
                            No modules found for this path yet.
                        </div>
                    )}
                    </div>
                    <div className="space-y-6">
                    <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-xl">
                        <h3 className="text-lg font-bold mb-4 flex items-center"><Sparkles size={18} className="mr-2 text-am-400"/> Certifications Included</h3>
                        <ul className="space-y-3">
                        <li className="flex items-center text-sm"><CheckCircle2 size={16} className="text-green-500 mr-2"/> ServiceNow CSA</li>
                        <li className="flex items-center text-sm"><CheckCircle2 size={16} className="text-green-500 mr-2"/> Certified Application Dev</li>
                        <li className="flex items-center text-sm text-white/50"><Lock size={16} className="mr-2"/> Micro-Certs (Flow Designer)</li>
                        </ul>
                        <button className="w-full mt-6 bg-am-600 py-3 rounded-xl font-bold hover:bg-am-700 transition">Get Started</button>
                    </div>
                    </div>
                </div>
                )}

                {/* INTERVIEW PREP */}
                {!isSandboxOpen && !activeQuizModuleId && activeTab === 'interview' && (
                <div className="space-y-6 max-w-3xl mx-auto">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Q&A Vault</h2>
                    </div>
                    {items.filter(i => i.type === 'interview').length > 0 ? (
                        items.filter(i => i.type === 'interview').map(item => (
                            <div key={item.id} className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                                <button 
                                    onClick={() => setOpenAccordionId(openAccordionId === item.id ? null : item.id)}
                                    className="w-full text-left p-6 flex justify-between items-center focus:outline-none"
                                >
                                    <h4 className="font-bold text-slate-800 dark:text-white">{item.title}</h4>
                                    {openAccordionId === item.id ? <ChevronUp className="text-am-500"/> : <ChevronDown className="text-slate-400"/>}
                                </button>
                                {openAccordionId === item.id && (
                                    <div className="px-6 pb-6 pt-2 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800">
                                        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed italic">
                                            {item.content || "No answer provided yet."}
                                        </p>
                                    </div>
                                )}
                            </div>
                        ))
                    ) : (
                        <div className="text-center p-8 text-slate-500">No interview questions added yet.</div>
                    )}
                </div>
                )}

                {/* PROJECTS */}
                {!isSandboxOpen && !activeQuizModuleId && activeTab === 'projects' && (
                    <div className="space-y-6 max-w-3xl mx-auto">
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-8">Real World Projects</h2>
                        {items.filter(i => i.type === 'project').length > 0 ? (
                            items.filter(i => i.type === 'project').map(item => (
                                <div key={item.id} className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800">
                                    <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-2">{item.title}</h3>
                                    <p className="text-slate-600 dark:text-slate-400 text-sm mb-4">{item.description}</p>
                                </div>
                            ))
                        ) : (
                            <div className="text-center p-8 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
                                <p className="text-slate-500">No projects available for this path currently.</p>
                            </div>
                        )}
                    </div>
                )}
            </>
        )}
      </div>
    </div>
  );
};

export default PathDetail;
