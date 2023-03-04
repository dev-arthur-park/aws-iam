export interface QueryType
{
  hours?: number
  statusType?: StatusType
}

export interface AwsAcceskeyResultType
{
    userName?: string,
    accessKeyID?: string,
    createDate?: Date
    status?: string
}

export interface AwsResponseResultType
{
    status: number
    result?: [AwsAcceskeyResultType]
    message?: string
}

type StatusType = "all" | "inactive" | "active"