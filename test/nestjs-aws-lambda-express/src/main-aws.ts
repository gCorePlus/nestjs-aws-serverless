import { lambda } from '../../../lib';
import { AppModule } from './app.module';

export const handler = lambda(AppModule);
