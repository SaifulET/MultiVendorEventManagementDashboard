import React, { useState, useRef, useEffect } from "react";
import JoditEditor from "jodit-react";
import { FaArrowLeftLong } from "react-icons/fa6";
import { Link } from "react-router-dom";

const AboutUs = () => {
  const editor = useRef(null);
  const [content, setContent] = useState("");

  const config = {
    readonly: false,
    placeholder: "Start typing...",
    height: 600,
    iframe: false,
  };

  return (
    <div className="min-h-screen mt-16 ">
      <Link
        to={"/"}
        className="flex items-center mt-16 mb-6 text-white gap-x-3"
      >
        <FaArrowLeftLong size={20} />
        <h1 className="text-2xl font-semibold "> About Us</h1>
      </Link>
      <di className="mt-5">
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
      </di>
    </div>
  );
};

export default AboutUs;
