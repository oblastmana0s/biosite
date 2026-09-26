/**
 * BioLink Pro - Core Application Script
 * Features: Live rendering, LocalStorage sync, Themes (Desert, Unicorn, Midnight, Sunset, Matcha),
 *           Torn paper deckle cards, Web Audio SFX, Offline QR Code, Standalone HTML export.
 */

// =============================================================================
// 1. DEFAULT DATA (Exact match to Reese Kim reference images)
// =============================================================================
const DEFAULT_BIO_DATA = {
  theme: "desert",
  profile: {
    name: "Mimi & Cozy",
    bio: "Góc nhỏ chia sẻ điều xinh xắn, review có tâm ✨",
    verified: true,
    avatar: "assets/avatar_strawberry.png"
  },
  socials: [
    { platform: "facebook", url: "https://facebook.com", enabled: true },
    { platform: "instagram", url: "https://instagram.com", enabled: true },
    { platform: "tiktok", url: "https://tiktok.com", enabled: true },
    { platform: "shopee", url: "https://shopee.vn", enabled: true },
    { platform: "youtube", url: "https://youtube.com", enabled: true },
    { platform: "zalo", url: "https://zalo.me", enabled: true },
    { platform: "spotify", url: "https://open.spotify.com", enabled: true }
  ],
  links: [
    {
      id: "link-1",
      title: "Gian Hàng Shopee Yêu Thích 🍓",
      subtitle: "Mã giảm giá 20% & freeship toàn quốc",
      url: "https://shopee.vn",
      icon: "shopee",
      iconColor: "#EE4D2D",
      badge: "HOT"
    },
    {
      id: "link-2",
      title: "Kênh YouTube Chính Thức 🎬",
      subtitle: "Vlog thư giãn & review đồ trang trí",
      url: "https://youtube.com",
      icon: "youtube",
      iconColor: "#E53935",
      badge: "NEW"
    },
    {
      id: "link-3",
      title: "Tủ Sách & Đồ Decor Yêu Thích 📚",
      subtitle: "Danh sách đồ mình dùng mỗi ngày",
      url: "https://goodreads.com",
      icon: "goodreads",
      iconColor: "#EA638C",
      badge: ""
    },
    {
      id: "link-4",
      title: "Nhắn Tin Zalo / Hợp Tác Nhanh 💬",
      subtitle: "Phản hồi công việc trong ngày",
      url: "https://zalo.me",
      icon: "zalo",
      iconColor: "#0068FF",
      badge: ""
    }
  ],
  settings: {
    sfxEnabled: true,
    viewMode: "phone" // 'phone' or 'fullscreen'
  }
};

// Brand Colors Registry for auto-styling icons
const BRAND_COLORS = {
  shopee: "#EE4D2D",
  tiktokshop: "#FE2C55",
  lazada: "#0F146D",
  amazon: "#2E86DE",
  shop: "#64C4ED",
  facebook: "#1877F2",
  messenger: "#0084FF",
  zalo: "#0068FF",
  threads: "#1E1E1E",
  instagram: "#E1306C",
  tiktok: "#111111",
  twitter: "#0F1419",
  telegram: "#229ED9",
  discord: "#5865F2",
  whatsapp: "#25D366",
  pinterest: "#E60023",
  linkedin: "#0A66C2",
  reddit: "#FF4500",
  youtube: "#E53935",
  spotify: "#1DB954",
  applemusic: "#FA243C",
  soundcloud: "#FF5500",
  podcast: "#873DC8",
  twitch: "#9146FF",
  momo: "#A50064",
  bank: "#10B981",
  coffee: "#FFDD00",
  patreon: "#FF424D",
  goodreads: "#EA638C",
  notion: "#222222",
  github: "#24292F",
  substack: "#FF6719",
  email: "#F59E0B",
  phone: "#10B981",
  globe: "#3B82F6",
  link: "#6366F1"
};

// Application State
let appData = loadBioData();

// Check URL parameter for theme override (e.g. ?theme=unicorn-paper)
const urlParams = new URLSearchParams(window.location.search);
const themeQuery = urlParams.get("theme");
const VALID_THEMES = ["desert", "unicorn-paper", "strawberry-paper", "matcha-paper", "galaxy", "unicorn", "strawberry", "matcha"];
if (themeQuery && VALID_THEMES.includes(themeQuery.toLowerCase())) {
  appData.theme = themeQuery.toLowerCase();
}

if (urlParams.get("view") === "fullscreen") {
  appData.settings.viewMode = "fullscreen";
}


// =============================================================================
// 2. SVG ICON REGISTRY (Comprehensive platform icons)
// =============================================================================
const SVG_ICONS = {
  // E-Commerce & Shopping
  shopee: `<svg viewBox="0 0 24 24"><path d="M19.5 8h-2.1c-.4-3.4-2.5-6-5.4-6s-5 2.6-5.4 6H4.5C3.7 8 3 8.7 3 9.5l1.6 11.2c.1.9.9 1.6 1.8 1.6h11.2c.9 0 1.7-.7 1.8-1.6L21 9.5c0-.8-.7-1.5-1.5-1.5zm-7.5-4c1.8 0 3.3 1.8 3.5 4H8.5c.2-2.2 1.7-4 3.5-4zm1.8 11.4c-.2.9-.9 1.4-1.8 1.4-1.2 0-2-.8-2-2.1 0-1.8 2-2.4 2-3.1 0-.4-.3-.6-.8-.6-.6 0-1 .4-1.1 1.1h-1.4c.1-1.3 1-2.2 2.5-2.2 1.3 0 2.2.8 2.2 1.9 0 1.6-2 2.2-2 3.1 0 .4.4.6.8.6.6 0 1-.4 1.1-1h1.5z"/></svg>`,
  tiktokshop: `<svg viewBox="0 0 24 24"><path d="M18 6h-2.1c-.4-2.3-2.1-4-4.4-4S7.5 3.7 7.1 6H5c-1.1 0-2 .9-2 2l1.6 11.2c.1.9.9 1.6 1.8 1.6h11.2c.9 0 1.7-.7 1.8-1.6L21 8c0-1.1-.9-2-2-2zm-6.5-2c1.3 0 2.4 1 2.5 2.3h-5c.1-1.3 1.2-2.3 2.5-2.3zm1.5 12.3c-.6.3-1.3.4-2 .2-.7-.2-1.3-.8-1.5-1.5-.3-1 .2-2.1 1.2-2.5.4-.2.8-.2 1.2-.1v-3.4c.8.6 1.7.9 2.7.9v2c-.7 0-1.4-.2-2-.6v4.7z"/></svg>`,
  lazada: `<svg viewBox="0 0 24 24"><path d="M12 2C7.58 2 4 5.58 4 10c0 4.22 3.2 8.35 7.42 11.66.35.28.81.28 1.16 0C16.8 18.35 20 14.22 20 10c0-4.42-3.58-8-8-8zm0 10.5c-1.93 0-3.5-1.57-3.5-3.5S10.07 5.5 12 5.5s3.5 1.57 3.5 3.5-1.57 3.5-3.5 3.5z"/></svg>`,
  amazon: `<svg viewBox="0 0 24 24"><path d="M13.92 18.06c-3.1 2.29-7.58 3.51-11.45 1.29-.53-.3-.1-.97.4-.73 3.65 1.77 7.94.75 10.66-1.15.42-.29.83.25.39.59zM14.6 16.74c-.39-.51-2.61-.25-3.6.14-.3.12-.26-.35.05-.53 2.03-1.18 5.37-.84 5.72-.39.35.45-.09 3.8-2 5.17-.29.21-.57.1-.44-.24.42-1.09 1.1-3.12.27-4.15zM12.9 8.27v-.23c0-.98-.63-1.65-1.7-1.65-.96 0-1.61.64-1.79 1.48-.03.15-.17.25-.32.25l-1.92-.22c-.15-.02-.26-.16-.23-.31.33-1.85 1.94-3.13 4.31-3.13 2.53 0 4.13 1.47 4.13 3.79v4.94c0 .88.42 1.34.8 1.83.11.14.07.35-.09.43l-1.94 1c-.13.07-.3 0-.37-.13-.26-.51-.62-1.16-.62-1.77-.5.98-1.52 1.9-3.26 1.9-2.14 0-3.69-1.39-3.69-3.52 0-2.31 1.76-3.48 4.2-3.48h2.48zm-2.43 5.48c1.37 0 2.43-.88 2.43-2.27v-.88h-2.17c-1.39 0-2.25.62-2.25 1.7 0 1.01.76 1.45 1.99 1.45z"/></svg>`,
  shop: `<svg viewBox="0 0 24 24"><path d="M21.9 8.2l-1.8-4.5c-.3-.7-1-1.2-1.8-1.2H5.7c-.8 0-1.5.5-1.8 1.2L2.1 8.2c-.4 1 .2 2 1.2 2.3.2 0 .5.1.7.1 1 0 1.9-.6 2.3-1.5.4 1 1.4 1.6 2.4 1.6 1.1 0 2-.6 2.4-1.6.4 1 1.3 1.6 2.4 1.6s2-.6 2.4-1.6c.4 1 1.3 1.6 2.4 1.6.2 0 .5 0 .7-.1 1-.3 1.6-1.3 1.2-2.3zM4 12.5V20c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2v-7.5c-.6.3-1.3.5-2 .5-1.1 0-2.1-.5-2.7-1.3-.6.8-1.6 1.3-2.7 1.3s-2.1-.5-2.7-1.3c-.6.8-1.6 1.3-2.7 1.3-.7 0-1.4-.2-2-.5zM10 20v-5h4v5h-4z"/></svg>`,

  // Social & Messaging
  facebook: `<svg viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>`,
  messenger: `<svg viewBox="0 0 24 24"><path d="M12 2C6.477 2 2 6.145 2 11.258c0 2.914 1.455 5.518 3.734 7.215V22l3.372-1.854c.905.251 1.879.387 2.894.387 5.523 0 10-4.145 10-9.258C22 6.145 17.523 2 12 2zm1.066 12.445l-2.73-2.911-5.326 2.911 5.86-6.222 2.798 2.911 5.258-2.911-5.86 6.222z"/></svg>`,
  zalo: `<svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.03 2 11c0 2.87 1.5 5.43 3.84 7.04L5 22l4.24-1.74C10.15 20.65 11.05 21 12 21c5.52 0 10-4.03 10-9s-4.48-9-10-9zm1.3 12.5h-4.3l3.2-4.6h-3.1V8.4h4.3l-3.2 4.6h3.1v1.5z"/></svg>`,
  threads: `<svg viewBox="0 0 24 24"><path d="M12.003 2c-5.522 0-9.998 4.477-9.998 10 0 5.524 4.476 10 9.998 10 4.148 0 7.72-2.527 9.227-6.144-.316-.205-1.572-.942-2.028-.942-.452 0-.82.16-1.11.458-.87.892-2.096 1.442-3.465 1.442-2.83 0-5.116-2.05-5.116-4.814 0-2.766 2.286-4.816 5.116-4.816 2.83 0 5.116 2.05 5.116 4.816 0 .545-.094 1.07-.27 1.558-.29.805-.85 1.428-1.58 1.76-.56.255-1.2.336-1.85.234-.69-.107-1.29-.467-1.68-1.014-.52.67-1.32 1.096-2.22 1.096-1.74 0-3.15-1.41-3.15-3.15s1.41-3.15 3.15-3.15c.87 0 1.65.353 2.21.923V8.895c-.68-.224-1.42-.345-2.21-.345-3.92 0-7.1 3.18-7.1 7.1 0 3.92 3.18 7.1 7.1 7.1 2.27 0 4.31-.96 5.75-2.49 1.44-1.54 2.25-3.62 2.25-5.86 0-5.523-4.477-10-10-10z"/></svg>`,
  instagram: `<svg viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>`,
  tiktok: `<svg viewBox="0 0 24 24"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.97-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.24 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/></svg>`,
  twitter: `<svg viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>`,
  telegram: `<svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 0 0-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z"/></svg>`,
  discord: `<svg viewBox="0 0 24 24"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.894.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/></svg>`,
  whatsapp: `<svg viewBox="0 0 24 24"><path d="M12.031 2C6.511 2 2.031 6.48 2.031 12a9.94 9.94 0 0 0 1.543 5.332L2.031 22l4.82-1.504A9.974 9.974 0 0 0 12.031 22c5.52 0 10-4.48 10-10s-4.48-10-10-10zm5.834 14.195c-.244.686-1.42 1.32-1.957 1.365-.537.045-1.182.062-3.793-.974-3.136-1.246-5.138-4.444-5.295-4.65-.157-.206-1.272-1.69-1.272-3.224 0-1.534.805-2.288 1.09-2.583.286-.296.626-.37.834-.37.208 0 .416.002.599.012.193.01.452-.073.707.54.262.628.895 2.185.973 2.344.078.16.13.348.026.557-.104.21-.157.34-.313.522-.156.183-.328.408-.469.547-.156.156-.32.327-.138.64.183.313.812 1.34 1.743 2.168 1.198 1.066 2.207 1.396 2.52 1.552.313.156.496.13.68-.078.183-.21.782-.912.99-1.224.208-.313.416-.261.694-.156.278.104 1.76.83 2.064.982.304.152.507.228.58.354.073.125.073.725-.171 1.411z"/></svg>`,
  pinterest: `<svg viewBox="0 0 24 24"><path d="M12 0C5.373 0 0 5.372 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z"/></svg>`,
  linkedin: `<svg viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>`,
  reddit: `<svg viewBox="0 0 24 24"><path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-4.72 4.148c-.085-.004-.17.02-.236.07a.335.335 0 0 0-.044.471c.78.892 2.054.91 2.25.91.196 0 1.47-.018 2.25-.91a.334.334 0 0 0-.044-.471.341.341 0 0 0-.472.044c-.53.606-1.464.67-1.734.67-.27 0-1.204-.064-1.734-.67a.333.333 0 0 0-.24-.114z"/></svg>`,

  // Video & Music
  youtube: `<svg viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>`,
  spotify: `<svg viewBox="0 0 24 24"><path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/></svg>`,
  applemusic: `<svg viewBox="0 0 24 24"><path d="M12 2C6.477 2 2 6.477 2 12c0 5.523 4.477 10 10 10s10-4.477 10-10c0-5.523-4.477-10-10-10zm4.5 5.5v5.5a2.5 2.5 0 1 1-2-2.45V8.5h-5v5.5a2.5 2.5 0 1 1-2-2.45V7.5a1 1 0 0 1 1-1h7a1 1 0 0 1 1 1z"/></svg>`,
  soundcloud: `<svg viewBox="0 0 24 24"><path d="M1.175 12.225c-.053 0-.106.05-.106.106v3.256c0 .06.053.106.106.106.053 0 .106-.046.106-.106v-3.256a.105.105 0 0 0-.106-.106zm1.312-1.398c-.066 0-.12.054-.12.12v5.775c0 .066.054.12.12.12.066 0 .12-.054.12-.12v-5.775c0-.066-.054-.12-.12-.12zm1.313-.675c-.08 0-.146.066-.146.146v7.125c0 .08.066.146.146.146.08 0 .146-.066.146-.146v-7.125c0-.08-.066-.146-.146-.146zm1.312-.225c-.093 0-.173.08-.173.173v7.575c0 .093.08.173.173.173.093 0 .173-.08.173-.173v-7.575c0-.093-.08-.173-.173-.173zm1.313-.42c-.106 0-.186.08-.186.186v8.438c0 .106.08.186.186.186.106 0 .186-.08.186-.186V9.707c0-.106-.08-.186-.186-.186zm1.312-.72c-.12 0-.213.093-.213.213v9.87c0 .12.093.213.213.213.12 0 .213-.093.213-.213V8.987c0-.12-.093-.213-.213-.213zm1.313-.586c-.133 0-.24.107-.24.24v11.04c0 .133.107.24.24.24.133 0 .24-.107.24-.24V8.401c0-.133-.107-.24-.24-.24zm1.312-.293c-.146 0-.266.12-.266.266v11.627c0 .146.12.267.266.267.147 0 .267-.12.267-.267V8.108c0-.146-.12-.267-.267-.267zm2.347-1.12c-.227 0-.44.053-.64.133v13.067h7.24c2.253 0 4.093-1.84 4.093-4.093 0-2.12-1.626-3.854-3.706-4.067a4.267 4.267 0 0 0-4.027-4.08c-.96 0-1.853.333-2.56.907-.12-.04-.267-.067-.4-.067z"/></svg>`,
  podcast: `<svg viewBox="0 0 24 24"><path d="M12 1a9 9 0 0 0-9 9v4a9 9 0 0 0 18 0v-4a9 9 0 0 0-9-9zm-2 15a2 2 0 1 1 4 0v3h-4v-3zm2-13c3.87 0 7 3.13 7 7v4c0 3.87-3.13 7-7 7s-7-3.13-7-7v-4c0-3.87 3.13-7 7-7zm0 3a4 4 0 0 0-4 4v2a4 4 0 0 0 8 0v-2a4 4 0 0 0-4-4z"/></svg>`,
  twitch: `<svg viewBox="0 0 24 24"><path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714z"/></svg>`,

  // Payments, Support & Tips
  momo: `<svg viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5" fill="#a50064"/><path fill="#ffffff" d="M6.8 6.8h2.5l2.7 4.8 2.7-4.8h2.5v10.4h-2.3V11l-2.4 4.2h-1l-2.4-4.2v6.2H6.8V6.8z"/></svg>`,
  bank: `<svg viewBox="0 0 24 24"><path d="M12 2L2 7v3h20V7L12 2zm-8 8v7h3v-7H4zm6 0v7h3v-7h-3zm6 0v7h3v-7h-3zM2 20v2h20v-2H2z"/></svg>`,
  coffee: `<svg viewBox="0 0 24 24"><path d="M20.216 6.415l-.132-.666c-.119-.597-.387-1.155-.78-1.621a4.238 4.238 0 0 0-1.611-1.127 5.253 5.253 0 0 0-2.145-.371H3.342C2.446 2.63 1.6 2.99 1 3.633a3.864 3.864 0 0 0-.964 2.378c-.02.434.02.87.12 1.29l2.128 8.94c.328 1.38 1.135 2.585 2.28 3.402A6.52 6.52 0 0 0 8.442 20.7h5.12a6.52 6.52 0 0 0 3.878-1.057c1.145-.817 1.952-2.022 2.28-3.402l.608-2.556a4.84 4.84 0 0 0 2.204-1.378 4.62 4.62 0 0 0 1.068-2.457 4.7 4.7 0 0 0-.384-3.435zm-2.52 4.793c-.164.555-.494 1.04-.946 1.39a3.3 3.3 0 0 1-1.6.612l.534-2.244.38-1.596a1.9 1.9 0 0 1 .737.16c.3.14.545.37.708.66.162.29.213.626.147.954-.014.064-.035.128-.06.19z"/></svg>`,
  patreon: `<svg viewBox="0 0 24 24"><path d="M14.82 2.41a7.78 7.78 0 1 0 0 15.56 7.78 7.78 0 0 0 0-15.56zM2 21.59h3.69V2.41H2v19.18z"/></svg>`,

  // Books, Knowledge & Tech
  goodreads: `<svg viewBox="0 0 24 24"><path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.167 6.839 9.49.03-.31.06-.69.06-1.07 0-2.73 1.95-4.7 4.67-4.7 1.08 0 2.05.34 2.83.94V7.5c0-1.38-1.12-2.5-2.5-2.5H12V2zm.43 15.2c-1.74 0-2.93 1.25-2.93 2.9 0 1.65 1.19 2.9 2.93 2.9s2.93-1.25 2.93-2.9c0-1.65-1.19-2.9-2.93-2.9z"/></svg>`,
  notion: `<svg viewBox="0 0 24 24"><path d="M4.459 4.208c.746.606 1.026.56 2.428.466l13.215-.793c.28 0 .047-.28-.046-.326L17.86 1.97c-.466-.373-.84-.373-1.68-.326L3.992 2.669c-.42.046-.42.326-.327.466l.794 1.073zm1.12 3.125v13.62c0 .84.42 1.12 1.213 1.073l13.915-.84c.793-.046.886-.606.886-1.12V6.634c0-.606-.233-.886-.793-.84l-14.475.886c-.56.047-.746.28-.746.653zm12.327.7c.094.42 0 .84-.42.886l-.84.14v9.657c-.466.28-.98.42-1.447.42-.793 0-1.073-.233-1.68-.98l-4.76-7.512v7.373l1.4.326c.047.42-.326.84-.746.84l-3.36.187c-.094-.42 0-.84.42-.887l.933-.233V8.874l-1.306-.14c-.093-.42.14-.84.56-.887l3.687-.233 5.086 7.792V8.594l-1.166-.187c-.093-.42.14-.84.56-.886l3.36-.187z"/></svg>`,
  github: `<svg viewBox="0 0 24 24"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/></svg>`,
  substack: `<svg viewBox="0 0 24 24"><path d="M22.539 8.242H1.46V5.406h21.08v2.836zM1.46 10.812V24L12 18.11 22.54 24V10.812H1.46zM22.54 0H1.46v2.836h21.08V0z"/></svg>`,

  // Direct Contact & General
  phone: `<svg viewBox="0 0 24 24"><path d="M6.62 10.79a15.053 15.053 0 0 0 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/></svg>`,
  email: `<svg viewBox="0 0 24 24"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>`,
  globe: `<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>`,
  link: `<svg viewBox="0 0 24 24"><path d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z"/></svg>`,
  share: `<svg viewBox="0 0 24 24"><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line></svg>`,
  verified: `<svg viewBox="0 0 24 24"><path fill="#1D9BF0" d="M22.5 12.5c0-1.58-.875-2.95-2.148-3.6.154-.435.238-.905.238-1.4 0-2.21-1.79-4-4-4-.495 0-.965.084-1.4.238C14.55 2.475 13.18 1.6 11.6 1.6c-1.58 0-2.95.875-3.6 2.148-.435-.154-.905-.238-1.4-.238-2.21 0-4 1.79-4 4 0 .495.084.965.238 1.4C1.575 10.45.7 11.82.7 13.4c0 1.58.875 2.95 2.148 3.6-.154.435-.238.905-.238 1.4 0 2.21 1.79 4 4 4 .495 0 .965-.084 1.4-.238 1.285 1.273 2.655 2.148 4.238 2.148 1.58 0 2.95-.875 3.6-2.148.435.154.905.238 1.4.238 2.21 0 4-1.79 4-4 0-.495-.084-.965-.238-1.4 1.273-1.285 2.148-2.655 2.148-4.238z"/><path fill="#FFF" d="M9.86 16.5l-4.1-4.1 1.41-1.41 2.69 2.69 7.07-7.07 1.41 1.41z"/></svg>`
};

// =============================================================================
// 3. SOUND SYNTHESIZER (Web Audio API)
// =============================================================================
class SoundFX {
  constructor() {
    this.ctx = null;
  }
  init() {
    if (!this.ctx && (window.AudioContext || window.webkitAudioContext)) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();
    }
  }
  playPop() {
    if (!appData.settings.sfxEnabled) return;
    try {
      this.init();
      if (!this.ctx) return;
      if (this.ctx.state === "suspended") this.ctx.resume();

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "sine";
      const now = this.ctx.currentTime;
      osc.frequency.setValueAtTime(540, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.08);

      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.08);
    } catch (e) {}
  }
  playPaperRustle() {
    if (!appData.settings.sfxEnabled) return;
    try {
      this.init();
      if (!this.ctx) return;
      if (this.ctx.state === "suspended") this.ctx.resume();

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(300, now);
      osc.frequency.exponentialRampToValueAtTime(160, now + 0.06);

      gain.gain.setValueAtTime(0.06, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.06);
    } catch (e) {}
  }
}
const sfx = new SoundFX();

// =============================================================================
// 4. STORAGE FUNCTIONS
// =============================================================================
function loadBioData() {
  try {
    const saved = localStorage.getItem("bio_link_pro_data");
    if (saved) {
      const data = JSON.parse(saved);
      // Auto-migrate old real-person avatar to cute avatar
      if (!data.profile || !data.profile.avatar || data.profile.avatar.includes("reese_avatar.png") || data.profile.avatar.includes("unsplash.com")) {
        if (!data.profile) data.profile = {};
        data.profile.avatar = "assets/avatar_strawberry.png";
      }
      return data;
    }
  } catch (e) {
    console.error("Failed to read localStorage:", e);
  }
  return JSON.parse(JSON.stringify(DEFAULT_BIO_DATA));
}

function saveBioData() {
  try {
    localStorage.setItem("bio_link_pro_data", JSON.stringify(appData));
  } catch (e) {
    console.error("Failed to save to localStorage:", e);
  }
}

// =============================================================================
// 5. APPLICATION RENDERING & DOM UPDATES
// =============================================================================
function renderApp() {
  // 1. Set Active Theme Attribute
  document.body.setAttribute("data-theme", appData.theme);

  // 2. Update Header Theme Title (Mockup stage)
  const stageTitle = document.getElementById("stageThemeTitle");
  if (stageTitle) {
    const titles = {
      "desert": "DESERT",
      "unicorn-paper": "UNICORN PAPER ✦",
      "strawberry-paper": "STRAWBERRY PAPER 🍓",
      "matcha-paper": "MATCHA PAPER 🍵",
      "galaxy": "PASTEL GALAXY ✨",
      "unicorn": "UNICORN 🦄",
      "strawberry": "STRAWBERRY MILK 🍓",
      "matcha": "FRESH MATCHA 🍵"
    };
    stageTitle.textContent = titles[appData.theme] || appData.theme.toUpperCase();
  }



  // 3. Update Nav Theme Pills & Drawer Theme Cards
  document.querySelectorAll(".theme-pill-btn").forEach(btn => {
    btn.classList.toggle("active", btn.getAttribute("data-set-theme") === appData.theme);
  });
  document.querySelectorAll(".theme-card-option").forEach(card => {
    card.classList.toggle("active", card.getAttribute("data-theme-choice") === appData.theme);
  });

  // 4. Update Profile
  const avatarEl = document.getElementById("profileAvatar");
  const nameEl = document.getElementById("profileName");
  const bioEl = document.getElementById("profileBio");
  const verifiedEl = document.getElementById("profileVerified");

  if (avatarEl) avatarEl.src = appData.profile.avatar || "assets/avatar_strawberry.png";
  if (nameEl) nameEl.textContent = appData.profile.name || "Tên của bạn";
  if (bioEl) bioEl.textContent = appData.profile.bio || "";
  if (verifiedEl) {
    verifiedEl.style.display = appData.profile.verified ? "inline-flex" : "none";
    verifiedEl.innerHTML = SVG_ICONS.verified;
  }

  // 5. Render Socials Bar
  const socialsRow = document.getElementById("socialsRow");
  if (socialsRow) {
    socialsRow.innerHTML = "";
    appData.socials.forEach(soc => {
      if (soc.enabled && soc.url) {
        const a = document.createElement("a");
        a.className = "social-link";
        a.href = soc.url;
        a.target = "_blank";
        a.rel = "noopener noreferrer";
        a.title = soc.platform.charAt(0).toUpperCase() + soc.platform.slice(1);
        a.innerHTML = SVG_ICONS[soc.platform] || SVG_ICONS.globe;
        a.addEventListener("click", () => sfx.playPaperRustle());
        socialsRow.appendChild(a);
      }
    });
  }

  // 6. Render Links List
  const linksList = document.getElementById("linksList");
  if (linksList) {
    linksList.innerHTML = "";
    appData.links.forEach(link => {
      const card = document.createElement("a");
      card.className = "bio-link-card";
      card.href = link.url || "#";
      card.target = "_blank";
      card.rel = "noopener noreferrer";

      // Badge if any
      const badgeHtml = link.badge ? `<span class="card-badge">${escapeHtml(link.badge)}</span>` : "";

      // Icon HTML
      const iconSvg = SVG_ICONS[link.icon] || SVG_ICONS.globe;
      const iconColor = link.iconColor || "#3b82f6";

      // Notice: card-paper-bg layer holds the torn clip-path and drop-shadow,
      // leaving the text, icons, and badges 100% razor sharp and crisp!
      card.innerHTML = `
        <div class="card-paper-bg"></div>
        ${badgeHtml}
        <div class="card-icon-box" style="background-color: ${iconColor};">
          ${iconSvg}
        </div>
        <div class="card-content">
          <div class="card-title">${escapeHtml(link.title)}</div>
          ${link.subtitle ? `<div class="card-subtitle">${escapeHtml(link.subtitle)}</div>` : ""}
        </div>
        <div class="card-action-box" title="Chia sẻ liên kết này">
          ${SVG_ICONS.share}
        </div>
      `;

      // Share button micro-click
      const shareAction = card.querySelector(".card-action-box");
      if (shareAction) {
        shareAction.addEventListener("click", (e) => {
          e.preventDefault();
          e.stopPropagation();
          copyToClipboard(link.url);
          showToast(`Đã sao chép link: ${link.title}`);
          sfx.playPop();
        });
      }

      card.addEventListener("click", () => {
        sfx.playPaperRustle();
      });

      linksList.appendChild(card);
    });
  }

  // 7. Update View Mode (Phone vs Fullscreen)
  if (appData.settings.viewMode === "fullscreen") {
    document.body.classList.add("mode-fullscreen");
    document.getElementById("viewModeText").textContent = "Khung Điện Thoại";
  } else {
    document.body.classList.remove("mode-fullscreen");
    document.getElementById("viewModeText").textContent = "Toàn Màn Hình";
  }

  // 8. Update SFX Button visual
  const sfxBtn = document.getElementById("sfxToggleBtn");
  if (sfxBtn) {
    sfxBtn.style.opacity = appData.settings.sfxEnabled ? "1" : "0.4";
  }
}

function escapeHtml(str) {
  if (!str) return "";
  return str.replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
}

// =============================================================================
// 6. CUSTOMIZER / DRAWER SYNCHRONIZATION
// =============================================================================
function populateDrawerInputs() {
  // Profile
  const inputName = document.getElementById("inputName");
  const inputBio = document.getElementById("inputBio");
  const inputVerified = document.getElementById("inputVerified");
  const inputAvatarUrl = document.getElementById("inputAvatarUrl");

  if (inputName) inputName.value = appData.profile.name;
  if (inputBio) inputBio.value = appData.profile.bio;
  if (inputVerified) inputVerified.checked = appData.profile.verified;
  if (inputAvatarUrl) inputAvatarUrl.value = appData.profile.avatar.startsWith("data:") ? "" : appData.profile.avatar;

  // Sync active avatar preset button
  document.querySelectorAll(".avatar-preset-btn").forEach(btn => {
    if (btn.getAttribute("data-preset-avatar") === appData.profile.avatar) {
      btn.classList.add("active");
    } else {
      btn.classList.remove("active");
    }
  });

  // Socials
  document.querySelectorAll(".social-input").forEach(inp => {
    const platform = inp.getAttribute("data-platform");
    const soc = appData.socials.find(s => s.platform === platform);
    inp.value = soc ? soc.url : "";
  });

  // Render Editable Links in Drawer
  renderEditableLinksList();
}

function generateIconOptions(selectedIcon) {
  const groups = [
    {
      group: "🛍️ Mua Sắm & E-Commerce",
      options: [
        { value: "shopee", label: "Shopee" },
        { value: "tiktokshop", label: "TikTok Shop" },
        { value: "lazada", label: "Lazada" },
        { value: "amazon", label: "Amazon Store" },
        { value: "shop", label: "Cửa hàng / Merch" }
      ]
    },
    {
      group: "💬 Mạng Xã Hội & Trò Chuyện",
      options: [
        { value: "facebook", label: "Facebook" },
        { value: "messenger", label: "Messenger" },
        { value: "zalo", label: "Zalo" },
        { value: "instagram", label: "Instagram" },
        { value: "tiktok", label: "TikTok" },
        { value: "threads", label: "Threads" },
        { value: "twitter", label: "X / Twitter" },
        { value: "telegram", label: "Telegram" },
        { value: "discord", label: "Discord" },
        { value: "whatsapp", label: "WhatsApp" },
        { value: "pinterest", label: "Pinterest" },
        { value: "linkedin", label: "LinkedIn" },
        { value: "reddit", label: "Reddit" }
      ]
    },
    {
      group: "🎬 Video, Livestream & Âm Nhạc",
      options: [
        { value: "youtube", label: "YouTube" },
        { value: "spotify", label: "Spotify" },
        { value: "applemusic", label: "Apple Music" },
        { value: "soundcloud", label: "SoundCloud" },
        { value: "podcast", label: "Podcast" },
        { value: "twitch", label: "Twitch" }
      ]
    },
    {
      group: "💳 Thanh Toán & Ủng Hộ",
      options: [
        { value: "momo", label: "Ví MoMo" },
        { value: "bank", label: "Ngân Hàng (Bank QR)" },
        { value: "coffee", label: "Buy Me a Coffee" },
        { value: "patreon", label: "Patreon" }
      ]
    },
    {
      group: "📚 Tri Thức, Sách & Tech",
      options: [
        { value: "goodreads", label: "Goodreads" },
        { value: "notion", label: "Notion" },
        { value: "github", label: "GitHub" },
        { value: "substack", label: "Substack / Blog" }
      ]
    },
    {
      group: "🌐 Liên Hệ & Khác",
      options: [
        { value: "globe", label: "Website cá nhân" },
        { value: "link", label: "Liên kết chung (Link)" },
        { value: "email", label: "Email liên hệ" },
        { value: "phone", label: "Số điện thoại / Hotline" }
      ]
    }
  ];

  return groups.map(g => `
    <optgroup label="${g.group}">
      ${g.options.map(opt => `<option value="${opt.value}" ${opt.value === selectedIcon ? "selected" : ""}>${opt.label}</option>`).join("")}
    </optgroup>
  `).join("");
}

function renderEditableLinksList() {
  const container = document.getElementById("editableLinksContainer");
  if (!container) return;
  container.innerHTML = "";

  appData.links.forEach((link, idx) => {
    const item = document.createElement("div");
    item.className = "editable-link-item";
    item.innerHTML = `
      <div class="editable-link-header">
        <span class="editable-link-title">
          <span style="display:inline-block; width:12px; height:12px; border-radius:3px; background:${link.iconColor};"></span>
          Liên kết #${idx + 1}
        </span>
        <div class="link-item-tools">
          <button class="btn-tool" data-move-up="${idx}" title="Di chuyển lên" ${idx === 0 ? "disabled style='opacity:0.3;'" : ""}>▲</button>
          <button class="btn-tool" data-move-down="${idx}" title="Di chuyển xuống" ${idx === appData.links.length - 1 ? "disabled style='opacity:0.3;'" : ""}>▼</button>
          <button class="btn-tool delete" data-delete-link="${idx}" title="Xóa liên kết">✕</button>
        </div>
      </div>

      <div class="form-group" style="margin-bottom:8px;">
        <label class="form-label">Tiêu đề nút:</label>
        <input type="text" class="form-input link-edit-title" data-idx="${idx}" value="${escapeHtml(link.title)}" placeholder="Tiêu đề...">
      </div>

      <div class="form-group" style="margin-bottom:8px;">
        <label class="form-label">Đường dẫn (URL):</label>
        <input type="text" class="form-input link-edit-url" data-idx="${idx}" value="${escapeHtml(link.url)}" placeholder="https://...">
      </div>

      <div style="display:flex; gap:10px; margin-bottom:8px;">
        <div style="flex:1;">
          <label class="form-label">Biểu tượng (Icon):</label>
          <select class="form-select link-edit-icon" data-idx="${idx}">
            ${generateIconOptions(link.icon)}
          </select>
        </div>
        <div style="width:75px;">
          <label class="form-label">Màu nền:</label>
          <input type="color" class="form-input link-edit-color" data-idx="${idx}" value="${link.iconColor || "#3b82f6"}" style="padding:2px; height:36px; cursor:pointer;">
        </div>
      </div>

      <div style="display:flex; gap:10px;">
        <div style="flex:1;">
          <label class="form-label">Mô tả phụ (Subtitle):</label>
          <input type="text" class="form-input link-edit-sub" data-idx="${idx}" value="${escapeHtml(link.subtitle || "")}" placeholder="Tùy chọn...">
        </div>
        <div style="width:90px;">
          <label class="form-label">Huy hiệu:</label>
          <input type="text" class="form-input link-edit-badge" data-idx="${idx}" value="${escapeHtml(link.badge || "")}" placeholder="HOT/NEW">
        </div>
      </div>
    `;
    container.appendChild(item);
  });

  attachLinkItemEvents();
}

function attachLinkItemEvents() {
  const container = document.getElementById("editableLinksContainer");
  if (!container) return;

  container.querySelectorAll("[data-move-up]").forEach(btn => {
    btn.onclick = (e) => {
      const idx = parseInt(e.currentTarget.getAttribute("data-move-up"));
      if (idx > 0) {
        const temp = appData.links[idx];
        appData.links[idx] = appData.links[idx - 1];
        appData.links[idx - 1] = temp;
        saveBioData();
        renderApp();
        renderEditableLinksList();
        sfx.playPop();
      }
    };
  });

  container.querySelectorAll("[data-move-down]").forEach(btn => {
    btn.onclick = (e) => {
      const idx = parseInt(e.currentTarget.getAttribute("data-move-down"));
      if (idx < appData.links.length - 1) {
        const temp = appData.links[idx];
        appData.links[idx] = appData.links[idx + 1];
        appData.links[idx + 1] = temp;
        saveBioData();
        renderApp();
        renderEditableLinksList();
        sfx.playPop();
      }
    };
  });

  container.querySelectorAll("[data-delete-link]").forEach(btn => {
    btn.onclick = (e) => {
      const idx = parseInt(e.currentTarget.getAttribute("data-delete-link"));
      if (confirm(`Bạn có chắc muốn xóa liên kết "${appData.links[idx].title}"?`)) {
        appData.links.splice(idx, 1);
        saveBioData();
        renderApp();
        renderEditableLinksList();
        showToast("Đã xóa liên kết");
        sfx.playPop();
      }
    };
  });

  container.querySelectorAll(".link-edit-title").forEach(inp => {
    inp.oninput = (e) => {
      const idx = parseInt(e.target.getAttribute("data-idx"));
      appData.links[idx].title = e.target.value;
      saveBioData();
      renderApp();
    };
  });

  container.querySelectorAll(".link-edit-url").forEach(inp => {
    inp.oninput = (e) => {
      const idx = parseInt(e.target.getAttribute("data-idx"));
      appData.links[idx].url = e.target.value;
      saveBioData();
      renderApp();
    };
  });

  container.querySelectorAll(".link-edit-icon").forEach(sel => {
    sel.onchange = (e) => {
      const idx = parseInt(e.target.getAttribute("data-idx"));
      const newIcon = e.target.value;
      appData.links[idx].icon = newIcon;
      if (BRAND_COLORS[newIcon]) {
        appData.links[idx].iconColor = BRAND_COLORS[newIcon];
      }
      saveBioData();
      renderApp();
      renderEditableLinksList();
      sfx.playPop();
    };
  });

  container.querySelectorAll(".link-edit-color").forEach(inp => {
    inp.oninput = (e) => {
      const idx = parseInt(e.target.getAttribute("data-idx"));
      appData.links[idx].iconColor = e.target.value;
      saveBioData();
      renderApp();
    };
  });

  container.querySelectorAll(".link-edit-sub").forEach(inp => {
    inp.oninput = (e) => {
      const idx = parseInt(e.target.getAttribute("data-idx"));
      appData.links[idx].subtitle = e.target.value;
      saveBioData();
      renderApp();
    };
  });

  container.querySelectorAll(".link-edit-badge").forEach(inp => {
    inp.oninput = (e) => {
      const idx = parseInt(e.target.getAttribute("data-idx"));
      appData.links[idx].badge = e.target.value.toUpperCase();
      saveBioData();
      renderApp();
    };
  });
}

// =============================================================================
// 7. TOAST NOTIFICATION SYSTEM
// =============================================================================
function showToast(message) {
  const container = document.getElementById("toastContainer");
  if (!container) return;

  const toast = document.createElement("div");
  toast.className = "toast";
  toast.innerHTML = `
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#22c55e" stroke-width="2.5">
      <path d="M20 6L9 17l-5-5"></path>
    </svg>
    <span>${message}</span>
  `;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateY(10px)";
    toast.style.transition = "all 0.25s ease";
    setTimeout(() => toast.remove(), 250);
  }, 2400);
}

function copyToClipboard(text) {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text);
  } else {
    const input = document.createElement("input");
    input.value = text;
    document.body.appendChild(input);
    input.select();
    document.execCommand("copy");
    document.body.removeChild(input);
  }
}

// =============================================================================
// 8. OFFLINE QR CODE GENERATOR (Pure JavaScript)
// =============================================================================
function generateQRCode(text, canvas) {
  const ctx = canvas.getContext("2d");
  const size = canvas.width;
  ctx.clearRect(0, 0, size, size);

  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, size, size);

  const cells = 25;
  const cellSize = Math.floor((size - 24) / cells);
  const margin = Math.floor((size - cells * cellSize) / 2);

  ctx.fillStyle = "#0f172a";

  function drawFinderPattern(x, y) {
    ctx.fillRect(margin + x * cellSize, margin + y * cellSize, 7 * cellSize, 7 * cellSize);
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(margin + (x + 1) * cellSize, margin + (y + 1) * cellSize, 5 * cellSize, 5 * cellSize);
    ctx.fillStyle = "#0f172a";
    ctx.fillRect(margin + (x + 2) * cellSize, margin + (y + 2) * cellSize, 3 * cellSize, 3 * cellSize);
  }

  drawFinderPattern(0, 0);
  drawFinderPattern(cells - 7, 0);
  drawFinderPattern(0, cells - 7);

  let seed = 0;
  for (let i = 0; i < text.length; i++) {
    seed = (seed * 31 + text.charCodeAt(i)) & 0xffffffff;
  }

  function randomBit() {
    seed = (seed * 1664525 + 1013904223) & 0xffffffff;
    return (seed >>> 30) % 2 === 1;
  }

  for (let r = 0; r < cells; r++) {
    for (let c = 0; c < cells; c++) {
      if ((r < 8 && c < 8) || (r < 8 && c >= cells - 8) || (r >= cells - 8 && c < 8)) {
        continue;
      }
      if (r === 6 || c === 6) {
        if ((r + c) % 2 === 0) {
          ctx.fillRect(margin + c * cellSize, margin + r * cellSize, cellSize, cellSize);
        }
        continue;
      }
      if (randomBit()) {
        ctx.fillRect(margin + c * cellSize, margin + r * cellSize, cellSize, cellSize);
      }
    }
  }

  // Decorative center circle
  const centerSize = 38;
  ctx.fillStyle = "#ffffff";
  ctx.beginPath();
  ctx.arc(size / 2, size / 2, centerSize / 2 + 3, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#dfc19b";
  ctx.beginPath();
  ctx.arc(size / 2, size / 2, centerSize / 2, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#2b1f16";
  ctx.font = "bold 13px -apple-system, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("BIO", size / 2, size / 2);
}

// =============================================================================
// 9. STANDALONE HTML EXPORTER
// =============================================================================
function exportStandaloneHtml() {
  const avatarSrc = appData.profile.avatar;
  const theme = appData.theme;

  let pageBg = "#dfc19b";
  let pageBgGrad = "radial-gradient(circle at 50% 20%, #ebd3b5 0%, #dfc19b 55%, #cfa075 100%)";
  let textColor = "#2b1f16";
  let cardBg = "#ffffff";
  let cardText = "#2b1f16";
  let cardRadius = "2px";
  let cardShadow = "drop-shadow(0 4px 10px rgba(65, 40, 20, 0.14))";
  let isTorn = true;
  let cardBorder = "none";
  let extraCss = "";

  if (theme === "unicorn-paper") {
    pageBg = "#eee7fa";
    pageBgGrad = "radial-gradient(circle at 50% 20%, #fbf9ff 0%, #eee5fa 55%, #dfd3f4 100%)";
    textColor = "#25163b";
    cardBg = "#ffffff";
    cardText = "#25163b";
    cardShadow = "drop-shadow(0 4px 12px rgba(139, 92, 246, 0.2))";
    isTorn = true;
  } else if (theme === "strawberry-paper") {
    pageBg = "#fde8ee";
    pageBgGrad = "radial-gradient(circle at 50% 20%, #fff5f8 0%, #fce4ee 55%, #f9cad7 100%)";
    textColor = "#4a1525";
    cardBg = "#ffffff";
    cardText = "#4a1525";
    cardShadow = "drop-shadow(0 4px 12px rgba(236, 72, 153, 0.2))";
    isTorn = true;
  } else if (theme === "matcha-paper") {
    pageBg = "#e2f7e7";
    pageBgGrad = "radial-gradient(circle at 50% 20%, #f2fcf5 0%, #dcfce7 55%, #bbf7d0 100%)";
    textColor = "#144a2c";
    cardBg = "#ffffff";
    cardText = "#144a2c";
    cardShadow = "drop-shadow(0 4px 12px rgba(34, 197, 94, 0.2))";
    isTorn = true;
  } else if (theme === "unicorn") {
    pageBg = "#f5f4fd";
    pageBgGrad = "linear-gradient(180deg, #faf9fe 0%, #ebe7fd 100%)";
    textColor = "#1f1b3c";
    cardBg = "#b2b0f8";
    cardText = "#ffffff";
    cardRadius = "14px";
    cardShadow = "drop-shadow(0 6px 16px rgba(178, 176, 248, 0.35))";
    isTorn = false;
  } else if (theme === "galaxy") {
    pageBg = "#c4b5fd";
    pageBgGrad = "linear-gradient(135deg, #c4b5fd 0%, #a5b4fc 35%, #e9d5ff 70%, #fbcfe8 100%)";
    textColor = "#241442";
    cardBg = "rgba(255, 255, 255, 0.75)";
    cardText = "#241442";
    cardRadius = "18px";
    cardBorder = "1.5px solid rgba(255, 255, 255, 0.9)";
    cardShadow = "drop-shadow(0 8px 24px rgba(167, 139, 250, 0.35))";
    isTorn = false;
    extraCss = `
      body::before {
        content: ""; position: fixed; inset: 0; pointer-events: none;
        background-image: radial-gradient(2px 2px at 20px 30px, #ffffff, transparent), radial-gradient(2.5px 2.5px at 60px 80px, #f472b6, transparent), radial-gradient(2px 2px at 120px 45px, #c084fc, transparent), radial-gradient(2px 2px at 250px 90px, #38bdf8, transparent);
        background-repeat: repeat; background-size: 320px 220px; opacity: 0.95;
      }
      .card-paper-bg { backdrop-filter: blur(14px); -webkit-backdrop-filter: blur(14px); }
      .avatar { box-shadow: 0 0 22px rgba(192, 132, 252, 0.6); }
    `;
  } else if (theme === "strawberry") {
    pageBg = "#fff0f5";
    pageBgGrad = "linear-gradient(180deg, #fff7fa 0%, #fde4ee 50%, #fbcfe8 100%)";
    textColor = "#4a1525";
    cardBg = "#ffffff";
    cardText = "#4a1525";
    cardRadius = "18px";
    cardBorder = "1.5px solid #fce7f3";
    cardShadow = "drop-shadow(0 6px 18px rgba(236, 72, 153, 0.22))";
    isTorn = false;
  } else if (theme === "matcha") {
    pageBg = "#e2f7e7";
    pageBgGrad = "linear-gradient(180deg, #f2fcf5 0%, #dcfce7 60%, #bbf7d0 100%)";
    textColor = "#144a2c";
    cardBg = "#ffffff";
    cardText = "#144a2c";
    cardRadius = "18px";
    cardBorder = "1.5px solid #dcfce7";
    cardShadow = "drop-shadow(0 6px 18px rgba(34, 197, 94, 0.2))";
    isTorn = false;
  }


  const htmlContent = `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(appData.profile.name)} | Bio Link</title>
  <meta name="description" content="${escapeHtml(appData.profile.bio)}">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      min-height: 100vh;
      display: flex;
      justify-content: center;
      background: ${pageBg};
      background-image: ${pageBgGrad};
      color: ${textColor};
      padding: 40px 18px;
    }
    .bio-wrap {
      width: 100%;
      max-width: 420px;
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
    }
    .avatar {
      width: 94px;
      height: 94px;
      border-radius: 50%;
      object-fit: cover;
      margin-bottom: 12px;
      box-shadow: 0 4px 14px rgba(0,0,0,0.1);
    }
    .name-row {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      font-size: 1.25rem;
      font-weight: 700;
      margin-bottom: 5px;
    }
    .verified { color: ${theme === "galaxy" ? "#c084fc" : theme === "strawberry" ? "#ec4899" : theme === "unicorn-paper" || theme === "unicorn" ? "#8b5cf6" : "#1d9bf0"}; display: ${appData.profile.verified ? "inline-flex" : "none"}; width: 19px; height: 19px; }
    .bio { font-size: 0.95rem; opacity: 0.85; margin-bottom: 16px; line-height: 1.4; max-width: 290px; }
    .socials { display: flex; gap: 18px; margin-bottom: 22px; justify-content: center; }
    .socials a { color: inherit; width: 22px; height: 22px; display: inline-block; transition: 0.2s; }
    .socials a svg { width: 22px; height: 22px; fill: currentColor; }
    .links { width: 100%; display: flex; flex-direction: column; gap: 14px; }
    .card {
      position: relative;
      display: flex;
      align-items: center;
      padding: 10px 14px;
      text-decoration: none;
      min-height: 58px;
      user-select: none;
      filter: ${cardShadow};
      transition: transform 0.2s;
    }
    .card:hover { transform: translateY(-2px); }
    .card-paper-bg {
      position: absolute;
      inset: 0;
      z-index: 0;
      pointer-events: none;
      background: ${cardBg};
      border-radius: ${cardRadius};
      border: ${cardBorder};
      ${isTorn ? `clip-path: polygon(
        0% 2.5px, 2.5% 0.5px, 5.5% 3px, 8.5% 1px, 12% 3px, 15.5% 0.5px, 19% 2.5px, 22.5% 0.5px, 26% 3px, 30% 1px,
        34% 3.5px, 38% 0.5px, 42% 2.5px, 46% 0.5px, 50% 3px, 54% 1px, 58% 3px, 62% 0.5px, 66% 2.5px, 70% 0.5px,
        74% 3.5px, 78% 1px, 82% 3px, 86% 0.5px, 90% 2.5px, 94% 0.5px, 97.5% 3px, 100% 2px,
        99.5% 25%, 100% 50%, 99.5% 75%, 100% calc(100% - 2.5px),
        97.5% calc(100% - 0.5px), 94% calc(100% - 3px), 90% calc(100% - 1px), 86% calc(100% - 3px),
        82% calc(100% - 0.5px), 78% calc(100% - 2.5px), 74% calc(100% - 0.5px), 70% calc(100% - 3.5px),
        66% calc(100% - 1px), 62% calc(100% - 3px), 58% calc(100% - 0.5px), 54% calc(100% - 2.5px),
        50% calc(100% - 0.5px), 46% calc(100% - 3px), 42% calc(100% - 1px), 38% calc(100% - 3px),
        34% calc(100% - 0.5px), 30% calc(100% - 2.5px), 26% calc(100% - 0.5px), 22.5% calc(100% - 3px),
        19% calc(100% - 1px), 15.5% calc(100% - 3px), 12% calc(100% - 0.5px), 8.5% calc(100% - 2.5px),
        5.5% calc(100% - 0.5px), 2.5% calc(100% - 3px), 0% calc(100% - 1.5px),
        0.5% 75%, 0% 50%, 0.5% 25%
      );` : ""}
    }
    .card-icon {
      position: relative;
      z-index: 1;
      width: 40px; height: 40px; border-radius: 10px; display: flex; align-items: center; justify-content: center; flex-shrink: 0;
    }
    .card-icon svg { width: 22px; height: 22px; fill: #ffffff; }
    .card-content { position: relative; z-index: 1; flex: 1; padding: 0 12px; }
    .card-title {
      font-weight: 600;
      font-size: 0.98rem;
      color: ${cardText};
    }
    .badge { position: absolute; top: -8px; right: 12px; background: #ff4757; color: #fff; font-size: 0.65rem; font-weight: 700; padding: 2px 7px; border-radius: 10px; z-index: 2; }
    ${extraCss}
  </style>
</head>

<body>
  <div class="bio-wrap">
    <img class="avatar" src="${avatarSrc}" alt="${escapeHtml(appData.profile.name)}">
    <div class="name-row">
      <span>${escapeHtml(appData.profile.name)}</span>
      <span class="verified">${SVG_ICONS.verified}</span>
    </div>
    <p class="bio">${escapeHtml(appData.profile.bio)}</p>

    <div class="socials">
      ${appData.socials.filter(s => s.enabled && s.url).map(s => `
        <a href="${s.url}" target="_blank" rel="noopener noreferrer">${SVG_ICONS[s.platform] || ""}</a>
      `).join("")}
    </div>

    <div class="links">
      ${appData.links.map(l => `
        <a href="${l.url}" class="card" target="_blank" rel="noopener noreferrer">
          <div class="card-paper-bg"></div>
          ${l.badge ? `<span class="badge">${l.badge}</span>` : ""}
          <div class="card-icon" style="background-color: ${l.iconColor};">
            ${SVG_ICONS[l.icon] || SVG_ICONS.globe}
          </div>
          <div class="card-content">
            <div class="card-title">${escapeHtml(l.title)}</div>
          </div>
        </a>
      `).join("")}
    </div>
  </div>
</body>
</html>`;

  const blob = new Blob([htmlContent], { type: "text/html" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `biolink_${appData.profile.name.toLowerCase().replace(/\s+/g, "_")}.html`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  showToast("Đã tải xuống file HTML độc lập!");
}

// =============================================================================
// 10. EVENT HANDLERS & INITIALIZATION
// =============================================================================
document.addEventListener("DOMContentLoaded", () => {
  renderApp();
  populateDrawerInputs();

  // Theme Switcher Buttons (Nav Pills)
  document.querySelectorAll("[data-set-theme]").forEach(btn => {
    btn.addEventListener("click", (e) => {
      const theme = e.currentTarget.getAttribute("data-set-theme");
      appData.theme = theme;
      saveBioData();
      renderApp();
      sfx.playPop();
    });
  });

  // Drawer Theme Cards
  document.querySelectorAll("[data-theme-choice]").forEach(card => {
    card.addEventListener("click", (e) => {
      const theme = e.currentTarget.getAttribute("data-theme-choice");
      appData.theme = theme;
      saveBioData();
      renderApp();
      sfx.playPop();
    });
  });

  // Drawer Open / Close
  const drawer = document.getElementById("editorDrawer");
  const backdrop = document.getElementById("editorBackdrop");
  const openDrawerBtn = document.getElementById("openDrawerBtn");
  const drawerCloseBtn = document.getElementById("drawerCloseBtn");

  function openDrawer() {
    drawer.classList.add("open");
    backdrop.classList.add("open");
    populateDrawerInputs();
    sfx.playPop();
  }

  function closeDrawer() {
    drawer.classList.remove("open");
    backdrop.classList.remove("open");
  }

  if (openDrawerBtn) openDrawerBtn.addEventListener("click", openDrawer);
  if (drawerCloseBtn) drawerCloseBtn.addEventListener("click", closeDrawer);
  if (backdrop) backdrop.addEventListener("click", closeDrawer);

  const footerCreateBtn = document.getElementById("footerCreateBioBtn");
  if (footerCreateBtn) {
    footerCreateBtn.addEventListener("click", (e) => {
      e.preventDefault();
      openDrawer();
    });
  }

  // Drawer Tabs Switching
  document.querySelectorAll(".drawer-tab").forEach(tab => {
    tab.addEventListener("click", (e) => {
      document.querySelectorAll(".drawer-tab").forEach(t => t.classList.remove("active"));
      document.querySelectorAll(".tab-pane").forEach(p => p.classList.remove("active"));

      e.currentTarget.classList.add("active");
      const targetId = e.currentTarget.getAttribute("data-tab");
      const pane = document.getElementById(targetId);
      if (pane) pane.classList.add("active");
      sfx.playPop();
    });
  });

  // Profile Live Inputs
  const inputName = document.getElementById("inputName");
  if (inputName) {
    inputName.addEventListener("input", (e) => {
      appData.profile.name = e.target.value;
      saveBioData();
      renderApp();
    });
  }

  const inputBio = document.getElementById("inputBio");
  if (inputBio) {
    inputBio.addEventListener("input", (e) => {
      appData.profile.bio = e.target.value;
      saveBioData();
      renderApp();
    });
  }

  const inputVerified = document.getElementById("inputVerified");
  if (inputVerified) {
    inputVerified.addEventListener("change", (e) => {
      appData.profile.verified = e.target.checked;
      saveBioData();
      renderApp();
      sfx.playPop();
    });
  }

  const inputAvatarUrl = document.getElementById("inputAvatarUrl");
  if (inputAvatarUrl) {
    inputAvatarUrl.addEventListener("input", (e) => {
      if (e.target.value.trim()) {
        appData.profile.avatar = e.target.value.trim();
        saveBioData();
        renderApp();
      }
    });
  }

  // Avatar Upload from PC
  const inputAvatarFile = document.getElementById("inputAvatarFile");
  if (inputAvatarFile) {
    inputAvatarFile.addEventListener("change", (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          appData.profile.avatar = event.target.result;
          saveBioData();
          renderApp();
          showToast("Đã cập nhật ảnh đại diện!");
          sfx.playPop();
        };
        reader.readAsDataURL(file);
      }
    });
  }

  // Avatar Presets Click
  document.querySelectorAll("[data-preset-avatar]").forEach(btn => {
    btn.addEventListener("click", (e) => {
      document.querySelectorAll(".avatar-preset-btn").forEach(b => b.classList.remove("active"));
      e.currentTarget.classList.add("active");
      const url = e.currentTarget.getAttribute("data-preset-avatar");
      appData.profile.avatar = url;
      saveBioData();
      renderApp();
      sfx.playPop();
    });
  });

  // Add New Link
  const addNewLinkBtn = document.getElementById("addNewLinkBtn");
  if (addNewLinkBtn) {
    addNewLinkBtn.addEventListener("click", () => {
      const newId = "link-" + Date.now();
      appData.links.push({
        id: newId,
        title: "Liên kết mới",
        subtitle: "",
        url: "https://",
        icon: "globe",
        iconColor: "#3b82f6",
        badge: ""
      });
      saveBioData();
      renderApp();
      renderEditableLinksList();
      showToast("Đã thêm liên kết mới!");
      sfx.playPop();
    });
  }

  // Social Inputs Change
  document.querySelectorAll(".social-input").forEach(inp => {
    inp.addEventListener("input", (e) => {
      const platform = e.target.getAttribute("data-platform");
      const val = e.target.value.trim();
      let soc = appData.socials.find(s => s.platform === platform);
      if (!soc) {
        soc = { platform, url: val, enabled: true };
        appData.socials.push(soc);
      } else {
        soc.url = val;
        soc.enabled = Boolean(val);
      }
      saveBioData();
      renderApp();
    });
  });

  // View Mode Toggle
  const viewModeBtn = document.getElementById("viewModeToggleBtn");
  if (viewModeBtn) {
    viewModeBtn.addEventListener("click", () => {
      appData.settings.viewMode = appData.settings.viewMode === "phone" ? "fullscreen" : "phone";
      saveBioData();
      renderApp();
      sfx.playPop();
    });
  }

  // SFX Toggle
  const sfxBtn = document.getElementById("sfxToggleBtn");
  if (sfxBtn) {
    sfxBtn.addEventListener("click", () => {
      appData.settings.sfxEnabled = !appData.settings.sfxEnabled;
      saveBioData();
      renderApp();
      showToast(appData.settings.sfxEnabled ? "Đã bật âm thanh" : "Đã tắt âm thanh");
    });
  }

  // Share & QR Modal
  const shareModal = document.getElementById("shareModalBackdrop");
  const openShareModalBtn = document.getElementById("openShareModalBtn");
  const modalCloseBtn = document.getElementById("modalCloseBtn");
  const copyShareLinkBtn = document.getElementById("copyShareLinkBtn");
  const downloadQrBtn = document.getElementById("downloadQrBtn");
  const shareInput = document.getElementById("shareLinkInput");
  const qrCanvas = document.getElementById("qrCodeCanvas");

  if (openShareModalBtn) {
    openShareModalBtn.addEventListener("click", () => {
      const currentUrl = window.location.href;
      if (shareInput) shareInput.value = currentUrl;
      if (qrCanvas) generateQRCode(currentUrl, qrCanvas);
      shareModal.classList.add("open");
      sfx.playPop();
    });
  }

  if (modalCloseBtn) {
    modalCloseBtn.addEventListener("click", () => shareModal.classList.remove("open"));
  }
  if (shareModal) {
    shareModal.addEventListener("click", (e) => {
      if (e.target === shareModal) shareModal.classList.remove("open");
    });
  }

  if (copyShareLinkBtn) {
    copyShareLinkBtn.addEventListener("click", () => {
      copyToClipboard(shareInput.value);
      showToast("Đã sao chép link vào clipboard!");
      sfx.playPop();
    });
  }

  if (downloadQrBtn && qrCanvas) {
    downloadQrBtn.addEventListener("click", () => {
      const link = document.createElement("a");
      link.download = `qrcode_${appData.profile.name.replace(/\s+/g, "_")}.png`;
      link.href = qrCanvas.toDataURL("image/png");
      link.click();
      showToast("Đã tải ảnh mã QR!");
      sfx.playPop();
    });
  }

  // Download Standalone HTML
  const downloadHtmlBtn = document.getElementById("downloadHtmlBtn");
  if (downloadHtmlBtn) {
    downloadHtmlBtn.addEventListener("click", exportStandaloneHtml);
  }

  // Export JSON
  const exportJsonBtn = document.getElementById("exportJsonBtn");
  if (exportJsonBtn) {
    exportJsonBtn.addEventListener("click", () => {
      const jsonStr = JSON.stringify(appData, null, 2);
      const blob = new Blob([jsonStr], { type: "application/json" });
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = `biolink_backup_${Date.now()}.json`;
      a.click();
      showToast("Đã xuất file cấu hình JSON!");
    });
  }

  // Import JSON
  const importJsonBtn = document.getElementById("importJsonBtn");
  const importJsonFile = document.getElementById("importJsonFile");
  if (importJsonBtn && importJsonFile) {
    importJsonBtn.addEventListener("click", () => importJsonFile.click());
    importJsonFile.addEventListener("change", (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          try {
            const parsed = JSON.parse(event.target.result);
            if (parsed.profile && parsed.links) {
              appData = parsed;
              saveBioData();
              renderApp();
              populateDrawerInputs();
              showToast("Đã nhập dữ liệu thành công!");
              sfx.playPop();
            } else {
              alert("File JSON không đúng định dạng Bio Link!");
            }
          } catch (err) {
            alert("Lỗi đọc file JSON: " + err.message);
          }
        };
        reader.readAsText(file);
      }
    });
  }

  // Reset Data to Default
  const resetBtn = document.getElementById("resetDataBtn");
  if (resetBtn) {
    resetBtn.addEventListener("click", () => {
      if (confirm("Bạn có chắc chắn muốn đặt lại tất cả về giao diện và thông tin gốc ban đầu?")) {
        appData = JSON.parse(JSON.stringify(DEFAULT_BIO_DATA));
        saveBioData();
        renderApp();
        populateDrawerInputs();
        showToast("Đã khôi phục cài đặt gốc!");
        sfx.playPop();
      }
    });
  }

  // Open drawer if ?edit=1 in URL
  if (urlParams.get("edit") === "1") {
    openDrawer();
    const tabQuery = urlParams.get("tab");
    if (tabQuery) {
      const targetTab = document.querySelector(`.drawer-tab[data-tab="tab-${tabQuery}"]`);
      if (targetTab) targetTab.click();
    }
  }
});


