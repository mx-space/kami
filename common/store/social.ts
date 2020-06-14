import configs from 'configs'
import { action, observable } from 'mobx'
import { SocialLinkModel } from './types'

export default class SocialStore {
  @observable socialLinks: SocialLinkModel[] = configs.social

  @action setSocialLinks(links: SocialLinkModel[]) {
    this.socialLinks = links
  }
}
