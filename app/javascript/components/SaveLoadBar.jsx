import React, { useState } from "react";

const SaveLoadBar = ({ onSave, onReset }) => {
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const handleSave = async () => {
    setSaving(true);
    try {
      await onSave();
      setMessage("セーブしました");
      setTimeout(() => setMessage(""), 2000);
    } catch (e) {
      setMessage("セーブに失敗しました");
      setTimeout(() => setMessage(""), 3000);
    }
    setSaving(false);
  };

  const handleReset = () => {
    if (window.confirm("本当にリセットしますか？全てのデータが失われます。")) {
      onReset();
      setMessage("リセットしました");
      setTimeout(() => setMessage(""), 2000);
    }
  };

  return (
    <div className="save-bar">
      <button className="btn btn-save" onClick={handleSave} disabled={saving}>
        {saving ? "保存中..." : "セーブ"}
      </button>
      <button className="btn btn-reset" onClick={handleReset}>
        リセット
      </button>
      {message && <span className="save-message">{message}</span>}
    </div>
  );
};

export default SaveLoadBar;
