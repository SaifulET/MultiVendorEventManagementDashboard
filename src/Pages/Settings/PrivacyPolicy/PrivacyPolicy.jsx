import React, { useState, useRef, useEffect } from "react";
import JoditEditor from "jodit-react";
import { FaArrowLeftLong } from "react-icons/fa6";
import { Link } from "react-router-dom";

const PrivacyPolicy = () => {
  const editor = useRef(null);
  const [content, setContent] = useState("");

  const config = {
    readonly: false,
    placeholder: "Start typing...",
    height: 600,
    iframe: false,

  };

  return (
    <div className="min-h-screen ">
      <Link
        to={"/"}
        className="flex items-center mt-16 mb-6 text-white gap-x-3"
      >
        <FaArrowLeftLong size={20} />
        <h1 className="text-2xl font-semibold "> Privacy Policy</h1>
      </Link>
      <div>
        <JoditEditor
          ref={editor}
          value={content}
          config={config}
          tabIndex={1}
          onBlur={(newContent) => setContent(newContent)}
          onChange={() => {}}
        />
        <div className="text-center">
          <button className="bg-[#319FCA] p-2 text-white  mt-2 rounded-lg">
            Save Change
          </button>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
