import APIKeys from "../model/APIKeys.model.js";

export const verifyApiKey = async (req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  if (!apiKey) return res.status(401).json({ error: "API key missing" });

  const keyRecord = await APIKeys.findOne({ key: apiKey, isActive: true });
  if (!keyRecord) return res.status(403).json({ error: "Invalid API key" });

  req.apiKey = keyRecord;
  next();
};