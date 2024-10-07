import { AgentService } from './agent.service';
import { AgentController } from './agent.controller';
import { MiddlewareConsumer,forwardRef, Module, RequestMethod } from '@nestjs/common';
import { MongooseModule } from "@nestjs/mongoose";
import { AccessTokenMiddleware } from '../common/middleware/auth.middleware'
import forFeatureDb from 'src/db/for-feature.db';
import { ErrorFormat } from 'src/helpers/errorFormat';
import { AuthModule } from '../auth/auth.module';

@Module({
  controllers: [AgentController],
  providers: [AgentService,ErrorFormat],
  imports: [
    forwardRef(() => AuthModule),
    MongooseModule.forFeature(forFeatureDb)],
})

export class AgentModule {
  configure(consumer:MiddlewareConsumer){
    consumer.apply(AccessTokenMiddleware)
    .forRoutes({path:'agents*',method:RequestMethod.ALL})
  }
}
