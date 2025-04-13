export interface Movie {
  year: number;
  title: string;
  studios: string;
  producers: string;
  winner: boolean;
}

export interface ProducerInterval {
  producer: string;
  interval: number;
  previousWin: number;
  followingWin: number;
}

export interface ProducerIntervals {
  min: ProducerInterval[];
  max: ProducerInterval[];
} 