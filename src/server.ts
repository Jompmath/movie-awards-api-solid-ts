import express from 'express';
import cors from 'cors';
import { DatabaseConfig } from './config/database';
import movieRoutes from './routes/movieRoutes';
import { Container } from './config/container';
import * as path from 'path';

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use('/api', movieRoutes);

async function initializeApp() {
  try {
    // Obtém o caminho do CSV a partir dos argumentos da linha de comando
    const csvPath = process.argv[2];
    
    if (!csvPath) {
      console.error('Por favor, forneça o caminho do arquivo CSV como argumento.');
      console.error('Uso: npm start <caminho-do-arquivo-csv>');
      process.exit(1);
    }

    // Converte para caminho absoluto se um caminho relativo for fornecido
    const absoluteCsvPath = path.resolve(csvPath);

    await DatabaseConfig.initialize();
    
    // Importa filmes do CSV usando o container de dependências
    const container = Container.getInstance();
    const movieService = container.getMovieService();
    await movieService.importMoviesFromCSV(absoluteCsvPath);

    app.listen(port, () => {
      console.log(`Servidor em execução na porta ${port}`);
      console.log(`Filmes importados de: ${absoluteCsvPath}`);
    });
  } catch (error) {
    console.error('Falha ao inicializar a aplicação:', error);
    process.exit(1);
  }
}

initializeApp();