
export type LoginType = {
  authToken: string | undefined | null
  managerInfo: {
    id: number
    name: string
    email: string
    imageUrl: string
  }
  branchCampusInfos: any
  managerRoleInfos: Array<{
    id: number
    name: string
  }>
  features: Array<{
    id: number
    name: string
  }>
}