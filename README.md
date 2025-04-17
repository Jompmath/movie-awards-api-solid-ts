# API de Premiações de Filmes

Uma API RESTful para possibilitar a leitura da lista de indicados e vencedores
da categoria Pior Filme do Golden Raspberry Awards.

## Requisito do sistema

 Ler o arquivo CSV dos filmes e inserir os dados em uma base de dados ao iniciar a
 aplicação.

## Requisitos da API

Obter o produtor com maior intervalo entre dois prêmios consecutivos, e o que
obteve dois prêmios mais rápido, seguindo a especificação de formato definida.

Formato da resposta:
```json
{
  "min": [
    {
      "producer": "Producer Name",
      "interval": 1,
      "previousWin": 2008,
      "followingWin": 2009
    }
  ],
  "max": [
    {
      "producer": "Producer Name",
      "interval": 99,
      "previousWin": 1900,
      "followingWin": 1999
    }
  ]
}
```

## Requisitos não funcionais do sistema

- API RESTful seguindo o Nível 2 do Modelo de Maturidade de Richardson  
- Testes de integração  
- Banco de dados SQLite em memória  
- Implementação em TypeScript  
- Princípios SOLID  


## Pré-requisitos

- Node.js (v14 ou superior)  
- npm (v6 ou superior)  

## Instalação

1. Clone o repositório  
2. Instale as dependências:  
```bash
npm install
```

## Executando a Aplicação

1. Compile o código TypeScript:  
```bash
npm run build
```

2. Inicie o servidor:  
```bash
# Modo de desenvolvimento (usa o arquivo padrão em ./movielist.csv)
npm run dev

# Modo de desenvolvimento com arquivo personalizado
npm run dev -- /caminho/para/seu/arquivo.csv

# Modo de produção (após compilar, usa o arquivo padrão)
npm start

# Modo de produção com arquivo personalizado
npm start -- /caminho/para/seu/arquivo.csv
```

O servidor será iniciado na porta 3000 por padrão.

> **Nota**: Se nenhum arquivo CSV for fornecido, a aplicação usará o arquivo padrão em src/data/movielist.csv.

## Executando os Testes

Para rodar os testes de integração:  
```bash
npm run test:integration
```

## Endpoints da API

### GET /api/producers/intervals

Retorna os produtores com os menores e maiores intervalos entre premiações consecutivas.

## Formato do Arquivo CSV

O arquivo CSV deve conter as seguintes colunas:
- year  
- title  
- studios  
- producers  
- winner  

Exemplo:  
```csv
year;title;studios;producers;winner
1980;Movie A;Studio X;Producer 1;yes
1981;Movie B;Studio Y;Producer 2;no
```

## Sobre o algorítmo utilizado

- Busca todos os filmes vencedores do banco de dados
- Para cada produtor, carrega a lista de anos que ele ganhou
- Ignora produtores com menos de 2 vitórias
- Ordena os anos de vitória em ordem crescente para resolver desordenação na entrada
- Calcula os intervalos entre vitórias consecutivas
- Encontra o menor e maior intervalo entre todos os intervalos calculados
- Retorna dois arrays:
  - min: todos os intervalos que são iguais ao menor intervalo
  - max: todos os intervalos que são iguais ao maior intervalo

## Minhas considerações 

Embora o requisito não exigisse o uso de TypeScript nem a aplicação dos princípios SOLID, optei por utilizá-los para demonstrar conhecimentos avançados de desenvolvimento de software — como injeção de dependência, inversão de controle e segregação de interfaces — que podem ser úteis conforme as diretrizes da empresa e a complexidade do problema e dos testes automatizados.


## |Considerações e readequação 

Considerando o conjunto de dados fornecido juntamente com o teste, o resultado esperado é um registro min com intervalo igual a 1 e um registro max com intervalo igual a 13;
> **Nota**: De fato, eu não tinha contemplado que poderia haver produtores ganhando prêmios juntos como "Steven Perry and Joel Silver" em 1990 e que um ano após 1991, Joel Silver ganhou sozinho, ou seja, para o produtor Joel Silver o intervalo é de 1 ano.

Requisito não funcional 2: O teste de integração deve garantir que o retorno da API é exatamente o esperado de acordo com os dados do arquivo padrão e falhar caso contrário;
> **Nota**: Sim, deixei o teste muito geral. Agora como especificado, o teste leva em consideração os valores esperados no arquivo original.

Requisito do sistema: O sistema deve carregar o arquivo original fornecido juntamente com a proposta do teste automaticamente.
> **Nota**: Adequei o comando de inicialização para que, caso seja passado um path de arquivo como argumento carregue ele, caso contrário carrega o arquivo original como default