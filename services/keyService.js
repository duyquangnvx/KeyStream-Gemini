const fs = require("fs");
const config = require("../config");

let keyPool = [];

const loadKeys = () => {
  try {
    if (!fs.existsSync(config.KEY_FILE)) {
      fs.writeFileSync(config.KEY_FILE, "[]");
    }
    const raw = fs.readFileSync(config.KEY_FILE, "utf8");
    const keys = JSON.parse(raw);
    keyPool = keys.map((k) => {
      const existing = keyPool.find((old) => old.key === k);
      return (
        existing || {
          key: k,
          status: "active",
          usage: 0,
          errors: 0,
          lastUsed: 0,
        }
      );
    });
    console.log(`Loaded ${keyPool.length} keys.`);
  } catch (e) {
    console.error("Error loading keys:", e.message);
  }
};

const saveKeys = () => {
  try {
    fs.writeFileSync(
      config.KEY_FILE,
      JSON.stringify(
        keyPool.map((k) => k.key),
        null,
        2,
      ),
    );
  } catch (e) {
    console.error("Error saving keys:", e.message);
  }
};

const getOptimalKey = (excludeKeys = []) => {
  const now = Date.now();

  const availableKeys = keyPool.filter(
    (k) => !excludeKeys.includes(k.key) && k.status === "active",
  );

  if (availableKeys.length > 0) {
    return availableKeys.sort((a, b) => a.lastUsed - b.lastUsed)[0];
  }

  const cooldownKeys = keyPool.filter(
    (k) => !excludeKeys.includes(k.key) && k.status === "cooldown",
  );

  const recoveredKey = cooldownKeys.find(
    (k) => now - k.lastUsed > config.KEY_COOLDOWN_TIME,
  );
  if (recoveredKey) {
    recoveredKey.status = "active";
    return recoveredKey;
  }

  return null;
};

const addKey = (key) => {
  if (key && !keyPool.find((k) => k.key === key)) {
    keyPool.push({ key, status: "active", usage: 0, errors: 0, lastUsed: 0 });
    saveKeys();
    return true;
  }
  return false;
};

const updateKeyStatus = (key, status) => {
  const keyObj = keyPool.find((k) => k.key === key);
  if (keyObj) {
    keyObj.status = status;
    keyObj.lastUsed = Date.now();
  }
};

const incrementKeyErrors = (key) => {
  const keyObj = keyPool.find((k) => k.key === key);
  if (keyObj) {
    keyObj.errors++;
  }
};

const incrementKeyUsage = (key) => {
  const keyObj = keyPool.find((k) => k.key === key);
  if (keyObj) {
    keyObj.usage++;
  }
};

const getKeyPool = () => [...keyPool];

module.exports = {
  loadKeys,
  saveKeys,
  getOptimalKey,
  addKey,
  updateKeyStatus,
  incrementKeyErrors,
  incrementKeyUsage,
  getKeyPool,
};
