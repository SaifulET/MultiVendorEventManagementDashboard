import { useState, useEffect } from "react";
import { EyeOff, ChevronLeft, ChevronRight, X, Check } from "lucide-react";
import { Link } from "react-router-dom"; // Import Link component for routing

const sneakerImage =
  "https://assets.adidas.com/images/h_2000,f_auto,q_auto,fl_lossy,c_fill,g_auto/c576e5afc4db4e3e81ba2df74cd064bd_9366/Anthony_Edwards_1_Low_Shoes_Grey_JS1775_01_00_standard.jpg";

const aiCheckOptions = ["Authentic", "Fake"];
const humanCheckOptions = ["Authentic", "Fake"];
const brands = ["Adidas", "Nike", "Puma", "Reebok", "Converse", "New Balance"];
const sneakerNames = [
  "Basketball",
  "Running",
  "Casual",
  "High-Top",
  "Skate",
  "Trainer",
];

function generateRandomData(count) {
  const data = [];
  for (let i = 1; i <= count; i++) {
    const day = Math.floor(Math.random() * 31) + 1;
    const date = `12/${day.toString().padStart(2, "0")}/25`;
    const brand = brands[Math.floor(Math.random() * brands.length)];
    const sneakerName =
      sneakerNames[Math.floor(Math.random() * sneakerNames.length)];
    const aiCheckStatus =
      aiCheckOptions[Math.floor(Math.random() * aiCheckOptions.length)];
    const humanCheckStatus =
      humanCheckOptions[Math.floor(Math.random() * humanCheckOptions.length)];
    const confidenceScore = `${Math.floor(Math.random() * 101)
      .toString()
      .padStart(2, "0")}%`;

    data.push({
      id: i,
      date,
      sneakersImg: sneakerImage,
      sneakersAlt: sneakerName,
      brand,
      aiCheck: aiCheckStatus,
      humanCheck: humanCheckStatus,
      confidenceScore,
      aiCheckStatus: aiCheckStatus.toLowerCase(),
      humanCheckStatus: humanCheckStatus.toLowerCase(),
    });
  }
  return data;
}

const PAGE_SIZE = 10;

const AnalysisPage = () => {
  const [page, setPage] = useState(1);
  const [data, setData] = useState([]);

  useEffect(() => {
    const generatedData = generateRandomData(1239);
    setData(generatedData);
  }, []);

  const totalPages = Math.ceil(data.length / PAGE_SIZE);
  const pagedData = data.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="min-h-screen p-4 mt-10 font-sans text-white bg-black sm:p-6">
      <div className="flex flex-col items-start justify-between gap-4 mb-6 sm:flex-row sm:items-center">
        <h1 className="text-2xl font-semibold text-white sm:text-3xl">Analysis</h1>
        <input
          type="search"
          placeholder="Search here..."
          className="w-full px-4 py-2 text-base text-white bg-gray-800 border border-gray-700 rounded-lg sm:w-auto focus:outline-none focus:ring-2 focus:ring-green-600"
        />
      </div>

      <div className="overflow-x-auto rounded-lg shadow-lg">
        <table className="w-full text-sm text-left text-gray-300 sm:text-base">
          <thead className="text-xs text-gray-400 uppercase">
            <tr>
              {[
                "Date",
                "Sneakers",
                "Brand",
                "AI Check",
                "Human Check",
                "Confidence Score",
                "Action",
              ].map((header) => (
                <th
                  key={header}
                  scope="col"
                  className="px-4 py-3 font-medium sm:px-6 sm:py-4"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {pagedData.map((row) => (
              <tr
                key={row.id}
                className="transition-colors duration-200 ease-in-out hover:bg-gray-800"
              >
                <td className="px-4 sm:px-6 ">{row.date}</td>
                <td className="flex items-center gap-2 px-4 sm:px-6 ">
                  <img
                    src={row.sneakersImg}
                    alt={row.sneakersAlt}
                    className="object-contain w-10 h-10 rounded-md shadow"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src =
                        "https://placehold.co/40x40/555/FFF?text=N/A";
                    }}
                  />
                  {row.sneakersAlt}
                </td>
                <td className="px-4 sm:px-6 ">{row.brand}</td>
                <td className="px-4 sm:px-6 ">
                  {row.aiCheckStatus === "authentic" ? (
                    <span className="inline-flex items-center gap-1 text-green-400">
                      <Check className="w-5 h-5" />
                      {row.aiCheck}
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-red-500">
                      <X className="w-5 h-5" />
                      {row.aiCheck}
                    </span>
                  )}
                </td>
                <td className="px-4 sm:px-6 ">
                  {row.humanCheckStatus === "authentic" ? (
                    <span className="inline-flex items-center gap-1 font-medium text-green-400">
                      <Check className="w-5 h-5" />
                      {row.humanCheck}
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 font-medium text-red-500">
                      <X className="w-5 h-5" />
                      {row.humanCheck}
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 font-semibold sm:px-6 sm:py-4">
                  {row.confidenceScore}
                </td>
                <td className="px-4 py-3 sm:px-6 sm:py-4">
                  <Link
                    to={`/analysis/${row.id}`}  // Navigate to Analysis page with ID
                    className="p-2 text-gray-400 transition-colors duration-200 rounded-full hover:text-green-500 hover:bg-gray-700"
                    title="View Details"
                    aria-label="View Details"
                  >
                    <EyeOff className="w-5 h-5" />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col items-center justify-center gap-4 mt-8 text-sm text-gray-300 sm:flex-row sm:gap-x-28">
        <span className="text-base">
          Showing{" "}
          <span className="font-semibold text-white">
            {Math.min(page * PAGE_SIZE, data.length)}
          </span>{" "}
          out of <span className="font-semibold text-white">{data.length}</span>{" "}
          entries
        </span>
        <div className="flex items-center gap-2">
          <button
            className="flex items-center gap-1 px-4 py-2 text-sm text-white transition-colors duration-200 bg-gray-800 rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
            disabled={page === 1}
          >
            <ChevronLeft className="w-4 h-4" />
            <p>Previous</p>
          </button>

          {(() => {
            const pages = [];
            let startPage = 1;
            if (totalPages > 3) {
              if (page > totalPages - 2) {
                startPage = Math.max(totalPages - 2, 1);
              } else if (page > 1) {
                startPage = page - 1;
              }
            }

            for (let i = startPage; i < startPage + 3 && i <= totalPages; i++) {
              pages.push(i);
            }

            return pages.map((pNum) => (
              <button
                key={pNum}
                className={`px-4 py-2 rounded-full transition-colors duration-200 ${
                  page === pNum
                    ? "bg-green-600 text-white border-green-600 shadow-md"
                    : "bg-gray-800 border border-gray-700 text-gray-300 hover:bg-gray-700"
                }`}
                onClick={() => setPage(pNum)}
              >
                {pNum}
              </button>
            ));
          })()}

          {totalPages > 3 && page <= totalPages - 2 && (
            <>
              <span className="text-gray-500">...</span>
              <button
                key={totalPages}
                className={`px-4 py-2 rounded-full transition-colors duration-200 $(
                  page === totalPages
                    ? "bg-green-600 text-white border-green-600 shadow-md"
                    : "bg-gray-800 border border-gray-700 text-gray-300 hover:bg-gray-700"
                }`}
                onClick={() => setPage(totalPages)}
              >
                {totalPages}
              </button>
            </>
          )}

          <button
            className="flex items-center gap-1 px-4 py-2 text-sm text-white transition-colors duration-200 bg-gray-800 rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
            disabled={page === totalPages}
          >
            <p>Next</p>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AnalysisPage;
