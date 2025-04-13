import { Request, Response } from 'express';
import { Container } from '../config/container';
import { IMovieService } from '../interfaces/IMovieService';

export class MovieController {
  private service: IMovieService;

  constructor() {
    const container = Container.getInstance();
    this.service = container.getMovieService();
  }

  async getProducerIntervals(req: Request, res: Response): Promise<void> {
    try {
      const intervals = await this.service.getProducerIntervals();
      res.json(intervals);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
} 