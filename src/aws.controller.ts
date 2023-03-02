import { Controller, Get, Res, Query, Header } from "@nestjs/common"
import { AWSService } from "./aws.service"
import { QueryType } from "./libs/types"

@Controller("aws")
export class AWSController {
  constructor(private readonly awsService: AWSService) {}

  @Get("/")
  getHello(): string {
    return this.awsService.getAWS()
  }

  @Get("/list")
  async listAWSiAM(@Query() q: QueryType , @Res() res): Promise<any> {
    if (q?.period && !Number(q?.period)) {
      return res.send({
        status: 400, 
        message: "period 값은 숫자만 입력해야 합니다."
      })
    }

    const reuslt = await this.awsService.list(q)

    if (reuslt && reuslt == 500) {
      return res.send(
        {
          status: 500,
          message: "server error"
        }
      )
    }

    return res.send(
      {
        status : 200,
        reuslt
      }
    )
  }

  @Get("/download")
  @Header("Content-type", "application/txt")
  async listAWSiAMtoFile(@Query() q: QueryType, @Res() res): Promise<{} | FileSystem> {
    if (q?.period && !Number(q?.period)) {
      return res.send({
        status: 400, 
        message: "period 값은 숫자만 입력해야 합니다."
      })
    }
    
    const reuslt = await this.awsService.download(q)

    if (reuslt && reuslt == 500) {
      return res.send(
        {
          status: 500,
          message: "server error"
        }
      )
    }

    return await res.send(reuslt)
  }
}
