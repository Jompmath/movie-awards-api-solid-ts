import { Movie } from '../models/Movie';

export interface IMovieRepository {
  insertMovie(movie: Movie): Promise<void>;
  getWinnerMovies(): Promise<Movie[]>;
} 