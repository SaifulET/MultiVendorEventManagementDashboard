import { API_BASE_URL } from "../config/api";

export const DEFAULT_PROFILE_IMAGE = "/profile.jpg";

const PUBLIC_IMAGE_PATHS = new Set([DEFAULT_PROFILE_IMAGE, "/placeholder.svg"]);
const IMAGE_FIELD_KEYS = [
  "profileImage",
  "profileImageUrl",
  "profilePicture",
  "imageUrl",
  "image",
  "avatar",
  "photo",
  "photoURL",
  "url",
  "secure_url",
  "secureUrl",
  "src",
  "path",
  "location",
];
const IMAGE_FILE_PATTERN =
  /\.(?:avif|bmp|gif|jpe?g|jfif|png|svg|webp)(?:[?#].*)?$/i;
const IMAGE_ROUTE_PATTERN = /(^|\/)(uploads?|images?|files?|profile-image)(\/|$)/i;

const isUsableImageString = (value) =>
  typeof value === "string" &&
  Boolean(value.trim()) &&
  (value.startsWith("http://") ||
    value.startsWith("https://") ||
    value.startsWith("blob:") ||
    value.startsWith("data:") ||
    value.startsWith("//") ||
    PUBLIC_IMAGE_PATHS.has(value) ||
    IMAGE_FILE_PATTERN.test(value) ||
    IMAGE_ROUTE_PATTERN.test(value));

const toImageUrl = (value) => {
  if (!isUsableImageString(value)) {
    return "";
  }

  const trimmed = value.trim();

  if (trimmed.startsWith("//")) {
    return `https:${trimmed}`;
  }

  if (
    trimmed.startsWith("http://") ||
    trimmed.startsWith("https://") ||
    trimmed.startsWith("blob:") ||
    trimmed.startsWith("data:") ||
    PUBLIC_IMAGE_PATHS.has(trimmed)
  ) {
    return trimmed;
  }

  if (trimmed.startsWith("/")) {
    return IMAGE_ROUTE_PATTERN.test(trimmed)
      ? `${API_BASE_URL}${trimmed}`
      : trimmed;
  }

  return IMAGE_ROUTE_PATTERN.test(trimmed) || IMAGE_FILE_PATTERN.test(trimmed)
    ? `${API_BASE_URL}/${trimmed.replace(/^\/+/, "")}`
    : "";
};

const resolveImageFromValue = (value, visited = new WeakSet()) => {
  if (!value) {
    return "";
  }

  if (typeof value === "string") {
    return toImageUrl(value);
  }

  if (Array.isArray(value)) {
    for (const item of value) {
      const resolved = resolveImageFromValue(item, visited);
      if (resolved) {
        return resolved;
      }
    }

    return "";
  }

  if (typeof value !== "object") {
    return "";
  }

  if (visited.has(value)) {
    return "";
  }

  visited.add(value);

  for (const key of IMAGE_FIELD_KEYS) {
    const resolved = resolveImageFromValue(value[key], visited);
    if (resolved) {
      return resolved;
    }
  }

  for (const nestedValue of Object.values(value)) {
    if (nestedValue && typeof nestedValue === "object") {
      const resolved = resolveImageFromValue(nestedValue, visited);
      if (resolved) {
        return resolved;
      }
    }
  }

  return "";
};

export const getProfileImageSrc = (
  profile,
  fallback = DEFAULT_PROFILE_IMAGE
) => resolveImageFromValue(profile) || fallback;

export const normalizeProfileRecord = (profile) => {
  if (!profile || typeof profile !== "object") {
    return profile;
  }

  const resolvedImage = getProfileImageSrc(profile, "");

  if (!resolvedImage) {
    return profile;
  }

  return {
    ...profile,
    profileImage: resolvedImage,
    profileImageUrl: resolvedImage,
    avatar: resolvedImage,
  };
};

export const mergeProfileRecords = (currentProfile, incomingProfile) => {
  const baseProfile =
    currentProfile && typeof currentProfile === "object" ? currentProfile : {};
  const nextProfile =
    incomingProfile && typeof incomingProfile === "object" ? incomingProfile : {};
  const incomingImage = getProfileImageSrc(nextProfile, "");

  return normalizeProfileRecord({
    ...baseProfile,
    ...nextProfile,
    ...(incomingImage
      ? {
          profileImage: incomingImage,
          profileImageUrl: incomingImage,
          avatar: incomingImage,
        }
      : {}),
  });
};
