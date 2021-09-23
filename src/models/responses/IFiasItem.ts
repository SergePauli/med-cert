export interface IFiasItem {
  AOGUID: string
  HouseGUID?: string
  code?: string
  name: string
  streetAddressLine: string
  housenum?: string
  buildnum?: string
  strucnum?: string
  shortname?: string
  rustype?: string
  level: string
  postalCode?: string
  parent?: IFiasItem
}
