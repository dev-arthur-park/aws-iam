import { Controller, Get } from "@nestjs/common"

@Controller("")
export class RootController {

  @Get()
  rootMessage(): string {
    return "aws/list와 aws/download url를 사용하세요"
  }
}
