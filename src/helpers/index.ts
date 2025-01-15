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
export const parseWordExample = (sentence: string) => {
  const questionRegex = /- (.*?)(\/)/; // Regex to match everything before the first /
  const phoneticRegex = /\/(.*?)\//; // Regex to match content between slashes

  const questionMatch = sentence.match(questionRegex);
  const phoneticMatch = sentence.match(phoneticRegex);

  const question = questionMatch
    ? questionMatch[1].trim().replace('Example:', '').trim()
    : null;
  const phonetic = phoneticMatch ? phoneticMatch[1] : null;

  return question && phonetic ? [question, phonetic] : [null, null];
};
export const parseWordTranslation = (text: string) => {
  const match = text.match(/- Translation: (.+)/);
  return match ? match[1] : null;
};

export enum EQuestionType {
  When = 'When',
  Where = 'Where',
  Who = 'Who',
  Why = 'Why',
  What = 'What',
}

export const USER_ID = 1;
