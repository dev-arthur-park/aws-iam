import { Controller, Get, Res, Query, Header } from '@nestjs/common';
import { AppService, QueryType } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get("/aws/list")
  async listAWSiAM(@Query() q: QueryType , @Res() res): Promise<any> {
    if (q?.period && !Number(q?.period)) {
      return res.send({
        status: 400, 
        MSG: "period 값은 숫자만 입력해야 합니다."
      })
    }

    const reuslt = await this.appService.list(q)

    if (reuslt && reuslt == 500) {
      return res.send(
        {
          status: 500,
          MSG: "server error"
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

  @Get("/aws/download")
  @Header('Content-type', 'application/txt')
  async listAWSiAMtoFile(@Query() q: QueryType, @Res() res): Promise<{} | FileSystem> {
    if (q?.period && !Number(q?.period)) {
      return res.send({
        status: 400, 
        MSG: "period 값은 숫자만 입력해야 합니다."
      })
    }
    
    const reuslt = await this.appService.download(q)

    if (reuslt && reuslt == 500) {
      return res.send(
        {
          status: 500,
          MSG: "server error"
        }
      )
    }

    return await res.send(reuslt)
  }
}
