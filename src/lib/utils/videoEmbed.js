/**
 * Utility to parse and format video URLs into responsive embeddable formats
 * Supports YouTube (Standard, Shorts, youtu.be, embed), Vimeo, and direct video files.
 */

export function parseVideoUrl(rawUrl) {
  if (!rawUrl || typeof rawUrl !== 'string') return null;
  const url = rawUrl.trim();
  if (!url) return null;

  // Direct video file or data URL
  const isDirectFile = /\.(mp4|webm|ogg|mov)(\?.*)?$/i.test(url) || url.startsWith('data:video/') || url.startsWith('blob:');
  if (isDirectFile) {
    return {
      type: 'video',
      src: url,
      isEmbed: false
    };
  }

  // YouTube match: handles watch?v=, youtu.be/, shorts/, embed/, mobile
  const ytMatch = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/|youtube\.com\/shorts\/)([^"&?\/\s]{11})/i);
  if (ytMatch && ytMatch[1]) {
    return {
      type: 'youtube',
      id: ytMatch[1],
      src: `https://www.youtube.com/embed/${ytMatch[1]}?rel=0&modestbranding=1`,
      isEmbed: true
    };
  }

  // Vimeo match
  const vimeoMatch = url.match(/(?:vimeo\.com\/)(?:.*\/)?([0-9]+)/i);
  if (vimeoMatch && vimeoMatch[1]) {
    return {
      type: 'vimeo',
      id: vimeoMatch[1],
      src: `https://player.vimeo.com/video/${vimeoMatch[1]}`,
      isEmbed: true
    };
  }

  // Generic iframe embed (e.g. if user already provided embed URL)
  if (url.includes('/embed/') || url.includes('player.')) {
    return {
      type: 'iframe',
      src: url,
      isEmbed: true
    };
  }

  // Default fallback: attempt direct video tag
  return {
    type: 'video',
    src: url,
    isEmbed: false
  };
}
