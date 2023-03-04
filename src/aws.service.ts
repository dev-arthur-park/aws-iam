import { Injectable } from "@nestjs/common"
import { ListAccessKeysCommand, ListUsersCommand } from "@aws-sdk/client-iam"
import { IAMClient } from "@aws-sdk/client-iam"
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs"
import { join } from "path"
import * as dotenv from "dotenv"
import { QueryType, AwsAcceskeyResultType } from "./libs/types"
import { url } from "inspector"

@Injectable()
export class AWSService {
  getAWS(): string {
    return "AWS API Healthy!"
  }

  async list(q?: QueryType) {
    try {
      return await this.getAwsAccesKeyList(q)
    } catch (err) {
      console.log("app.service.list", err)
      return 500
    }
  }
  
  async download(q: QueryType) {
    try {
      const makefilename = await this.makefile(q)
      return readFileSync(makefilename)
    } catch (err) {
      console.log("app.service.list", err)
      return 500
    }
  }

  // 쿼리에 들어온 값중 키는 정상이나 값이 비정상인 경우만 체크
  // 키가 비 정상적인 경우에는 기본 값으로만 대응
  checkQueryParam(q: QueryType) {
    if (q?.hours && !Number(q?.hours)) {
      return {
        status: 400, 
        message: "period 값은 숫자만 입력해야 합니다."
      }
    } else if (q?.statusType) {
      const type = q.statusType.toLowerCase()
      if (type != "all" && type != "active" && type != "inactive") {
        return {
          status: 400, 
          message: "statusType은 all, active, inactive 중 하나를 입력해야합니다."
        }
      }
    }
    return undefined
  }

  private async makefile(q: QueryType) {
    const resultPath = join(__dirname, "../resources")
    const resultFileName = join(resultPath, "result.txt")
    const resultData = await this.getAwsAccesKeyList(q)
    
    if (!existsSync(resultPath)) {
      mkdirSync(resultPath, { recursive:true })
    }
    
    writeFileSync(resultFileName, JSON.stringify(resultData))
    
    return resultFileName
  }

  private async getAwsAccesKeyList(q?: QueryType){
    const env = dotenv?.config()?.parsed
    
    // aws iam 접속 정보
    const iamClient = new IAMClient({
      credentials: {
        accessKeyId:env["AWS_ACCESS_KEY"],
        secretAccessKey: env["AWS_SECRET_KEY"]
      },
      region : env["AWS_REGION"]
    })
    
    const hours = q?.hours || 24 * 30

    const currentDate = new Date()
    const tartgetDate = new Date(currentDate.setHours(currentDate.getHours() - hours))
    
    const result:Array<AwsAcceskeyResultType> = []
    const params = { MaxItems: 1000 }
    
    // iam user 목록
    const users = await iamClient.send(new ListUsersCommand(params))
    const allAccessKey = !q || !q.statusType || q.statusType.toLowerCase() == "all"
    
    await Promise.all(users.Users.map(async (user) => {
      // user 중 키가 있는 계정 찾음
      const data = await iamClient.send(new ListAccessKeysCommand({UserName: user.UserName}))
      const keysData = data.AccessKeyMetadata || undefined
  
      // 발췌된 키 중 연재 Active면서 생성 된지 일정 시간이 지난 경우 찾음
      keysData?.filter((key) => 
          (allAccessKey || key.Status.toLowerCase() == q.statusType) && key.CreateDate < tartgetDate
      )
      .map((key) => {
        result.push({
          userName: key.UserName, 
          accessKeyID: key.AccessKeyId, 
          createDate: key.CreateDate,
          status: key.Status
        })
      }
    )}))
    // 생성 날짜가 과거인 경우 부터 
    return result.sort((a,b) => a.createDate.getTime() - b.createDate.getTime())
  }
}
