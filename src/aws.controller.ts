import { Controller, Get, Res, Query, Header, StreamableFile } from "@nestjs/common"
import { AWSService } from "./aws.service"
import { AwsResponseResultType, QueryType } from "./libs/types"

@Controller("aws")
export class AWSController {
  constructor(private readonly awsService: AWSService) {}

  @Get("/")
  getHello(): string {
    return this.awsService.getAWS()
  }

  /*
  생성 후 일정 시간이 지난 aws acesskey를 가져오는 api
  param:
    hours -> 생성 후 지난 시점을 특정하기 위한 시간으로 값이 안 들어오면 24 * 30 시간(대략 한달)을 기본 값으로 사용
  result:

   */
  @Get("/list")
  async listAWSiAM(@Query() q: QueryType , @Res() res): Promise<AwsResponseResultType> {
    const checkQueryParamResult = this.awsService.checkQueryParam(q)
    if ( checkQueryParamResult)  return res.send(checkQueryParamResult)

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
  async listAWSiAMtoFile(@Query() q: QueryType, @Res() res): Promise<AwsResponseResultType | StreamableFile> {
    const checkQueryParamResult = this.awsService.checkQueryParam(q)
    if ( checkQueryParamResult)  return res.send(checkQueryParamResult)
    
    const reuslt = await this.awsService.download(q)

    if (reuslt && reuslt == 500) {
      return res.send(
        {
          status: 500,
          message: "server error"
        }
      )
    }

    return res.send(reuslt)
  }
}
