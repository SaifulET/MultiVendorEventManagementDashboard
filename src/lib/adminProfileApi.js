import { API_BASE_URL } from "../config/api";

const getErrorMessage = (result, fallback) =>
  result?.message || result?.error || fallback;

const parseResponse = async (response, fallbackMessage) => {
  const text = await response.text();
  let result = {};

  try {
    result = text ? JSON.parse(text) : {};
  } catch {
    result = { message: text };
  }

  if (!response.ok || result?.success === false) {
    throw new Error(getErrorMessage(result, fallbackMessage));
  }

  return result;
};

const authHeaders = (accessToken, headers = {}) => ({
  ...headers,
  Authorization: `Bearer ${accessToken}`,
});

export const fetchAdminProfile = async (accessToken) => {
  const response = await fetch(`${API_BASE_URL}/api/v1/admin/profile`, {
    headers: authHeaders(accessToken),
  });

  return parseResponse(response, "Failed to load profile.");
};

export const updateAdminProfile = async (accessToken, payload) => {
  const response = await fetch(`${API_BASE_URL}/api/v1/admin/profile`, {
    method: "PATCH",
    headers: authHeaders(accessToken, {
      "Content-Type": "application/json",
    }),
    body: JSON.stringify(payload),
  });

  return parseResponse(response, "Failed to update profile.");
};

export const changeAdminPassword = async (accessToken, payload) => {
  const response = await fetch(`${API_BASE_URL}/api/v1/admin/change-password`, {
    method: "PATCH",
    headers: authHeaders(accessToken, {
      "Content-Type": "application/json",
    }),
    body: JSON.stringify(payload),
  });

  return parseResponse(response, "Failed to change password.");
};

export const uploadAdminProfileImage = async (accessToken, imageFile) => {
  const formData = new FormData();
  formData.append("image", imageFile);

  const response = await fetch(`${API_BASE_URL}/api/v1/uploads/profile-image`, {
    method: "POST",
    headers: authHeaders(accessToken),
    body: formData,
  });

  return parseResponse(response, "Failed to upload profile image.");
};
