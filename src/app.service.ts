import { Injectable } from '@nestjs/common'
import { ListAccessKeysCommand, ListUsersCommand } from "@aws-sdk/client-iam"
import { IAMClient } from "@aws-sdk/client-iam"
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs'
import { join } from 'path'
import * as dotenv from 'dotenv'

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
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

  private async makefile(q: QueryType) {
    const savePath = join(__dirname, "../resources");
    const saveFileName = join(savePath, "result.txt");
    const saveData = await this.getAwsAccesKeyList(q)
    
    if (!existsSync(savePath)) {
      mkdirSync(savePath, { recursive:true });
    }
    
    writeFileSync(saveFileName, JSON.stringify(saveData));
    
    return saveFileName
  }

  private async getAwsAccesKeyList(q?: QueryType){
    const env = dotenv?.config()?.parsed
    
    const iamClient = new IAMClient({
      credentials: {
        accessKeyId:env["AWS_ACCESS_KEY"],
        secretAccessKey: env["AWS_SECRET_KEY"]
      },
      region : env["AWS_REGION"]
    })

    const params = { MaxItems: 1000 };

    const hours = q?.period || 24 * 30

    const CurrentDate = new Date()
    const TartgetDate = new Date(CurrentDate.setHours(CurrentDate.getHours() - hours))
    
    const users = await iamClient.send(new ListUsersCommand(params))
   
    const result = []
    
    await Promise.all(users.Users.map(async (user) => {
      const data = await iamClient.send(new ListAccessKeysCommand({UserName: user.UserName}))
      const keysData = data.AccessKeyMetadata || [];
      
      keysData.filter((key) => key.CreateDate < TartgetDate && key.Status == "Active")
      .map((key) => {
        result.push({
          UserName: key.UserName, 
          AccessKeyID: key.AccessKeyId, 
          CreateDate: key.CreateDate
        }
        )
      }
    )}))
    
    return result
  }
}

export interface QueryType
{
  period?: number
  type?: string // 시간이 아닌 년월일을 구분하려고 만들었음 
}
