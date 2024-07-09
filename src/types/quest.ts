export type Quest = {
  location: {
    lat: number;
    long: number;
  };
  timestamp: string;
  documentId?: string;
};