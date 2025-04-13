import { ProducerIntervals } from '../models/Movie';

export interface IMovieService {
  importMoviesFromCSV(filePath: string): Promise<void>;
  getProducerIntervals(): Promise<ProducerIntervals>;
} 