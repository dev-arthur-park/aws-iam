import { Injectable } from '@nestjs/common'
import { ListAccessKeysCommand } from "@aws-sdk/client-iam"
import { IAMClient } from "@aws-sdk/client-iam"
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs'
import { join } from 'path'

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
    const iamClient = new IAMClient({})
    const params = { MaxItems: 100 };

    const hours = q?.period || 24 * 30

    const CurrentDate = new Date()
    const TartgetDate = new Date(CurrentDate.setHours(CurrentDate.getHours() - hours))
    
    const data = await iamClient.send(new ListAccessKeysCommand(params))
    const keysData = data.AccessKeyMetadata || [];
    
    const result = keysData
    .filter((key) => key.CreateDate < TartgetDate)
    .map((key) => {
      return {
        UserName: key.UserName, 
        AccessKeyID: key.AccessKeyId, 
        CreateDate: key.CreateDate
      }
    })
    return result;
  }
}

export interface QueryType
{
  period?: number
  type?: string // 시간이 아닌 년월일을 구분하려고 만들었음 
}
