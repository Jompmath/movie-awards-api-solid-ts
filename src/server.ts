import express from 'express';
import cors from 'cors';
import { DatabaseConfig } from './config/database';
import movieRoutes from './routes/movieRoutes';
import { Container } from './config/container';
import * as path from 'path';
import * as fs from 'fs';

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use('/api', movieRoutes);

async function initializeApp() {
  try {
    // Obtém o caminho do CSV a partir dos argumentos da linha de comando
    let csvPath = process.argv[2];
    
    // Se nenhum caminho for fornecido, usa o arquivo padrão na raiz
    if (!csvPath) {
      csvPath = path.join(__dirname, '../movielist.csv');
      console.log(`Nenhum arquivo CSV fornecido. Usando o arquivo padrão: ${csvPath}`);
    }

    // Verifica se o arquivo existe
    if (!fs.existsSync(csvPath)) {
      console.error(`O arquivo CSV não foi encontrado: ${csvPath}`);
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