import { Controller, Get } from "@nestjs/common"

@Controller("")
export class RootController {

  @Get()
  rootMessage(): string {
    return "Hello"
  }
}
