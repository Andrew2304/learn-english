export const parseWordDefinition = (str: string) => {
  const regex = /^(\w+)\s\((.+?)\)\s\/(.+?)\/:\s(.+)$/;
  const match = str.match(regex);

  if (match) {
    return {
      name: match[1], // Từ chính (ví dụ: "a")
      type: match[2], // Loại từ (ví dụ: "indefinite article")
      pronunciation: match[3], // Phiên âm (ví dụ: "/ə/")
      translation: match[4], // Nghĩa (ví dụ: "một")
    };
  } else {
    console.log('parseWordDefinition error', str);
    return null; // Trả về null nếu không khớp
  }
};
