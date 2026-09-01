const axios = require("axios");
const ChatHistory = require("../models/ChatHistory");
const Farm = require("../models/Farm");
const Crop = require("../models/Crop");
const DiseaseHistory = require("../models/DiseaseHistory");

/**
 * Pure Tamil Agricultural Knowledge Engine Fallback (TNAU Guidelines)
 */
const getKnowledgeFallback = (userMessage, farmerName, farmContext, cropContext, diseaseContext) => {
  const msg = userMessage.toLowerCase();
  let cropName = cropContext?.name || farmContext?.cropType || "உங்கள் பயிர்";

  if (msg.includes("fertilizer") || msg.includes("npk") || msg.includes("urea") || msg.includes("dap") || msg.includes("உரம்") || msg.includes("uram")) {
    return `வணக்கம் ${farmerName}! TNAU தமிழ்நாடு வேளாண் பல்கலைக்கழக வழிகாட்டுதலின்படி ${cropName} பயிருக்கான உர மேலாண்மை:

- **அடி உரம் (Basal Dose)**: கடைசி உழவின் போது 100% டிஏபி (DAP), பொட்டாஷ் (MOP) மற்றும் வேப்பம்பொடியாக்கப்பட்ட யூரியாவை இடவும்.
- **மேல் உரம் (Top Dressing)**: நட்ட 21-வது நாள் (தூர்கட்டும் பருவம்) மற்றும் 45-வது நாளில் (கதிர் உருவாகும் பருவம்) பிரித்து இடவும்.
- 💡 உங்கள் நில பரப்பளவுக்கு தேவையான உர மூட்டைகளை துல்லியமாக கணக்கிட நமது **TNAU உரக் கணக்கீடு** (\`/calculator\`) பக்கத்தைப் பயன்படுத்தவும்.`;
  }

  if (msg.includes("yellow") || msg.includes("yellowing") || msg.includes("manjal") || msg.includes("மஞ்சள்") || msg.includes("leaf") || msg.includes("இலை")) {
    return `வணக்கம் ${farmerName}! ${cropName} பயிரில் இலைகள் மஞ்சள் நிறமாக மாற முக்கிய காரணங்கள்:

1. **நைட்ரஜன் சத்து பற்றாக்குறை**: கீழ் இலைகள் முதலில் மஞ்சள் நிறமாகும். உடனடியாக யூரியா மேல் உரம் இடவும்.
2. **நீர் தேக்கம் (Waterlogging)**: வேர்களுக்கு ஆக்சிஜன் கிடைக்காமல் இலை மஞ்சள் நிறமாகும். வடிகால் வாய்க்கால்களை சுத்தப்படுத்தவும்.
3. **பூஞ்சாணம் / வைரஸ் நோய்**: இலைகளில் புள்ளிகள் அல்லது மஞ்சள் தேமல் நோய்.
- 📸 இலை புகைப்படத்தை பதிவேற்றி துல்லியமான AI நோய் கண்டறிதல் பெற நமது **AI நோய் கண்டறிதல்** (\`/disease\`) பகுதியைப் பயன்படுத்தவும்.`;
  }

  if (msg.includes("water") || msg.includes("irrigate") || msg.includes("irrigation") || msg.includes("நீர்") || msg.includes("பாசனம்") || msg.includes("thani")) {
    return `வணக்கம் ${farmerName}! ${cropName} பயிருக்கான நீர் பாசன ஆலோசனைகள்:

- **நெல் பயிர்**: தூர்கட்டும் பருவம் முதல் பூக்கும் பருவம் வரை 2-5 செ.மீ நீர் நிறுத்துவது நல்லது. அறுவடைக்கு 10 நாட்களுக்கு முன் நீரை வடிக்கவும்.
- **மானாவாரி பயிர்கள்**: காய்ச்சலும் பாய்ச்சலுமாக (Alternate Wetting and Drying) நீர் பாசனம் செய்வது 20-30% நீரைச் சேமிக்கும்.
- 🌤️ மழை வாய்ப்பை அறிந்து பாசனம் செய்ய நமது **7-நாள் வானிலை அறிக்கை** (\`/weather\`) பக்கத்தை பார்க்கவும்.`;
  }

  if (msg.includes("yield") || msg.includes("improve") || msg.includes("samba") || msg.includes("kuruvai") || msg.includes("மகசூல்") || msg.includes("விளைச்சல்")) {
    return `வணக்கம் ${farmerName}! ${cropName} பயிரில் அதிக மகசூல் பெற TNAU முக்கிய பரிந்துரைகள்:

1. சான்றளிக்கப்பட்ட தரமான விதைகள் (TNAU / KVK விதைகள்: CO-51, ADT-43, CR1009 Sub-1) பயன்படுத்தவும்.
2. விதைகளை அசோஸ்பைரில்லம் மற்றும் பாஸ்போபாக்டீரியா உயிர் உரங்கள் கொண்டு விதை நேர்த்தி செய்யவும்.
3. ஒற்றை நாற்று நடும் முறை (SRI Method) மூலம் நெல் சாகுபடி செய்தால் கூடுதல் தூர்கள் மற்றும் அதிக மகசூல் கிடைக்கும்.
4. நட்ட 20-25 நாட்களில் முதல் களை எடுத்தல் அவசியம்.`;
  }

  if (msg.includes("disease") || msg.includes("pest") || msg.includes("பூச்சி") || msg.includes("நோய்") || msg.includes("poochi")) {
    let diseaseInfo = "";
    if (diseaseContext) {
      diseaseInfo = `\n- உங்கள் கடைசி AI பரிசோதனை முடிவு: **${diseaseContext.disease}** (${diseaseContext.severity} பாதிப்பு). சிகிச்சை: ${diseaseContext.treatment}`;
    }
    return `வணக்கம் ${farmerName}! ${cropName} பயிர் பூச்சி மற்றும் நோய் கட்டுப்பாடு:${diseaseInfo}

- சாறு உறிஞ்சும் பூச்சிகளைக் கட்டுப்படுத்த மஞ்சள் ஒட்டும் பொறிகளை (Yellow Sticky Traps) ஏக்கருக்கு 5 வீதம் வைக்கவும்.
- ஆரம்ப கட்ட பூச்சித் தாக்குதலுக்கு வேப்ப எண்ணெய் (3%) தெளிக்கவும்.
- நோய் தாக்குதல் உள்ள இலையை படம் எடுத்து **AI நோய் கண்டறிதல்** (\`/disease\`) மூலம் உடனடி தீர்வு பெறலாம்.`;
  }

  // General Tamil Fallback
  return `வணக்கம் ${farmerName}! அக்ரி நெக்சஸ் (Agri Nexus) தமிழ்நாடு விவசாயிகளுக்கான சிறப்பு AI உதவியாளர்:

1. தமிழ்நாடு வேளாண்மைப் பல்கலைக்கழகம் (TNAU) மற்றும் KVK வேளாண் அறிவியல் மையத்தின் அதிகாரப்பூர்வ பரிந்துரைகள்.
2. குறுவை, சம்பா, தாளடி மற்றும் நவரை பருவ பயிர் சாகுபடி ஆலோசனைகள்.
3. இலை நோய் கண்டறிய **AI நோய் கண்டறிதல்** (\`/disease\`), உர அளவு கணக்கிட **உரக் கணக்கீடு** (\`/calculator\`), மற்றும் **வானிலை அறிக்கை** (\`/weather\`) பயன்படுத்தவும்.

*(குறிப்பு: நேரலை AI அரட்டைக்கு \`backend/.env\` கோப்பில் \`AI_API_KEY=\` பகுதியில் இலவச Gemini API Key சேர்க்கலாம்)*`;
};

/**
 * Call backend LLM provider (Gemini / OpenAI API)
 */
const callLLMProvider = async (systemPrompt, userMessage, conversationHistory = [], fallbackParams = {}) => {
  const apiKey = process.env.AI_API_KEY;
  const modelName = process.env.AI_MODEL || "gemini-1.5-flash";

  if (!apiKey || !apiKey.trim()) {
    const { farmerName, farmContext, cropContext, diseaseContext } = fallbackParams;
    return getKnowledgeFallback(userMessage, farmerName, farmContext, cropContext, diseaseContext);
  }

  try {
    if (modelName.startsWith("gpt") || apiKey.startsWith("sk-")) {
      const messages = [
        { role: "system", content: systemPrompt },
        ...conversationHistory.map((m) => ({
          role: m.role === "assistant" ? "assistant" : "user",
          content: m.content,
        })),
        { role: "user", content: userMessage },
      ];

      const response = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          model: modelName || "gpt-3.5-turbo",
          messages,
          temperature: 0.7,
        },
        {
          headers: {
            Authorization: `Bearer ${apiKey.trim()}`,
            "Content-Type": "application/json",
          },
          timeout: 25000,
        }
      );

      return (
        response.data?.choices?.[0]?.message?.content ||
        "மன்னிக்கவும், இப்போது பதில் உருவாக்க முடியவில்லை."
      );
    } else {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey.trim()}`;

      let combinedText = `${systemPrompt}\n\n`;

      if (conversationHistory.length > 0) {
        combinedText += "RECENT CONVERSATION HISTORY:\n";
        conversationHistory.slice(-4).forEach((m) => {
          combinedText += `${m.role === "user" ? "Farmer" : "Assistant"}: ${m.content}\n`;
        });
        combinedText += "\n";
      }

      combinedText += `CURRENT FARMER QUESTION:\n${userMessage}`;

      const response = await axios.post(
        url,
        {
          contents: [
            {
              parts: [{ text: combinedText }],
            },
          ],
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          timeout: 25000,
        }
      );

      const candidate = response.data?.candidates?.[0];
      const replyText = candidate?.content?.parts?.[0]?.text;

      if (replyText) {
        return replyText.trim();
      }

      return "மன்னிக்கவும், பதில் உருவாக்க முடியவில்லை. தயவுசெய்து உங்கள் கேள்வியை மீண்டும் கேட்கவும்.";
    }
  } catch (error) {
    console.error("AI Provider API Error:", error.response?.data || error.message);
    const { farmerName, farmContext, cropContext, diseaseContext } = fallbackParams;
    return getKnowledgeFallback(userMessage, farmerName, farmContext, cropContext, diseaseContext);
  }
};

// @desc    Send message to AI Assistant
// @route   POST /api/ai-assistant/chat
// @access  Private
const sendMessage = async (req, res) => {
  try {
    const { message, sessionId: inputSessionId, farmId, cropId } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: "Message content cannot be empty",
      });
    }

    const sessionId =
      inputSessionId && inputSessionId.trim()
        ? inputSessionId.trim()
        : `session_${req.user._id}_${Date.now()}`;

    // Fetch Farmer Details
    const farmerName = req.user.name || "விவசாயி";
    const farmerLocation = [req.user.village, req.user.district, req.user.state]
      .filter(Boolean)
      .join(", ");

    // Fetch Selected Farm Context
    let farmContext = null;
    if (farmId) {
      const farm = await Farm.findOne({ _id: farmId, farmer: req.user._id });
      if (farm) {
        farmContext = {
          name: farm.farmName,
          location: farm.location,
          area: `${farm.area} ${farm.areaUnit || "Acres"}`,
          soilType: farm.soilType,
          waterSource: farm.waterSource,
          cropType: farm.cropType,
        };
      }
    }

    // Fetch Selected Crop Context
    let cropContext = null;
    if (cropId) {
      const crop = await Crop.findOne({ _id: cropId, farmer: req.user._id }).populate("farm", "farmName");
      if (crop) {
        cropContext = {
          name: crop.cropName,
          variety: crop.variety,
          season: crop.season,
          status: crop.status,
          sowingDate: crop.sowingDate ? new Date(crop.sowingDate).toLocaleDateString() : "N/A",
          expectedHarvestDate: crop.expectedHarvestDate
            ? new Date(crop.expectedHarvestDate).toLocaleDateString()
            : "N/A",
          notes: crop.notes,
        };
      }
    }

    // Fetch Recent Disease History Context
    let diseaseContext = null;
    const recentScan = await DiseaseHistory.findOne({ farmer: req.user._id })
      .sort({ createdAt: -1 })
      .populate("crop", "cropName");

    if (recentScan) {
      diseaseContext = {
        disease: recentScan.disease,
        confidence: `${recentScan.confidence}%`,
        severity: recentScan.severity,
        treatment: recentScan.treatment,
        prevention: recentScan.prevention,
        date: new Date(recentScan.createdAt).toLocaleDateString(),
      };
    }

    // System Prompt explicitly requiring TAMIL response by default
    let systemPrompt = `SYSTEM ROLE & INSTRUCTIONS:
You are the official AI Farming Assistant for "Agri Nexus – Intelligent Smart Farming Platform" specifically serving Tamil Nadu farmers (தமிழ்நாடு விவசாயிகள்).
IMPORTANT MANDATE: ALWAYS RESPOND IN TAMIL SCRIPT (தமிழ்) BY DEFAULT (or Tanglish if specifically typed in Tanglish by the farmer).
Follow TNAU (Tamil Nadu Agricultural University) guidelines and regional crop cycles: Kuruvai (குருவை), Samba (சம்பா), Thaladi (தாளடி), and Navarai/Summer.

CRITICAL GUIDELINES YOU MUST FOLLOW:
1. Provide all explanations, advice, and bullet points in clear, friendly Tamil (தமிழ்).
2. Focus strictly on agriculture, crop cultivation, pest management, plant diseases, fertilizers, soil health, irrigation, harvesting, and sustainable farming in Tamil Nadu.
3. If the user asks a non-agricultural question, politely explain in Tamil that you focus strictly on Tamil Nadu farming and agriculture.
4. Use the provided Farmer, Farm, Crop, and Disease context whenever relevant.
5. If information is uncertain, state the uncertainty in Tamil. Do NOT invent fake weather forecasts or fake disease diagnoses.
6. For leaf photo disease diagnosis, instruct the farmer in Tamil to use the built-in "AI Disease Detection" module (/disease).
7. For chemical pesticides and fertilizers, encourage following TNAU Agritech portal & product label instructions. Do not prescribe unsafe chemical dosages.

ACTIVE FARMER & FIELD CONTEXT:
- Farmer Name: ${farmerName}
- Farmer Location: ${farmerLocation || "Tamil Nadu"}`;

    if (farmContext) {
      systemPrompt += `\n\nSELECTED FARM DETAILS:
- Farm Name: ${farmContext.name}
- Location: ${farmContext.location}
- Area: ${farmContext.area}
- Soil Type: ${farmContext.soilType}
- Irrigation Source: ${farmContext.waterSource}`;
    }

    if (cropContext) {
      systemPrompt += `\n\nSELECTED CROP DETAILS:
- Crop Name: ${cropContext.name}
- Variety: ${cropContext.variety || "Standard"}
- Season: ${cropContext.season}
- Stage/Status: ${cropContext.status}
- Sowing Date: ${cropContext.sowingDate}
- Expected Harvest: ${cropContext.expectedHarvestDate}`;
    }

    if (diseaseContext) {
      systemPrompt += `\n\nRECENT AI DISEASE SCAN HISTORY:
- Last Scanned Disease: ${diseaseContext.disease} (Severity: ${diseaseContext.severity}, Confidence: ${diseaseContext.confidence})
- Recommended Treatment: ${diseaseContext.treatment}
- Scan Date: ${diseaseContext.date}`;
    }

    // Retrieve previous messages
    let chatDoc = await ChatHistory.findOne({ farmer: req.user._id, sessionId });
    const previousMessages = chatDoc ? chatDoc.messages.slice(-6) : [];

    // Call LLM with Smart Fallback parameters
    const fallbackParams = { farmerName, farmContext, cropContext, diseaseContext };
    const aiReplyText = await callLLMProvider(systemPrompt, message.trim(), previousMessages, fallbackParams);

    // Save Chat History
    if (!chatDoc) {
      chatDoc = new ChatHistory({
        farmer: req.user._id,
        sessionId,
        messages: [],
      });
    }

    const now = new Date();
    chatDoc.messages.push({
      role: "user",
      content: message.trim(),
      timestamp: now,
    });

    chatDoc.messages.push({
      role: "assistant",
      content: aiReplyText,
      timestamp: now,
    });

    await chatDoc.save();

    return res.status(200).json({
      success: true,
      message: "Response generated",
      data: {
        sessionId,
        reply: {
          role: "assistant",
          content: aiReplyText,
          timestamp: now,
        },
      },
    });
  } catch (error) {
    console.error("aiAssistantController.sendMessage error:", error);
    return res.status(500).json({
      success: false,
      message: "An internal server error occurred while processing your query.",
    });
  }
};

// @desc    Get Chat History
// @route   GET /api/ai-assistant/history/:sessionId
// @access  Private
const getChatHistory = async (req, res) => {
  try {
    const { sessionId } = req.params;

    if (!sessionId) {
      return res.status(400).json({
        success: false,
        message: "Session ID is required",
      });
    }

    const history = await ChatHistory.findOne({
      farmer: req.user._id,
      sessionId,
    });

    return res.status(200).json({
      success: true,
      data: {
        sessionId,
        messages: history ? history.messages : [],
      },
    });
  } catch (error) {
    console.error("aiAssistantController.getChatHistory error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve chat history.",
    });
  }
};

// @desc    Clear Chat History
// @route   DELETE /api/ai-assistant/history/:sessionId
// @access  Private
const clearChatHistory = async (req, res) => {
  try {
    const { sessionId } = req.params;

    if (!sessionId) {
      return res.status(400).json({
        success: false,
        message: "Session ID is required",
      });
    }

    await ChatHistory.findOneAndDelete({
      farmer: req.user._id,
      sessionId,
    });

    return res.status(200).json({
      success: true,
      message: "Chat history cleared successfully",
      data: {
        sessionId,
      },
    });
  } catch (error) {
    console.error("aiAssistantController.clearChatHistory error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to clear chat history.",
    });
  }
};

module.exports = {
  sendMessage,
  getChatHistory,
  clearChatHistory,
};
