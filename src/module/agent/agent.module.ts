import { AgentService } from './agent.service';
import { AgentController } from './agent.controller';
import { MiddlewareConsumer,forwardRef, Module, RequestMethod } from '@nestjs/common';
import { MongooseModule } from "@nestjs/mongoose";
import { AccessTokenMiddleware } from '../common/middleware/auth.middleware'
import forFeatureDb from 'src/db/for-feature.db';
import { ErrorFormat } from 'src/helpers/errorFormat';
import { AuthModule } from '../auth/auth.module';
import { AdminModule } from '../admin/admin.module';
import { ShipmentService } from '../shipment/shipment.service';
import { AppModule } from 'src/app.module';
import { FileService } from 'src/helpers/upload';
import { UtilityService } from 'src/helpers/utils';

@Module({
  controllers: [AgentController],
  exports: [AgentService],
  providers: [AgentService,FileService,UtilityService,ErrorFormat,ShipmentService],
  imports: [
    forwardRef(() => AuthModule),
    forwardRef(() => AppModule),
    MongooseModule.forFeature(forFeatureDb)],
})

export class AgentModule {
  configure(consumer:MiddlewareConsumer){
    consumer.apply(AccessTokenMiddleware)
    .forRoutes({path:'agents*',method:RequestMethod.ALL})
  }
}
