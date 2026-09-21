import type { IconType } from "react-icons";
import {
  FaBehance,
  FaDiscord,
  FaDribbble,
  FaEnvelope,
  FaFacebookF,
  FaGithub,
  FaGlobe,
  FaInstagram,
  FaLink,
  FaLinkedinIn,
  FaMedium,
  FaPinterestP,
  FaRedditAlien,
  FaSnapchat,
  FaSoundcloud,
  FaSpotify,
  FaTelegram,
  FaThreads,
  FaTiktok,
  FaTwitch,
  FaVimeoV,
  FaWhatsapp,
  FaXTwitter,
  FaYoutube,
} from "react-icons/fa6";

export type SocialPlatform = {
  /** Stored in Sanity. Never change an existing value — content references it. */
  value: string;
  /** Human label shown in the Studio dropdown and used as the link's aria-label. */
  title: string;
  /** The official brand mark from react-icons/fa6. */
  icon: IconType;
  /** Official brand colour, used for the hover state on the site. */
  color: string;
  /** Placeholder shown in the Studio to hint at the expected URL shape. */
  placeholder: string;
};

/**
 * Every platform an editor can pick in the Studio.
 * To offer a new one, add a row here — the dropdown, the icons on the site and
 * the Studio preview all read from this single list.
 */
export const SOCIAL_PLATFORMS: SocialPlatform[] = [
  { value: "facebook",  title: "Facebook",   icon: FaFacebookF,   color: "#1877F2", placeholder: "https://facebook.com/yourpage" },
  { value: "instagram", title: "Instagram",  icon: FaInstagram,   color: "#E4405F", placeholder: "https://instagram.com/yourhandle" },
  { value: "x",         title: "X (Twitter)",icon: FaXTwitter,    color: "#FFFFFF", placeholder: "https://x.com/yourhandle" },
  { value: "linkedin",  title: "LinkedIn",   icon: FaLinkedinIn,  color: "#0A66C2", placeholder: "https://linkedin.com/company/yourcompany" },
  { value: "youtube",   title: "YouTube",    icon: FaYoutube,     color: "#FF0000", placeholder: "https://youtube.com/@yourchannel" },
  { value: "tiktok",    title: "TikTok",     icon: FaTiktok,      color: "#FFFFFF", placeholder: "https://tiktok.com/@yourhandle" },
  { value: "whatsapp",  title: "WhatsApp",   icon: FaWhatsapp,    color: "#25D366", placeholder: "https://wa.me/256790879117" },
  { value: "telegram",  title: "Telegram",   icon: FaTelegram,    color: "#26A5E4", placeholder: "https://t.me/yourhandle" },
  { value: "threads",   title: "Threads",    icon: FaThreads,     color: "#FFFFFF", placeholder: "https://threads.net/@yourhandle" },
  { value: "snapchat",  title: "Snapchat",   icon: FaSnapchat,    color: "#FFFC00", placeholder: "https://snapchat.com/add/yourhandle" },
  { value: "pinterest", title: "Pinterest",  icon: FaPinterestP,  color: "#BD081C", placeholder: "https://pinterest.com/yourhandle" },
  { value: "reddit",    title: "Reddit",     icon: FaRedditAlien, color: "#FF4500", placeholder: "https://reddit.com/r/yoursub" },
  { value: "discord",   title: "Discord",    icon: FaDiscord,     color: "#5865F2", placeholder: "https://discord.gg/yourinvite" },
  { value: "twitch",    title: "Twitch",     icon: FaTwitch,      color: "#9146FF", placeholder: "https://twitch.tv/yourchannel" },
  { value: "github",    title: "GitHub",     icon: FaGithub,      color: "#FFFFFF", placeholder: "https://github.com/yourorg" },
  { value: "medium",    title: "Medium",     icon: FaMedium,      color: "#FFFFFF", placeholder: "https://medium.com/@yourhandle" },
  { value: "behance",   title: "Behance",    icon: FaBehance,     color: "#1769FF", placeholder: "https://behance.net/yourhandle" },
  { value: "dribbble",  title: "Dribbble",   icon: FaDribbble,    color: "#EA4C89", placeholder: "https://dribbble.com/yourhandle" },
  { value: "spotify",   title: "Spotify",    icon: FaSpotify,     color: "#1DB954", placeholder: "https://open.spotify.com/show/..." },
  { value: "soundcloud",title: "SoundCloud", icon: FaSoundcloud,  color: "#FF5500", placeholder: "https://soundcloud.com/yourhandle" },
  { value: "vimeo",     title: "Vimeo",      icon: FaVimeoV,      color: "#1AB7EA", placeholder: "https://vimeo.com/yourhandle" },
  { value: "email",     title: "Email",      icon: FaEnvelope,    color: "#D7FF65", placeholder: "mailto:hello@makeithappen.ug" },
  { value: "website",   title: "Website",    icon: FaGlobe,       color: "#D7FF65", placeholder: "https://example.com" },
  { value: "other",     title: "Other (custom label)", icon: FaLink, color: "#D7FF65", placeholder: "https://example.com" },
];

const BY_VALUE = new Map(SOCIAL_PLATFORMS.map((p) => [p.value, p]));

/** Options for the Sanity `list` dropdown. */
export const SOCIAL_PLATFORM_OPTIONS = SOCIAL_PLATFORMS.map(({ value, title }) => ({ value, title }));

/**
 * Resolves a stored platform value to its brand icon and colour.
 *
 * Falls back to a loose name match so the links saved under the old free-text
 * `platform` field (e.g. "LinkedIn", "Twitter") keep their real icon.
 */
export function resolvePlatform(platform: string | null | undefined): SocialPlatform {
  const fallback = BY_VALUE.get("other") as SocialPlatform;
  if (!platform) return fallback;

  const key = platform.trim().toLowerCase();
  const exact = BY_VALUE.get(key);
  if (exact) return exact;

  if (key.includes("twitter")) return BY_VALUE.get("x") as SocialPlatform;
  const loose = SOCIAL_PLATFORMS.find(
    (p) => p.value !== "other" && (key.includes(p.value) || key.includes(p.title.toLowerCase())),
  );
  return loose ?? fallback;
}
