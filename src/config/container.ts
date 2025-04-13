import { Database } from 'sqlite3';
import { MovieRepository } from '../repositories/MovieRepository';
import { MovieService } from '../services/MovieService';
import { IMovieRepository } from '../interfaces/IMovieRepository';
import { IMovieService } from '../interfaces/IMovieService';
import { DatabaseConfig } from './database';

export class Container {
  private static instance: Container;
  private movieRepository: IMovieRepository;
  private movieService: IMovieService;

  private constructor() {
    const db = DatabaseConfig.getInstance();
    this.movieRepository = new MovieRepository(db);
    this.movieService = new MovieService(this.movieRepository);
  }

  public static getInstance(): Container {
    if (!Container.instance) {
      Container.instance = new Container();
    }
    return Container.instance;
  }

  public getMovieService(): IMovieService {
    return this.movieService;
  }

  public getMovieRepository(): IMovieRepository {
    return this.movieRepository;
  }
} 