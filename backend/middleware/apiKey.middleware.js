import APIKeys from "../model/APIKeys.model.js";

export const verifyApiKey = async (req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  if (!apiKey) return res.status(401).json({ error: "API key missing" });

  const keyRecord = await APIKeys.findOne({ key: apiKey, isActive: true });
  if (!keyRecord) return res.status(403).json({ error: "Invalid API key" });

  // Check for expiration
  if (keyRecord.expiresAt && new Date() > keyRecord.expiresAt) {
    return res.status(403).json({ error: "API key has expired" });
  }

  // Optionally update `lastUsed`
  keyRecord.lastUsed = new Date();
  await keyRecord.save();
  
  req.apiKey = keyRecord;
  next();
};