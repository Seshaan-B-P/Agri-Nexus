import { useEffect, useState, useRef } from "react";
import { FaRobot, FaPaperPlane, FaTrash, FaTractor, FaLightbulb, FaUser, FaCheck, FaExclamationCircle } from "react-icons/fa";
import toast from "react-hot-toast";

import { sendMessage, getChatHistory, clearChatHistory } from "../services/aiAssistantService";
import { getFarms } from "../services/farmService";
import { getCrops } from "../services/cropService";
import { useLanguage } from "../context/LanguageContext";

function AIFarmingAssistant() {
  const { t, language } = useLanguage();

  const [farms, setFarms] = useState([]);
  const [crops, setCrops] = useState([]);
  const [selectedFarm, setSelectedFarm] = useState("");
  const [selectedCrop, setSelectedCrop] = useState("");

  const [inputMessage, setInputMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sessionId, setSessionId] = useState("");

  const messagesEndRef = useRef(null);

  const quickQuestions = language === "ta" ? [
    "நெல் பயிருக்கு TNAU பரிந்துரைக்கும் உரம் எது?",
    "பயிரில் மஞ்சள் இலை தெரிகிறது - என்ன செய்வது?",
    "குருவை / சம்பா பருவத்தில் பயிர் பாதுகாப்பு ஆலோசனைகள்?",
    "கோடைகாலத்தில் பாசன இடைவெளி எவ்வளவு இருக்க வேண்டும்?",
    "வாழை பயிரில் இலை நோய் தடுப்பு முறைகள் என்ன?",
  ] : [
    "TNAU recommended fertilizer for Paddy (Nel)?",
    "Paddy il manjal ilai irukku - What to do?",
    "Kuruvai / Samba season crop protection advice?",
    "How often should I irrigate during Tamil Nadu summer?",
    "How to prevent common leaf diseases in Banana (Vazhai)?",
  ];

  // Initialize Session ID & Load Context Data
  useEffect(() => {
    let storedSession = localStorage.getItem("agri_ai_session_id");
    if (!storedSession) {
      storedSession = `session_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
      localStorage.setItem("agri_ai_session_id", storedSession);
    }
    setSessionId(storedSession);

    loadFarmsAndCrops();
    fetchHistory(storedSession);
  }, []);

  // Auto Scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const loadFarmsAndCrops = async () => {
    try {
      const [farmRes, cropRes] = await Promise.allSettled([getFarms(), getCrops()]);
      if (farmRes.status === "fulfilled") setFarms(farmRes.value.farms || []);
      if (cropRes.status === "fulfilled") setCrops(cropRes.value.crops || []);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchHistory = async (sessId) => {
    try {
      const res = await getChatHistory(sessId);
      if (res.success && res.data?.messages) {
        setMessages(res.data.messages);
      }
    } catch (err) {
      console.error("Failed to load chat history:", err);
    }
  };

  const handleSend = async (messageTextToSend) => {
    const text = messageTextToSend || inputMessage;
    if (!text || !text.trim() || loading) return;

    setError(null);
    const userMsgText = text.trim();
    setInputMessage("");

    // Optimistic UI update
    const userTimestamp = new Date();
    const newUserMsg = {
      role: "user",
      content: userMsgText,
      timestamp: userTimestamp,
    };

    setMessages((prev) => [...prev, newUserMsg]);
    setLoading(true);

    try {
      const res = await sendMessage({
        message: userMsgText,
        sessionId,
        farmId: selectedFarm || undefined,
        cropId: selectedCrop || undefined,
      });

      if (res.success && res.data?.reply) {
        setMessages((prev) => [...prev, res.data.reply]);
        if (res.data.sessionId && res.data.sessionId !== sessionId) {
          setSessionId(res.data.sessionId);
          localStorage.setItem("agri_ai_session_id", res.data.sessionId);
        }
      } else {
        throw new Error(res.message || "Failed to get AI response");
      }
    } catch (err) {
      console.error(err);
      const errText = err.response?.data?.message || err.message || "Failed to send message.";
      setError(errText);
      toast.error(errText);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleClearHistory = async () => {
    if (!window.confirm("Are you sure you want to clear your conversation history?")) return;

    try {
      await clearChatHistory(sessionId);
      setMessages([]);
      toast.success("Chat history cleared");
    } catch (err) {
      console.error(err);
      toast.error("Failed to clear chat history");
    }
  };

  const filteredCrops = selectedFarm
    ? crops.filter((c) => (typeof c.farm === "object" ? c.farm._id : c.farm) === selectedFarm)
    : crops;

  return (
    <div className="max-w-7xl mx-auto p-3 sm:p-6 space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-800 via-teal-800 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 opacity-10 text-9xl pointer-events-none">
          🤖
        </div>
        <div className="relative z-10 space-y-1">
          <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-extrabold uppercase tracking-wider text-emerald-200">
            {t("aiAssistantSubtitle")}
          </span>
          <h1 className="text-2xl sm:text-3xl font-black flex items-center gap-3">
            <FaRobot className="text-emerald-400" /> {t("aiAssistantTitle")}
          </h1>
          <p className="text-xs sm:text-sm text-emerald-100/90 font-medium max-w-2xl">
            Ask any questions regarding crop cultivation, disease prevention, fertilizers, soil health, and harvesting advice tailored to your active farm context.
          </p>
        </div>

        {messages.length > 0 && (
          <button
            onClick={handleClearHistory}
            className="flex items-center gap-2 bg-red-500/20 hover:bg-red-600 text-white font-bold text-xs px-4 py-2.5 rounded-xl border border-red-400/30 transition-all z-10"
          >
            <FaTrash /> {t("clearChat")}
          </button>
        )}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-4 space-y-6">
          {/* Context Selector */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 space-y-4">
            <h2 className="text-sm font-black text-slate-800 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-3">
              <FaTractor className="text-emerald-600" /> {t("activeContext")}
            </h2>

            <div className="space-y-3">
              <div>
                <label className="block text-[11px] font-extrabold text-slate-500 uppercase tracking-wider mb-1">
                  1. {t("selectFarm")}
                </label>
                <select
                  value={selectedFarm}
                  onChange={(e) => {
                    setSelectedFarm(e.target.value);
                    setSelectedCrop("");
                  }}
                  className="w-full border border-slate-200 rounded-xl p-3 text-xs font-semibold text-slate-800 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none transition"
                >
                  <option value="">{t("noContext")}</option>
                  {farms.map((f) => (
                    <option key={f._id} value={f._id}>
                      {f.farmName} ({f.location})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-extrabold text-slate-500 uppercase tracking-wider mb-1">
                  2. {t("selectCrop")}
                </label>
                <select
                  value={selectedCrop}
                  onChange={(e) => setSelectedCrop(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl p-3 text-xs font-semibold text-slate-800 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none transition"
                >
                  <option value="">{t("noContext")}</option>
                  {filteredCrops.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.cropName} ({c.variety || "Standard"})
                    </option>
                  ))}
                </select>
              </div>

              {(selectedFarm || selectedCrop) && (
                <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-xl flex items-center justify-between text-xs text-emerald-800">
                  <span className="font-bold flex items-center gap-1.5">
                    <FaCheck className="text-emerald-600" /> Context Active
                  </span>
                  <button
                    onClick={() => {
                      setSelectedFarm("");
                      setSelectedCrop("");
                    }}
                    className="text-[10px] font-bold text-emerald-700 underline hover:text-emerald-900"
                  >
                    Reset
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Quick Suggestions */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 space-y-3">
            <h2 className="text-sm font-black text-slate-800 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-3">
              <FaLightbulb className="text-amber-500" /> {t("quickPrompts")}
            </h2>
            <div className="space-y-2">
              {quickQuestions.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(q)}
                  disabled={loading}
                  className="w-full text-left bg-slate-50 hover:bg-emerald-50 text-slate-700 hover:text-emerald-900 p-3 rounded-xl border border-slate-100 text-xs font-semibold transition-all hover:border-emerald-200 flex items-center justify-between group disabled:opacity-50"
                >
                  <span>{q}</span>
                  <span className="text-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Chat Stream */}
        <div className="lg:col-span-8 flex flex-col h-[650px] bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4 bg-slate-50/50">
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400 space-y-3">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-3xl shadow-inner">
                  <FaRobot />
                </div>
                <h3 className="text-lg font-bold text-slate-700">
                  {language === "ta" ? "இன்று உங்கள் பண்ணைக்கு எவ்வாறு உதவ முடியும்?" : "How can I assist your farm today?"}
                </h3>
                <p className="text-xs max-w-sm">
                  {language === "ta"
                    ? "உர அளவு, பாசன இடைவெளி, பூச்சி நோய் பற்றி தமிழ் அல்லது ஆங்கிலத்தில் கேட்கலாம்."
                    : "Ask questions about fertilizer dosages, irrigation frequency, pest control, or select a farm context from the left panel."}
                </p>
              </div>
            ) : (
              messages.map((m, index) => {
                const isUser = m.role === "user";
                return (
                  <div
                    key={index}
                    className={`flex items-start gap-3 ${isUser ? "flex-row-reverse" : "flex-row"}`}
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 shadow-sm ${
                        isUser
                          ? "bg-emerald-600 text-white"
                          : "bg-slate-900 text-emerald-400 border border-slate-800"
                      }`}
                    >
                      {isUser ? <FaUser /> : <FaRobot />}
                    </div>

                    <div
                      className={`max-w-[80%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed shadow-xs ${
                        isUser
                          ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-medium rounded-tr-none"
                          : "bg-white text-slate-800 border border-slate-200/80 rounded-tl-none font-normal space-y-1"
                      }`}
                    >
                      <div className="whitespace-pre-wrap">{m.content}</div>
                      <div
                        className={`text-[10px] mt-1.5 text-right ${
                          isUser ? "text-emerald-100" : "text-slate-400"
                        }`}
                      >
                        {m.timestamp
                          ? new Date(m.timestamp).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })
                          : ""}
                      </div>
                    </div>
                  </div>
                );
              })
            )}

            {loading && (
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-slate-900 text-emerald-400 flex items-center justify-center text-xs font-bold border border-slate-800">
                  <FaRobot />
                </div>
                <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-none p-4 text-xs text-slate-500 flex items-center gap-3 shadow-xs">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-emerald-600"></div>
                  <span className="font-semibold italic">{t("aiThinking")}</span>
                </div>
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-xl text-xs flex items-center gap-2">
                <FaExclamationCircle className="text-red-500 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-3 sm:p-4 bg-white border-t border-slate-100">
            <div className="relative flex items-center gap-2">
              <textarea
                rows="2"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={t("typeMessagePlaceholder")}
                className="w-full border border-slate-200 rounded-2xl p-3.5 pr-14 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none resize-none"
              />

              <button
                onClick={() => handleSend()}
                disabled={loading || !inputMessage.trim()}
                className="absolute right-3 p-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold transition-all shadow-md hover:shadow-lg disabled:opacity-40 disabled:cursor-not-allowed"
                title="Send Message"
              >
                <FaPaperPlane className="text-xs" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AIFarmingAssistant;
