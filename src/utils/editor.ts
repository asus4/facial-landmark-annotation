import { IFace } from '@/store/types'

export const cloneFace = (face: IFace): IFace => {
  return Object.assign({}, face)
}

export const deepCloneFace = (face: IFace): IFace => {
  return JSON.parse(JSON.stringify(face))
}
