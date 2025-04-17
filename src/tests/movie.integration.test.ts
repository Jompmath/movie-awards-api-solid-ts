import request from 'supertest';
import express from 'express';
import { DatabaseConfig } from '../config/database';
import movieRoutes from '../routes/movieRoutes';
import { Container } from '../config/container';
import * as path from 'path';

describe('Testes de Integração da API de Filmes', () => {
  let app: express.Application;

  beforeAll(async () => {
    await DatabaseConfig.initialize();
    
    // Importando dados de teste usando o container de dependências
    const container = Container.getInstance();
    const movieService = container.getMovieService();
    const csvPath = path.join(__dirname, '../../movielist.csv');
    await movieService.importMoviesFromCSV(csvPath);

    app = express();
    app.use('/api', movieRoutes);
  });

  describe('GET /api/producers/intervals', () => {
    it('deve retornar intervalos de produtores com os valores corretos', async () => {
      const response = await request(app)
        .get('/api/producers/intervals')
        .expect(200);

      // Verificando a estrutura da resposta
      expect(response.body).toHaveProperty('min');
      expect(response.body).toHaveProperty('max');
      expect(Array.isArray(response.body.min)).toBe(true);
      expect(Array.isArray(response.body.max)).toBe(true);

      // Verificando os valores específicos retornados pela API
      // Intervalo mínimo deve ser 1
      expect(response.body.min.length).toBeGreaterThan(0);
      expect(response.body.min[0].interval).toBe(1);
      
      // Intervalo máximo deve ser 13
      expect(response.body.max.length).toBeGreaterThan(0);
      expect(response.body.max[0].interval).toBe(13);

      // Verificando os produtores específicos
      // Produtor com intervalo mínimo
      const minProducer = response.body.min[0].producer;
      expect(minProducer).toBe('Joel Silver');
      expect(response.body.min[0].previousWin).toBe(1990);
      expect(response.body.min[0].followingWin).toBe(1991);

      // Produtor com intervalo máximo
      const maxProducer = response.body.max[0].producer;
      expect(maxProducer).toBe('Matthew Vaughn');
      expect(response.body.max[0].previousWin).toBe(2002);
      expect(response.body.max[0].followingWin).toBe(2015);
    });
  });
}); 