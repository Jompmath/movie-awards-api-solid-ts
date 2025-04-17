import { Movie, ProducerInterval, ProducerIntervals } from '../models/Movie';
import { IMovieRepository } from '../interfaces/IMovieRepository';
import { IMovieService } from '../interfaces/IMovieService';
import { parse } from 'csv-parse/sync';
import * as fs from 'fs';

export class MovieService implements IMovieService {
  constructor(private readonly repository: IMovieRepository) {}

  async importMoviesFromCSV(filePath: string): Promise<void> {
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const records = parse(fileContent, {
      columns: true,
      delimiter: ';',
      skip_empty_lines: true
    });

    for (const record of records) {
      const movie: Movie = {
        year: parseInt(record.year),
        title: record.title,
        studios: record.studios,
        producers: record.producers,
        winner: record.winner === 'yes'
      };
      await this.repository.insertMovie(movie);
    }
  }

  async getProducerIntervals(): Promise<ProducerIntervals> {
    const winnerMovies = await this.repository.getWinnerMovies();

    const producerWins = new Map<string, number[]>();

    // Agrupando os anos de premiação por produtor
    for (const movie of winnerMovies) {
      // Tratando diferentes formatos de separação de produtores
      const producersList = movie.producers
        .split(/,| and /)  // Separando por vírgula ou " and "
        .map(p => p.trim())
        .filter(p => p.length > 0);  // Removendo strings vazias

      for (const producer of producersList) {
        if (!producerWins.has(producer)) {
          producerWins.set(producer, []);
        }
        producerWins.get(producer)?.push(movie.year);
      }
    }

    const intervals: ProducerInterval[] = [];

    // Calculando os intervalos para cada produtor
    for (const [producer, years] of producerWins.entries()) {
      if (years.length < 2) continue; // Para cada produtor com 2 ou mais vitórias

      // Ordenando os anos antes de calcular os intervalos
      const sortedYears = [...years].sort((a, b) => a - b);

      // Removendo anos duplicados para considerar múltiplas premiações no mesmo ano
      const uniqueYears = [...new Set(sortedYears)];

      for (let i = 0; i < uniqueYears.length - 1; i++) {
        const interval = uniqueYears[i + 1] - uniqueYears[i];
        intervals.push({
          producer,
          interval,
          previousWin: uniqueYears[i],
          followingWin: uniqueYears[i + 1]
        });
      }
    }

    // Encontrando os intervalos mínimo e máximo
    const minInterval = Math.min(...intervals.map(i => i.interval));
    const maxInterval = Math.max(...intervals.map(i => i.interval));

    // Verificando se o intervalo mínimo é 1 e o máximo é 13
    if (minInterval !== 1 || maxInterval !== 13) {
      console.warn(`Intervalos encontrados: min=${minInterval}, max=${maxInterval}. Esperado: min=1, max=13`);
      console.warn('Produtores com múltiplas vitórias:');
      for (const [producer, years] of producerWins.entries()) {
        if (years.length >= 2) {
          console.warn(`${producer}: ${years.sort((a, b) => a - b).join(', ')}`);
        }
      }
    }

    return {
      min: intervals.filter(i => i.interval === minInterval),
      max: intervals.filter(i => i.interval === maxInterval)
    };
  }
} 