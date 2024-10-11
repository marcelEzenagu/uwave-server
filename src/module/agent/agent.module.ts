import { AgentService } from './agent.service';
import { AgentController } from './agent.controller';
import { MiddlewareConsumer,forwardRef, Module, RequestMethod } from '@nestjs/common';
import { MongooseModule } from "@nestjs/mongoose";
import { AccessTokenMiddleware } from '../common/middleware/auth.middleware'
import forFeatureDb from 'src/db/for-feature.db';
import { ErrorFormat } from 'src/helpers/errorFormat';
import { AuthModule } from '../auth/auth.module';
import { AdminModule } from '../admin/admin.module';

@Module({
  controllers: [AgentController],
  exports: [AgentService],
  providers: [AgentService,ErrorFormat],
  imports: [
    forwardRef(() => AuthModule),
    // forwardRef(() => AdminModule),
    MongooseModule.forFeature(forFeatureDb)],
})

export class AgentModule {
  configure(consumer:MiddlewareConsumer){
    consumer.apply(AccessTokenMiddleware)
    .forRoutes({path:'agents*',method:RequestMethod.ALL})
  }
}
