export enum LearnType {
  LEARN_LISTEN = 'LEARN_LISTEN',
  LEARN_VOCABULARY = 'LEARN_VOCABULARY',
}

export enum WordType {
  LEARNED = 'LEARNED',
  LEARN = 'LEARN',
}

export const apiUrl = process.env.NEXT_PUBLIC_API_URL;