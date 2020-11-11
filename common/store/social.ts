import configs from 'configs'
import { makeAutoObservable } from 'mobx'
import { SocialLinkModel } from './types'

export default class SocialStore {
  constructor() {
    makeAutoObservable(this)
  }
  socialLinks: SocialLinkModel[] = configs.social

  setSocialLinks(links: SocialLinkModel[]) {
    this.socialLinks = links
  }
}
