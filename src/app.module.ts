import { Module } from "@nestjs/common"
import { AWSController } from "./aws.controller"
import { AWSService } from "./aws.service"
import { RootController } from "./root.controller"

@Module({
  imports: [],
  controllers: [AWSController, RootController],
  providers: [AWSService],
})
export class AppModule {}
