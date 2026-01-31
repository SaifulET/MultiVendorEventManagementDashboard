import React, { useState } from "react";
import { Trash2, Edit } from "lucide-react";

const Categories = () => {
  const [categories, setCategories] = useState([
    { id: "01", name: "Yoga" },
    { id: "02", name: "Morning Work" },
    { id: "03", name: "Walking" },
  ]);

  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState("add"); 
  const [currentCategory, setCurrentCategory] = useState({ id: "", name: "" });
  const [editIndex, setEditIndex] = useState(null);
  const [deletingCategoryIndex, setDeletingCategoryIndex] = useState(null); 

  const itemsPerPage = 8;
  const totalItems = 250;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  // ====================Add/Edit Modal====================
  const handleAddCategory = () => {
    setModalType("add");
    setCurrentCategory({ id: "", name: "" });
    setIsModalOpen(true);
  };

  const handleEdit = (index) => {
    setModalType("edit");
    setEditIndex(index);
    setCurrentCategory({ ...categories[index] });
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (modalType === "add") {
      const newCategory = {
        id: (categories.length + 1).toString().padStart(2, "0"),
        name: currentCategory.name,
      };
      setCategories([...categories, newCategory]);
    } else if (modalType === "edit") {
      const updatedCategories = [...categories];
      updatedCategories[editIndex].name = currentCategory.name;
      setCategories(updatedCategories);
    }
    setIsModalOpen(false);
  };

  // ===============================Open delete confirmation===============================
  const handleDelete = (index) => {
    setDeletingCategoryIndex(index);
  };

  // ===============================Confirm delete===============================
  const handleConfirmDelete = () => {
    setCategories(categories.filter((_, i) => i !== deletingCategoryIndex));
    setDeletingCategoryIndex(null);
  };

  const closeDeleteModal = () => setDeletingCategoryIndex(null);

  // ===============================Pagination like Subscriptions===============================
  const renderPaginationButtons = () => {
    const buttons = [];
    const maxVisiblePages = 5;

    buttons.push(
      <button
        key="prev"
        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className="px-3 py-2 text-gray-500 hover:text-[#71ABE0] disabled:opacity-50 disabled:cursor-not-allowed"
      >
        &lt;
      </button>
    );

    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <button
          key={i}
          onClick={() => setCurrentPage(i)}
          className={`px-3 py-2 text-sm font-medium rounded ${
            currentPage === i
              ? "bg-blue-500 text-white"
              : "text-blue-500 hover:bg-gray-100"
          }`}
        >
          {i}
        </button>
      );
    }

    if (endPage < totalPages) {
      buttons.push(
        <span key="ellipsis" className="px-2 py-2 text-gray-500">
          ...
        </span>
      );

      [30, 60, 120].forEach((page) => {
        if (page <= totalPages) {
          buttons.push(
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`px-3 py-2 text-sm font-medium rounded ${
                currentPage === page
                  ? "bg-blue-500 text-white"
                  : "text-blue-500 hover:bg-gray-100"
              }`}
            >
              {page}
            </button>
          );
        }
      });
    }

    buttons.push(
      <button
        key="next"
        onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className="px-3 py-2 text-gray-500 hover:text-[#71ABE0] disabled:opacity-50 disabled:cursor-not-allowed"
      >
        &gt;
      </button>
    );

    return buttons;
  };

  return (
    <div className="w-full min-h-screen p-6 bg-gray-50">
      <div className="mt-16 overflow-hidden bg-white rounded-lg shadow-sm">
        {/*=================================== Header ===================================*/}
        <div className="flex items-center justify-between px-6 py-4 bg-[#71ABE0]">
          <h1 className="text-2xl font-semibold text-white">Categories</h1>
          <button
            onClick={handleAddCategory}
            className="px-4 py-2 text-sm font-medium text-blue-500 transition-colors bg-white rounded-md hover:bg-blue-50"
          >
            + Add Categories
          </button>
        </div>

        {/*=================================== Table=================================== */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="px-6 py-4 text-sm font-medium text-left text-[#71ABE0]">
                  S.ID
                </th>
                <th className="px-6 py-4 text-sm font-medium text-left text-[#71ABE0]">
                  Category Name
                </th>
                <th className="px-6 py-4 text-sm font-medium text-right text-[#71ABE0]">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category, index) => (
                <tr
                  key={index}
                  className="transition-colors border-b border-gray-200 hover:bg-gray-50"
                >
                  <td className="px-6 py-4 text-sm text-gray-700">{category.id}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">{category.name}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleDelete(index)}
                        className="p-1 text-red-500 transition-colors rounded hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 size={18} />
                      </button>
                      <button
                        onClick={() => handleEdit(index)}
                        className="p-1 text-gray-600 transition-colors rounded hover:text-gray-800 hover:bg-gray-100"
                      >
                        <Edit size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/*===================================== Footer===================================== */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
          <div className="text-sm text-[#71ABE0]">
            SHOWING {startItem}-{endItem} OF {totalItems}
          </div>
          <div className="flex items-center gap-1">{renderPaginationButtons()}</div>
        </div>
      </div>

      {/*===================================== Add/Edit Modal===================================== */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-lg">
            <h2 className="mb-4 text-xl font-semibold">
              {modalType === "add" ? "Add Category" : "Edit Category"}
            </h2>
            <input
              type="text"
              className="w-full p-2 mb-4 border border-gray-300 rounded"
              placeholder="Category Name"
              value={currentCategory.name}
              onChange={(e) =>
                setCurrentCategory({ ...currentCategory, name: e.target.value })
              }
            />
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 text-white bg-[#71ABE0] rounded hover:bg-blue-400"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/*============================ Delete Confirmation Modal============================ */}
      {deletingCategoryIndex !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-sm p-6 bg-white rounded-lg shadow-lg">
            <h3 className="mb-4 text-2xl font-bold text-center">
              Are you sure you want to delete this category?
            </h3>
            <div className="flex justify-center gap-3">
              <button
                onClick={closeDeleteModal}
                className="px-4 py-2 text-sm transition-colors bg-white border border-[#71ABE0] text-[#71ABE0] rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 text-sm text-white transition-colors bg-red-600 rounded hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Categories;
