import { useEffect, useMemo, useRef, useState } from "react";
import JoditEditor from "jodit-react";
import { Link } from "react-router-dom";
import { FaArrowLeftLong } from "react-icons/fa6";
import { API_BASE_URL } from "../../config/api";
import useAuthStore from "../../store/useAuthStore";

const SiteContentEditor = ({ title, section }) => {
  const editor = useRef(null);
  const accessToken = useAuthStore((state) => state.accessToken);
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const config = useMemo(
    () => ({
      readonly: false,
      placeholder: "Start typing...",
      height: 600,
      iframe: false,
    }),
    []
  );

  useEffect(() => {
    const fetchContent = async () => {
      setIsLoading(true);
      setError("");
      setSuccessMessage("");

      try {
        const response = await fetch(`${API_BASE_URL}/api/v1/site-content/${section}`);
        const result = await response.json();

        if (response.status === 404) {
          setContent("");
          return;
        }

        if (!response.ok || !result?.success) {
          throw new Error(result?.message || "Failed to load site content.");
        }

        setContent(result?.data?.content || "");
      } catch (contentError) {
        console.error("[siteContent] fetch failed:", contentError);
        setContent("");
      } finally {
        setIsLoading(false);
      }
    };

    fetchContent();
  }, [section]);

  const handleSave = async () => {
    setIsSaving(true);
    setError("");
    setSuccessMessage("");

    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/site-content/${section}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        },
        body: JSON.stringify({ content }),
      });
      const result = await response.json();

      if (!response.ok || !result?.success) {
        throw new Error(result?.message || "Failed to save site content.");
      }

      setContent(result?.data?.content || content);
      setSuccessMessage("Content saved successfully.");
    } catch (saveError) {
      setError(saveError.message || "Failed to save site content.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen mt-16">
      <Link
        to="/settings"
        className="flex items-center mt-16 mb-6 p-[18px] rounded text-white bg-[#B74140] gap-x-3"
      >
        <FaArrowLeftLong size={20} />
        <h1 className="text-2xl font-semibold">{title}</h1>
      </Link>

      {error && (
        <div className="p-3 mb-4 text-sm text-red-600 bg-red-50 border border-red-100 rounded">
          {error}
        </div>
      )}

      {successMessage && (
        <div className="p-3 mb-4 text-sm text-green-600 bg-green-50 border border-green-100 rounded">
          {successMessage}
        </div>
      )}

      <div>
        {isLoading ? (
          <div className="flex items-center justify-center h-64 text-gray-500 bg-white border rounded">
            Loading content...
          </div>
        ) : (
          <JoditEditor
            ref={editor}
            value={content}
            config={config}
            tabIndex={1}
            onBlur={(newContent) => setContent(newContent)}
            onChange={() => {}}
          />
        )}

        <div className="text-center">
          <button
            type="button"
            onClick={handleSave}
            disabled={isLoading || isSaving}
            className="bg-[#B74140] p-2 text-white mt-2 rounded-lg disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSaving ? "Saving..." : "Save Change"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SiteContentEditor;
